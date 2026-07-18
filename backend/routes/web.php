<?php

// Web routes are not used in this API-only application.
// All routes are defined in routes/api.php.

Route::get('/test-notifs', function () {
    $user = \App\Models\User::where('email', 'user@supporthub.test')->first();
    $support = \App\Models\User::where('email', 'support@supporthub.test')->first();

    $ticket = app(\App\Actions\Ticket\CreateTicketAction::class)->execute([
        'title' => 'Tinker Test Ticket',
        'description' => 'Just testing notifications.',
        'department_id' => 1,
        'category_id' => 1,
        'priority' => 'High'
    ], $user->id);

    echo "Ticket created: {$ticket->ticket_number}\n";

    app(\App\Actions\Ticket\UpdateTicketAction::class)->execute($ticket, ['assigned_to' => $support->id], $user->id);
    echo "Support notifications: " . $support->notifications()->count() . "\n";

    app(\App\Actions\Ticket\CreateReplyAction::class)->execute($ticket, ['message' => 'Hello from support'], $support->id);
    echo "User notifications: " . $user->notifications()->count() . "\n";
});
