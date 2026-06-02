<?php

namespace App\Http\Controllers;

use App\Models\FollowerSnapshot;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class SNSAuthController extends Controller
{
    public function redirectToX(Request $request)
    {
        $redirect = Socialite::driver('twitter-plain')
            ->setScopes(['tweet.read', 'users.read', 'offline.access'])
            ->redirect();

        try {
            $state        = $request->session()->get('state');
            $codeVerifier = $request->session()->get('code_verifier');

            \Log::info('redirectToX: session data', [
                'has_state'         => $state ? 'yes' : 'no',
                'has_code_verifier' => $codeVerifier ? 'yes' : 'no',
                'state_value'       => $state,
                'user_id'           => $request->user()?->id,
                'redirect_url'      => $redirect->getTargetUrl(),
            ]);

            if ($state && $codeVerifier) {
                \Cache::put('x_pkce_' . $state, [
                    'code_verifier' => $codeVerifier,
                    'user_id'       => $request->user()->id,
                ], now()->addMinutes(10));
                \Log::info('redirectToX: PKCE cached', ['state' => $state]);
            } else {
                \Log::error('redirectToX: state or code_verifier missing from session!');
            }
        } catch (\Exception $e) {
            \Log::warning('redirectToX: could not save PKCE to cache', ['error' => $e->getMessage()]);
        }

        return $redirect;
    }

    public function handleXCallback(Request $request): \Illuminate\Http\RedirectResponse
    {
        $code  = $request->get('code');
        $state = $request->get('state');

        \Log::info('X callback received', [
            'has_code'   => $code ? 'yes' : 'no',
            'has_state'  => $state ? 'yes' : 'no',
            'all_params' => $request->all(),
            'ip'         => $request->ip(),
        ]);

        if ($request->get('error')) {
            \Log::warning('X callback: OAuth error from X', ['error' => $request->get('error')]);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        if (!$code || !$state) {
            \Log::warning('X callback: missing code or state');
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        $cached = \Cache::pull('x_pkce_' . $state);
        if (!$cached) {
            \Log::error('X callback: PKCE cache missing for state=' . $state);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        $codeVerifier = $cached['code_verifier'];
        $user = \App\Models\User::find($cached['user_id']);
        if (!$user) {
            \Log::error('X callback: user not found', ['user_id' => $cached['user_id']]);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        // Exchange authorization code for access token (direct HTTP, no session)
        $tokenResponse = \Illuminate\Support\Facades\Http::withBasicAuth(
            config('services.twitter-oauth-2.client_id'),
            config('services.twitter-oauth-2.client_secret')
        )->asForm()->post('https://api.twitter.com/2/oauth2/token', [
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'redirect_uri'  => config('services.twitter-oauth-2.redirect'),
            'code_verifier' => $codeVerifier,
        ]);

        if ($tokenResponse->failed()) {
            \Log::error('X callback: token exchange failed', ['body' => $tokenResponse->body()]);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        $accessToken  = $tokenResponse->json('access_token');
        $refreshToken = $tokenResponse->json('refresh_token');

        // Fetch user info from X API
        $userResponse = \Illuminate\Support\Facades\Http::withToken($accessToken)
            ->get('https://api.twitter.com/2/users/me', [
                'user.fields' => 'id,name,username',
            ]);

        if ($userResponse->failed()) {
            \Log::error('X callback: user fetch failed', ['body' => $userResponse->body()]);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        $xUserId = $userResponse->json('data.id');

        $user->update([
            'x_user_id'       => $xUserId,
            'x_access_token'  => $accessToken,
            'x_refresh_token' => $refreshToken,
        ]);

        \Log::info('X callback: success', ['user_id' => $user->id, 'x_user_id' => $xUserId]);

        return redirect(config('app.frontend_url') . '/settings?x_connected=1');
    }

    public function getXProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        

        if (!$user->x_access_token) {
            return response()->json(['connected' => false], 200);
        }

        try {
            $response = \Illuminate\Support\Facades\Http::withToken($user->x_access_token)
                ->get('https://api.twitter.com/2/users/me', [
                    'user.fields' => 'public_metrics,profile_image_url,username',
                ]);

            if ($response->failed()) {
                return response()->json(['connected' => true, 'error' => 'fetch_failed'], 200);
            }

            $data = $response->json('data');

            return response()->json([
                'connected'    => true,
                'username'     => $data['username'] ?? null,
                'name'         => $data['name'] ?? null,
                'followers'    => $data['public_metrics']['followers_count'] ?? 0,
                'following'    => $data['public_metrics']['following_count'] ?? 0,
                'tweet_count'  => $data['public_metrics']['tweet_count'] ?? 0,
                'avatar'       => $data['profile_image_url'] ?? null,
            ]);
        } catch (\Exception $e) {
            \Log::error('getXProfile error', ['message' => $e->getMessage()]);
            return response()->json(['connected' => true, 'error' => 'exception'], 200);
        }
    }

    public function getXTweets(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->x_access_token || !$user->x_user_id) {
            return response()->json(['connected' => false], 200);
        }

        $response = \Illuminate\Support\Facades\Http::withToken($user->x_access_token)
            ->get("https://api.twitter.com/2/users/{$user->x_user_id}/tweets", [
                'max_results'  => 10,
                'tweet.fields' => 'public_metrics,created_at',
                'exclude'      => 'replies,retweets',
            ]);

        if ($response->failed()) {
            \Log::error('getXTweets: fetch failed', ['body' => $response->body()]);
            return response()->json(['connected' => true, 'tweets' => []], 200);
        }

        $tweets = collect($response->json('data') ?? [])->map(function ($tweet) {
            $pub = $tweet['public_metrics'] ?? [];
            return [
                'id'       => $tweet['id'],
                'content'  => $tweet['text'],
                'posted_at' => substr($tweet['created_at'] ?? '', 0, 10),
                'likes'    => $pub['like_count'] ?? 0,
                'retweets' => $pub['retweet_count'] ?? 0,
                'replies'  => $pub['reply_count'] ?? 0,
                'quotes'   => $pub['quote_count'] ?? 0,
            ];
        });

        return response()->json(['connected' => true, 'tweets' => $tweets]);
    }

    public function getXFollowerHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->x_access_token) {
            return response()->json(['connected' => false], 200);
        }

        $snapshots = FollowerSnapshot::where('user_id', $user->id)
            ->orderBy('recorded_at', 'desc')
            ->limit(48)
            ->get(['followers_count', 'recorded_at'])
            ->reverse()
            ->values();

        $data = $snapshots->map(fn($s) => [
            'date'  => Carbon::parse($s->recorded_at)->timezone('Asia/Tokyo')->format('H:i'),
            'count' => $s->followers_count,
        ]);

        return response()->json(['connected' => true, 'data' => $data]);
    }

    public function getXSummary(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->x_access_token || !$user->x_user_id) {
            return response()->json(['connected' => false], 200);
        }

        $response = Http::withToken($user->x_access_token)
            ->get("https://api.twitter.com/2/users/{$user->x_user_id}/tweets", [
                'max_results'  => 100,
                'tweet.fields' => 'public_metrics,created_at,attachments',
                'expansions'   => 'attachments.media_keys',
                'media.fields' => 'type',
            ]);

        if ($response->failed()) {
            return response()->json(['connected' => true, 'error' => 'fetch_failed'], 200);
        }

        $mediaMap = [];
        foreach ($response->json('includes.media') ?? [] as $media) {
            $mediaMap[$media['media_key']] = $media['type'];
        }

        $tweets  = collect($response->json('data') ?? []);
        $weekAgo = now()->subDays(7);

        $thisWeek = $tweets->filter(
            fn($t) => Carbon::parse($t['created_at'])->gte($weekAgo)
        );

        $postsThisWeek = $thisWeek->count();

        $replyCount = $thisWeek->filter(fn($t) => str_starts_with($t['text'], '@'))->count();
        $replyRate  = $postsThisWeek > 0 ? round($replyCount / $postsThisWeek * 100) : 0;

        $hourEngagement   = [];
        $formatEngagement = [];

        // 時間帯集計は全ツイート対象
        foreach ($thisWeek as $tweet) {
            $hour = (int) Carbon::parse($tweet['created_at'])->timezone('Asia/Tokyo')->format('H');
            $pub  = $tweet['public_metrics'] ?? [];
            $engagement = ($pub['like_count'] ?? 0) + ($pub['retweet_count'] ?? 0) + ($pub['reply_count'] ?? 0);
            $hourEngagement[$hour] = ($hourEngagement[$hour] ?? 0) + $engagement;
        }

        // フォーマット集計は返信を除いたオリジナル投稿のみ
        $ownPosts = $thisWeek->filter(fn($t) => !str_starts_with($t['text'], '@'));

        foreach ($ownPosts as $tweet) {
            $pub  = $tweet['public_metrics'] ?? [];
            $engagement = ($pub['like_count'] ?? 0) + ($pub['retweet_count'] ?? 0) + ($pub['reply_count'] ?? 0);

            $mediaKeys = $tweet['attachments']['media_keys'] ?? [];
            $format    = 'テキスト投稿';
            if (!empty($mediaKeys)) {
                $hasVideo = collect($mediaKeys)->contains(
                    fn($k) => in_array($mediaMap[$k] ?? '', ['video', 'animated_gif'])
                );
                $format = $hasVideo ? '動画投稿' : '画像投稿';
            }

            if (!isset($formatEngagement[$format])) {
                $formatEngagement[$format] = ['total' => 0, 'count' => 0];
            }
            $formatEngagement[$format]['total'] += $engagement;
            $formatEngagement[$format]['count']++;
        }

        $bestHourLabel = '-';
        if (!empty($hourEngagement)) {
            arsort($hourEngagement);
            $h = array_key_first($hourEngagement);
            $bestHourLabel = "{$h}-" . ($h + 1) . '時';
        }

        $topFormat = 'テキスト投稿';
        if (!empty($formatEngagement)) {
            $formatAvg = array_map(
                fn($v) => $v['count'] > 0 ? $v['total'] / $v['count'] : 0,
                $formatEngagement
            );
            arsort($formatAvg);
            $topFormat = array_key_first($formatAvg);
        }

        return response()->json([
            'connected'       => true,
            'posts_this_week' => $postsThisWeek,
            'reply_rate'      => $replyRate,
            'best_hour'       => $bestHourLabel,
            'top_format'      => $topFormat,
        ]);
    }

    public function disconnectX(Request $request): JsonResponse
    {
        $request->user()->update([
            'x_user_id'       => null,
            'x_access_token'  => null,
            'x_refresh_token' => null,
        ]);

        return response()->json(['message' => 'disconnected']);
    }
}
