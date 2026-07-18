<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_number' => 'SUP-' . strtoupper($this->faker->unique()->bothify('?????###')),
            'user_id' => \App\Models\User::factory(),
            'department_id' => \App\Models\Department::inRandomOrder()->first()->id ?? 1,
            'category_id' => \App\Models\Category::inRandomOrder()->first()->id ?? 1,
            'status_id' => \App\Models\Status::inRandomOrder()->first()->id ?? 1,
            'assigned_to' => null,
            'priority' => $this->faker->randomElement(['Low', 'Medium', 'High', 'Critical']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(3),
            'closed_at' => null,
        ];
    }
}
