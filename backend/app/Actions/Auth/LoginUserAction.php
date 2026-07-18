<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Handles user login.
 *
 * Responsibilities:
 *   1. Verify credentials
 *   2. Generate a Sanctum token
 *   3. Return user and token
 *
 * Throws ValidationException on invalid credentials.
 */
class LoginUserAction
{
    /**
     * Execute the login.
     *
     * @param  array<string, mixed>  $data  Validated login data (email, password)
     * @return array{user: User, token: string}
     *
     * @throws ValidationException
     */
    public function execute(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke existing tokens for this device to prevent token accumulation
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
