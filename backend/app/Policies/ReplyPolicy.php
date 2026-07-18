<?php

namespace App\Policies;

use App\Models\Reply;
use App\Models\Ticket;
use App\Models\User;

class ReplyPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Reply $reply): bool
    {
        return $user->can('view', $reply->ticket);
    }

    public function create(User $user, Ticket $ticket): bool
    {
        if ($ticket->status && $ticket->status->is_closed) {
            return false;
        }

        return $user->can('view', $ticket);
    }

    public function update(User $user, Reply $reply): bool
    {
        return false;
    }

    public function delete(User $user, Reply $reply): bool
    {
        return false;
    }
}
