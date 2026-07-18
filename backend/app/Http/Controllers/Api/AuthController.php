<?php

namespace App\Http\Controllers\Api;

use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

/**
 * Handles authentication endpoints.
 *
 * Endpoints:
 *   POST /auth/register — create a new user account
 *   POST /auth/login    — authenticate via session
 *   POST /auth/logout   — destroy the session
 *   GET  /auth/me       — get the authenticated user
 */
class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $user = $action->execute($request->validated());
        
        Auth::login($user);

        return $this->success([
            'user' => new UserResource($user),
        ], 'Registration successful.', 201);
    }

    /**
     * Authenticate a user via session.
     */
    public function login(LoginRequest $request, LoginUserAction $action): JsonResponse
    {
        $user = $action->execute($request->validated());
        $request->session()->regenerate();

        return $this->success([
            'user' => new UserResource($user),
        ], 'Login successful.');
    }

    /**
     * Logout the authenticated user and destroy session.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Get the authenticated user's profile.
     *
     * Returns user data with roles and permissions.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            new UserResource($request->user()),
            'User retrieved successfully.'
        );
    }
}
