<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Dispatched when a new user registers.
 *
 * Listeners can:
 *   - Send a welcome notification
 *   - Log the registration activity
 */
class UserRegistered
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public readonly User $user
    ) {}
}
