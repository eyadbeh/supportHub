<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
    public function execute(array $data): User
    {
        if (! Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Return the authenticated user
        return Auth::user();
    }
}
