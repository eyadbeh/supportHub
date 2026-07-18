<?php

namespace App\Actions\Admin;

use App\Models\Department;
use Illuminate\Validation\ValidationException;

class DeleteDepartmentAction
{
    public function execute(Department $department): void
    {
        // Prevent deletion if active tickets exist
        // $ticketsCount = $department->tickets()->whereNotIn('status_id', [closed_statuses])->count();
        // For now, let's assume tickets relation doesn't exist yet, but we stub it.
        // if ($ticketsCount > 0) throw ValidationException::withMessages(['department' => 'Cannot delete department with active tickets.']);

        $department->delete();
    }
}
