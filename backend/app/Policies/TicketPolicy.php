<?php

namespace App\Policies;

use App\Models\User;

/**
 * Authorization policy for Ticket operations.
 *
 * Full implementation deferred to Sprint 3 when the Ticket model exists.
 * Method stubs are defined here to establish the authorization contract.
 *
 * Authorization Matrix (from docs):
 *   view:         Owner ✅, Support (dept) ✅, Admin ✅
 *   reply:        Owner ✅, Support (dept) ✅, Admin ✅
 *   assign:       Support ✅, Admin ✅
 *   transfer:     Support ✅, Admin ✅
 *   updateStatus: Support ✅, Admin ✅
 *   close:        Support ✅, Admin ✅ (only when Resolved)
 *   reopen:       Owner ✅, Admin ✅ (only when Closed)
 */
class TicketPolicy
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

    // Method stubs — implemented in Sprint 3
    // public function viewAny(User $user): bool {}
    // public function view(User $user, Ticket $ticket): bool {}
    // public function create(User $user): bool {}
    // public function reply(User $user, Ticket $ticket): bool {}
    // public function assign(User $user, Ticket $ticket): bool {}
    // public function transfer(User $user, Ticket $ticket): bool {}
    // public function updateStatus(User $user, Ticket $ticket): bool {}
    // public function close(User $user, Ticket $ticket): bool {}
    // public function reopen(User $user, Ticket $ticket): bool {}
}
