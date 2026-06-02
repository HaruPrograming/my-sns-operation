<?php

namespace App\Providers;

use App\Services\TwitterPlainPkceProvider;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Socialite::extend('twitter-plain', function ($app) {
            $config = $app['config']['services']['twitter-oauth-2'];
            return Socialite::buildProvider(TwitterPlainPkceProvider::class, $config);
        });
    }
}
