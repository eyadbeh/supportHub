<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\Events\ReplyAdded;
use App\Events\StatusChanged;
use App\Events\TicketAssigned;
use App\Notifications\TicketRepliedNotification;
use App\Notifications\TicketStatusChangedNotification;
use App\Notifications\TicketAssignedNotification;
use Illuminate\Events\Dispatcher;

class SendTicketNotification
{

    public function handleReplyAdded(ReplyAdded $event): void
    {
        $reply = $event->reply;
        $ticket = $reply->ticket;

        // If the reply is from the ticket owner, notify the assigned agent
        if ($reply->user_id === $ticket->user_id) {
            if ($ticket->assignedTo) {
                $ticket->assignedTo->notify(new TicketRepliedNotification($reply));
            }
        } else {
            // If the reply is from an agent, notify the ticket owner
            $ticket->user->notify(new TicketRepliedNotification($reply));
        }
    }

    public function handleStatusChanged(StatusChanged $event): void
    {
        $ticket = $event->ticket;
        // Notify the ticket owner
        $ticket->user->notify(new TicketStatusChangedNotification($ticket));
    }

    public function handleTicketAssigned(TicketAssigned $event): void
    {
        $ticket = $event->ticket;
        // Notify the assigned agent
        if ($ticket->assignedTo) {
            $ticket->assignedTo->notify(new TicketAssignedNotification($ticket));
        }
    }
}
