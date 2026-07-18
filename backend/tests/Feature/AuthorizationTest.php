<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'User']);
        Role::create(['name' => 'Support']);
        Role::create(['name' => 'Admin']);
    }

    public function test_user_cannot_access_admin_routes()
    {
        $user = User::factory()->create();
        $user->assignRole('User');

        $response = $this->actingAs($user)->getJson('/api/admin/users');

        // Either 403 Forbidden or 401 depending on middleware configuration, but Spatie returns 403.
        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/tickets');
        $response->assertStatus(401);
    }
}
