<?php

namespace App\Console\Commands;

use App\Models\FollowerSnapshot;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

#[Signature('app:record-follower-snapshots')]
#[Description('Record daily follower counts for all X-connected users')]
class RecordFollowerSnapshots extends Command
{
    public function handle(): void
    {
        $now = now();

        User::whereNotNull('x_access_token')
            ->whereNotNull('x_user_id')
            ->each(function (User $user) use ($now) {
                $response = Http::withToken($user->x_access_token)
                    ->get("https://api.twitter.com/2/users/{$user->x_user_id}", [
                        'user.fields' => 'public_metrics',
                    ]);

                if ($response->failed()) {
                    Log::warning('RecordFollowerSnapshots: failed', ['user_id' => $user->id]);
                    return;
                }

                $followers = $response->json('data.public_metrics.followers_count');
                if ($followers === null) return;

                FollowerSnapshot::create([
                    'user_id'         => $user->id,
                    'followers_count' => $followers,
                    'recorded_at'     => $now,
                ]);
            });

        $this->info('Done.');
    }
}
