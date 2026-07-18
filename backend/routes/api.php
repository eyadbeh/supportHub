<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\ReplyController;
use App\Http\Controllers\Api\TicketActivityController;
use Illuminate\Support\Facades\Route;

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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically.
|
| Route groups:
|   - Health check (public)
|   - Auth (guest/authenticated)
|   - Protected routes (auth:sanctum) — added in future sprints
|
*/

// Health Check
Route::get('/health', fn () => response()->json([
    'success' => true,
    'message' => 'SupportHub API is running.',
    'data' => [
        'version' => '1.0.0',
        'environment' => app()->environment(),
    ],
]));

// Authentication — Guest routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authentication — Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Admin Routes
    Route::middleware('role:Admin')->prefix('admin')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
        Route::apiResource('departments', \App\Http\Controllers\Api\Admin\DepartmentController::class)->except(['index', 'show']);
        Route::apiResource('categories', \App\Http\Controllers\Api\Admin\CategoryController::class)->except(['index', 'show']);
        Route::apiResource('statuses', \App\Http\Controllers\Api\Admin\StatusController::class)->except(['index', 'show']);
    });

    // Public / Shared Lookups
    Route::get('departments', [\App\Http\Controllers\Api\Admin\DepartmentController::class, 'index']);
    Route::get('departments/{department}', [\App\Http\Controllers\Api\Admin\DepartmentController::class, 'show']);
    Route::get('categories', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'index']);
    Route::get('categories/{category}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'show']);
    Route::get('statuses', [\App\Http\Controllers\Api\Admin\StatusController::class, 'index']);
    Route::get('statuses/{status}', [\App\Http\Controllers\Api\Admin\StatusController::class, 'show']);

    // Profile Routes
    Route::get('profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);

    // Notification Routes
    Route::get('notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::patch('notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::patch('notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

    // Ticket Routes
    Route::apiResource('tickets', TicketController::class)->except(['destroy']);
    Route::get('tickets/{ticket}/replies', [ReplyController::class, 'index']);
    Route::post('tickets/{ticket}/replies', [ReplyController::class, 'store']);
    Route::get('tickets/{ticket}/activities', [TicketActivityController::class, 'index']);
});
