<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Department;
use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SystemConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Departments and Categories
        $departments = [
            'IT Support' => ['Hardware', 'Software', 'Network', 'Access Request'],
            'HR' => ['Payroll', 'Benefits', 'Onboarding'],
            'Finance' => ['Expenses', 'Invoicing', 'Procurement']
        ];

        foreach ($departments as $deptName => $categories) {
            $department = Department::firstOrCreate(['name' => $deptName], [
                'description' => "Handles $deptName inquiries",
                'is_active' => true,
            ]);

            foreach ($categories as $catName) {
                Category::firstOrCreate([
                    'department_id' => $department->id,
                    'name' => $catName,
                ], [
                    'description' => "$catName issues",
                    'is_active' => true,
                ]);
            }
        }

        // Create Statuses
        $statuses = [
            ['name' => 'Open', 'color' => '#3b82f6', 'is_closed' => false],
            ['name' => 'In Progress', 'color' => '#f59e0b', 'is_closed' => false],
            ['name' => 'Pending', 'color' => '#8b5cf6', 'is_closed' => false],
            ['name' => 'Resolved', 'color' => '#10b981', 'is_closed' => true],
            ['name' => 'Closed', 'color' => '#64748b', 'is_closed' => true],
        ];

        foreach ($statuses as $index => $status) {
            Status::firstOrCreate(['name' => $status['name']], [
                'slug' => Str::slug($status['name']),
                'color' => $status['color'],
                'is_closed' => $status['is_closed'],
                'sort_order' => $index + 1,
            ]);
        }
    }
}
