<?php

namespace App\Actions\Ticket;

use App\Models\Reply;
use App\Models\Ticket;

class CreateReplyAction
{
    public function execute(Ticket $ticket, array $data, int $userId): Reply
    {
        $reply = $ticket->replies()->create([
            'user_id' => $userId,
            'message' => $data['message'],
        ]);

        activity()
            ->performedOn($ticket)
            ->causedBy(\App\Models\User::find($userId))
            ->event('reply_added')
            ->log('Reply added to ticket');

        return $reply;
    }
}
