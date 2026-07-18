<?php

namespace App\Policies;

use App\Models\User;

/**
 * Authorization policy for User management.
 *
 * Only Admins can manage users.
 */
class UserPolicy
{
    /**
     * Admins bypass all authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }

        return null;
    }

    /**
     * Only Admins can list users.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Users can view their own profile. Admins can view anyone.
     */
    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id;
    }

    /**
     * Only Admins can create users.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Users can update their own profile. Admins can update anyone.
     */
    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id;
    }

    /**
     * Only Admins can delete users.
     */
    public function delete(User $user): bool
    {
        return false;
    }
}
