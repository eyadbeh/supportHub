<?php

namespace App\Actions\Admin;

use App\Models\Status;

class UpdateStatusAction
{
    public function execute(Status $status, array $data): Status
    {
        $status->update([
            'name' => $data['name'] ?? $status->name,
            'slug' => $data['slug'] ?? $status->slug,
            'color' => array_key_exists('color', $data) ? $data['color'] : $status->color,
            'is_closed' => $data['is_closed'] ?? $status->is_closed,
            'sort_order' => $data['sort_order'] ?? $status->sort_order,
        ]);

        return $status;
    }
}
