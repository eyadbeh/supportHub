<?php

namespace App\Policies;

use App\Models\User;

/**
 * Authorization policy for Status management.
 *
 * Only Admins can manage statuses.
 * All roles can view statuses (for ticket filters and dropdowns).
 */
class StatusPolicy
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
     * Any authenticated user can view the status list.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a single status.
     */
    public function view(User $user): bool
    {
        return true;
    }

    /**
     * Only Admins can create statuses.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can update statuses.
     */
    public function update(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can delete statuses.
     */
    public function delete(User $user): bool
    {
        return false;
    }
}
