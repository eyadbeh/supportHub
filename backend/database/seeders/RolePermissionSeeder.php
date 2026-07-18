<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seeds roles and permissions for the SupportHub RBAC system.
 *
 * Roles: Admin, Support, User
 *
 * Permission naming convention: resource.action
 * Example: tickets.create, departments.list
 */
class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Define Permissions ──────────────────────────────────────

        $permissions = [
            // User management
            'users.list',
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // Department management
            'departments.list',
            'departments.view',
            'departments.create',
            'departments.update',
            'departments.delete',

            // Category management
            'categories.list',
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // Status management
            'statuses.list',
            'statuses.view',
            'statuses.create',
            'statuses.update',
            'statuses.delete',

            // Ticket operations
            'tickets.list',
            'tickets.view',
            'tickets.create',
            'tickets.assign',
            'tickets.transfer',
            'tickets.close',
            'tickets.reopen',

            // Replies
            'replies.create',

            // Dashboard & Reports
            'dashboard.view',
            'reports.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Define Roles ────────────────────────────────────────────

        // Admin: unrestricted access
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions($permissions);

        // Support: department-scoped ticket operations
        $support = Role::firstOrCreate(['name' => 'Support']);
        $support->syncPermissions([
            'departments.list',
            'departments.view',
            'categories.list',
            'categories.view',
            'statuses.list',
            'statuses.view',
            'tickets.list',
            'tickets.view',
            'tickets.assign',
            'tickets.transfer',
            'tickets.close',
            'replies.create',
        ]);

        // User: basic ticket operations
        $user = Role::firstOrCreate(['name' => 'User']);
        $user->syncPermissions([
            'tickets.list',
            'tickets.view',
            'tickets.create',
            'tickets.reopen',
            'replies.create',
        ]);
    }
}
