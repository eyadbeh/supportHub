<?php

namespace App\Actions\Ticket;

use App\Models\Status;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateTicketAction
{
    public function execute(array $data, int $userId): Ticket
    {
        return DB::transaction(function () use ($data, $userId) {
            // Generate unique ticket number: SUP-XXXXXX
            $data['ticket_number'] = 'SUP-'.strtoupper(Str::random(6));
            $data['user_id'] = $userId;

            // Default to the "Open" status or lowest sort order status if not provided
            if (! isset($data['status_id'])) {
                $defaultStatus = Status::orderBy('sort_order')->first();
                $data['status_id'] = $defaultStatus->id;
            }

            $ticket = Ticket::create($data);

            activity()
                ->performedOn($ticket)
                ->causedBy(User::find($userId))
                ->event('created')
                ->log('Ticket created');

            return $ticket;
        });
    }
}
