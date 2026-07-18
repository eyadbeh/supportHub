<?php

namespace App\Actions\Admin;

use App\Models\Category;

class UpdateCategoryAction
{
    public function execute(Category $category, array $data): Category
    {
        $category->update([
            'department_id' => $data['department_id'] ?? $category->department_id,
            'name' => $data['name'] ?? $category->name,
            'description' => array_key_exists('description', $data) ? $data['description'] : $category->description,
            'is_active' => $data['is_active'] ?? $category->is_active,
        ]);

        return $category;
    }
}
