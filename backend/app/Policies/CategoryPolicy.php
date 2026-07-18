<?php

namespace App\Policies;

use App\Models\User;

/**
 * Authorization policy for Category management.
 *
 * Only Admins can manage categories.
 * All roles can view categories (for ticket creation dropdowns).
 */
class CategoryPolicy
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
     * Any authenticated user can view the category list.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a single category.
     */
    public function view(User $user): bool
    {
        return true;
    }

    /**
     * Only Admins can create categories.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can update categories.
     */
    public function update(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can delete categories.
     */
    public function delete(User $user): bool
    {
        return false;
    }
}
