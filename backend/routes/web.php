<?php

use App\Actions\Ticket\CreateReplyAction;
use App\Actions\Ticket\CreateTicketAction;
use App\Actions\Ticket\UpdateTicketAction;
use App\Models\User;

// Web routes are not used in this API-only application.
// All routes are defined in routes/api.php.

Route::get('/test-notifs', function () {
    $user = User::where('email', 'user@supporthub.test')->first();
    $support = User::where('email', 'support@supporthub.test')->first();

    $ticket = app(CreateTicketAction::class)->execute([
        'title' => 'Tinker Test Ticket',
        'description' => 'Just testing notifications.',
        'department_id' => 1,
        'category_id' => 1,
        'priority' => 'High',
    ], $user->id);

    echo "Ticket created: {$ticket->ticket_number}\n";

    app(UpdateTicketAction::class)->execute($ticket, ['assigned_to' => $support->id], $user->id);
    echo 'Support notifications: '.$support->notifications()->count()."\n";

    app(CreateReplyAction::class)->execute($ticket, ['message' => 'Hello from support'], $support->id);
    echo 'User notifications: '.$user->notifications()->count()."\n";
});
