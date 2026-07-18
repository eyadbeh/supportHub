<?php

namespace App\Actions\Ticket;

use App\Models\Ticket;
use App\Models\Status;

class UpdateTicketAction
{
    public function execute(Ticket $ticket, array $data, int $userId): Ticket
    {
        $oldStatusId = $ticket->status_id;
        $oldAssignedTo = $ticket->assigned_to;

        $ticket->update($data);

        // Check if status changed and if the new status is marked as closed
        if (isset($data['status_id']) && $data['status_id'] != $oldStatusId) {
            $newStatus = Status::find($data['status_id']);
            if ($newStatus && $newStatus->is_closed) {
                $ticket->closed_at = now();
                $ticket->save();
            } elseif ($ticket->closed_at) {
                // Reopened
                $ticket->closed_at = null;
                $ticket->save();
            }

            activity()
                ->performedOn($ticket)
                ->causedBy(\App\Models\User::find($userId))
                ->event('status_changed')
                ->log("Status changed to {$newStatus->name}");
        }

        if (array_key_exists('assigned_to', $data) && $data['assigned_to'] != $oldAssignedTo) {
            $logMessage = $data['assigned_to'] ? "Ticket assigned" : "Ticket unassigned";
            activity()
                ->performedOn($ticket)
                ->causedBy(\App\Models\User::find($userId))
                ->event('assigned')
                ->log($logMessage);
        }

        return $ticket->fresh();
    }
}
