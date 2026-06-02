<?php

namespace App\Services;

use Laravel\Socialite\Two\TwitterProvider;

class TwitterPlainPkceProvider extends TwitterProvider
{
    public function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://x.com/i/oauth2/authorize', $state);
    }

    protected function getCodeChallenge()
    {
        return $this->request->session()->get('code_verifier');
    }

    protected function getCodeChallengeMethod()
    {
        return 'plain';
    }
}
