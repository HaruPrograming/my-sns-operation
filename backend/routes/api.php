<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SNSAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::get('/auth/x/callback', [SNSAuthController::class, 'handleXCallback']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/auth/x', [SNSAuthController::class, 'redirectToX']);
    Route::get('/sns/x/profile', [SNSAuthController::class, 'getXProfile']);
    Route::get('/sns/x/tweets', [SNSAuthController::class, 'getXTweets']);
    Route::get('/sns/x/follower-history', [SNSAuthController::class, 'getXFollowerHistory']);
    Route::get('/sns/x/summary', [SNSAuthController::class, 'getXSummary']);
    Route::delete('/sns/x', [SNSAuthController::class, 'disconnectX']);
});
