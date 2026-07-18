<?php

namespace App\Actions\Admin;

use App\Models\Status;
use Illuminate\Validation\ValidationException;

class DeleteStatusAction
{
    public function execute(Status $status): void
    {
        // Business Rule: Cannot delete default statuses
        // For now, let's say we block deleting statuses that are hardcoded or tied to tickets
        // $ticketsCount = $status->tickets()->count();
        // if ($ticketsCount > 0) throw ValidationException::withMessages(['status' => 'Cannot delete status with active tickets.']);

        $status->delete();
    }
}
