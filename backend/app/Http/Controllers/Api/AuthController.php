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

/**
 * Handles authentication endpoints.
 *
 * Endpoints:
 *   POST /auth/register — create a new user account
 *   POST /auth/login    — authenticate and receive a token
 *   POST /auth/logout   — revoke the current token
 *   GET  /auth/me       — get the authenticated user
 */
class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * Flow: Validate → Create User → Assign Role → Generate Token → Return 201
     */
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $user = $action->execute($request->validated());
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Registration successful.', 201);
    }

    /**
     * Authenticate a user and return a token.
     *
     * Flow: Validate → Verify Credentials → Generate Token → Return User + Token
     */
    public function login(LoginRequest $request, LoginUserAction $action): JsonResponse
    {
        $result = $action->execute($request->validated());

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login successful.');
    }

    /**
     * Logout the authenticated user.
     *
     * Revokes the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

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
