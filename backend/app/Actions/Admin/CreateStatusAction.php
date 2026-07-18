<?php

namespace App\Actions\Admin;

use App\Models\Status;

class CreateStatusAction
{
    public function execute(array $data): Status
    {
        return Status::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'color' => $data['color'] ?? null,
            'is_closed' => $data['is_closed'] ?? false,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);
    }
}
