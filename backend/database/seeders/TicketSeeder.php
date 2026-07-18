<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Department;
use App\Models\Reply;
use App\Models\Status;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::role('User')->get();
        $agents = User::role('Support')->get();
        
        $departments = Department::with('categories')->get();
        $statuses = Status::all();

        if ($users->isEmpty() || $agents->isEmpty() || $departments->isEmpty() || $statuses->isEmpty()) {
            $this->command->warn('Necessary related data is missing. Skipping Ticket Seeder.');
            return;
        }

        foreach ($users as $user) {
            // Create 3-5 tickets for each user
            for ($i = 0; $i < rand(3, 5); $i++) {
                $dept = $departments->random();
                $cat = $dept->categories->random();
                $status = $statuses->random();
                $agent = rand(0, 1) ? $agents->random() : null;

                $ticket = Ticket::factory()->create([
                    'user_id' => $user->id,
                    'department_id' => $dept->id,
                    'category_id' => $cat->id,
                    'status_id' => $status->id,
                    'assigned_to' => $agent ? $agent->id : null,
                ]);

                // Create 1-3 replies
                for ($j = 0; $j < rand(1, 3); $j++) {
                    Reply::factory()->create([
                        'ticket_id' => $ticket->id,
                        'user_id' => rand(0, 1) ? $user->id : ($agent ? $agent->id : User::role('Admin')->first()->id),
                    ]);
                }
            }
        }
    }
}
