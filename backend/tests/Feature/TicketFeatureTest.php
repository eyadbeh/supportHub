<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Department;
use App\Models\Status;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TicketFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles and default statuses exist
        Role::create(['name' => 'User']);
        Status::create(['name' => 'Open', 'slug' => 'open', 'color' => '#3b82f6', 'is_default' => true]);
    }

    public function test_user_can_create_ticket()
    {
        $user = User::factory()->create();
        $user->assignRole('User');

        $dept = Department::create(['name' => 'IT', 'is_active' => true]);
        $cat = Category::create(['name' => 'Hardware', 'department_id' => $dept->id, 'is_active' => true]);

        $response = $this->actingAs($user)->postJson('/api/tickets', [
            'title' => 'My computer is broken',
            'description' => 'It wont turn on',
            'department_id' => $dept->id,
            'category_id' => $cat->id,
            'priority' => 'High',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', [
            'title' => 'My computer is broken',
            'user_id' => $user->id,
            'department_id' => $dept->id,
            'category_id' => $cat->id,
            'priority' => 'High',
        ]);
    }

    public function test_user_can_only_view_own_tickets()
    {
        $user1 = User::factory()->create();
        $user1->assignRole('User');

        $user2 = User::factory()->create();
        $user2->assignRole('User');

        $dept = Department::create(['name' => 'IT', 'is_active' => true]);
        $cat = Category::create(['name' => 'Hardware', 'department_id' => $dept->id, 'is_active' => true]);
        $status = Status::where('name', 'Open')->first();

        // Ticket for User 1
        $this->actingAs($user1)->postJson('/api/tickets', [
            'title' => 'Ticket 1',
            'description' => 'Desc 1',
            'department_id' => $dept->id,
            'category_id' => $cat->id,
            'priority' => 'Medium',
        ]);

        // Ticket for User 2
        $this->actingAs($user2)->postJson('/api/tickets', [
            'title' => 'Ticket 2',
            'description' => 'Desc 2',
            'department_id' => $dept->id,
            'category_id' => $cat->id,
            'priority' => 'Low',
        ]);

        $response = $this->actingAs($user1)->getJson('/api/tickets');
        $response->assertStatus(200);

        // User 1 should only see 1 ticket
        $this->assertCount(1, $response->json());
        $this->assertEquals('Ticket 1', $response->json('0.title'));
    }
}
