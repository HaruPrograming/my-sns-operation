<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SNSAuthController extends Controller
{
    public function redirectToX()
    {
        return Socialite::driver('twitter-oauth-2')
            ->scopes(['tweet.read', 'users.read', 'follows.read'])
            ->redirect();
    }

    public function handleXCallback(Request $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $xUser = Socialite::driver('twitter-oauth-2')->user();
        } catch (\Exception $e) {
            \Log::error('handleXCallback error', ['message' => $e->getMessage()]);
            return redirect(config('app.frontend_url') . '/settings?x_error=1');
        }

        $request->user()->update([
            'x_user_id'       => $xUser->getId(),
            'x_access_token'  => $xUser->token,
            'x_refresh_token' => $xUser->refreshToken,
        ]);

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
