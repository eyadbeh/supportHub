<?php

namespace App\Actions\Admin;

use App\Models\Department;

class CreateDepartmentAction
{
    public function execute(array $data): Department
    {
        return Department::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }
}
