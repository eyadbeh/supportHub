<?php

namespace App\Actions\Auth;

use App\Events\UserRegistered;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Handles user registration.
 *
 * Responsibilities:
 *   1. Create the user record
 *   2. Assign the "User" role
 *   3. Dispatch UserRegistered event
 *   4. Return the created user
 */
class RegisterUserAction
{
    /**
     * Execute the registration.
     *
     * @param  array<string, mixed>  $data  Validated registration data
     */
    public function execute(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $user->assignRole('User');

            event(new UserRegistered($user));

            return $user;
        });
    }
}
