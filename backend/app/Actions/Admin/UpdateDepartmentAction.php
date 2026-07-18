<?php

namespace App\Actions\Admin;

use App\Models\Department;

class UpdateDepartmentAction
{
    public function execute(Department $department, array $data): Department
    {
        $department->update([
            'name' => $data['name'] ?? $department->name,
            'description' => array_key_exists('description', $data) ? $data['description'] : $department->description,
            'is_active' => $data['is_active'] ?? $department->is_active,
        ]);

        return $department;
    }
}
