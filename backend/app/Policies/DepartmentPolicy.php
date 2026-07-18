<?php

namespace App\Policies;

use App\Models\User;

/**
 * Authorization policy for Department management.
 *
 * Only Admins can manage departments.
 * All roles can view the department list (for dropdowns/filters).
 */
class DepartmentPolicy
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
     * Any authenticated user can view the department list.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a single department.
     */
    public function view(User $user): bool
    {
        return true;
    }

    /**
     * Only Admins can create departments.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can update departments.
     */
    public function update(User $user): bool
    {
        return false;
    }

    /**
     * Only Admins can delete departments.
     */
    public function delete(User $user): bool
    {
        return false;
    }
}
