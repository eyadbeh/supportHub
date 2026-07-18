<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically.
|
| Route groups:
|   - Health check (public)
|   - Auth (guest/authenticated)
|   - Protected routes (auth:sanctum) — added in future sprints
|
*/

// Health Check
Route::get('/health', fn () => response()->json([
    'success' => true,
    'message' => 'SupportHub API is running.',
    'data' => [
        'version' => '1.0.0',
        'environment' => app()->environment(),
    ],
]));

// Authentication — Guest routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authentication — Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});
