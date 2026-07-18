<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeds demo users for development and testing.
 *
 * Users:
 *   - Admin:   admin@supporthub.test   / password
 *   - Support: support@supporthub.test / password
 *   - User:    user@supporthub.test    / password
 */
class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@supporthub.test'],
            [
                'name' => 'Admin User',
                'password' => 'password',
            ]
        );
        $admin->assignRole('Admin');

        // Support user
        $support = User::firstOrCreate(
            ['email' => 'support@supporthub.test'],
            [
                'name' => 'Support Agent',
                'password' => 'password',
            ]
        );
        $support->assignRole('Support');

        // Standard user
        $user = User::firstOrCreate(
            ['email' => 'user@supporthub.test'],
            [
                'name' => 'John Doe',
                'password' => 'password',
            ]
        );
        $user->assignRole('User');
    }
}
