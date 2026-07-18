<?php

use App\Actions\Ticket\CreateReplyAction;
use App\Actions\Ticket\CreateTicketAction;
use App\Actions\Ticket\UpdateTicketAction;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\DepartmentController;
use App\Http\Controllers\Api\Admin\StatusController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReplyController;
use App\Http\Controllers\Api\TicketActivityController;
use App\Http\Controllers\Api\TicketController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

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
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{user}/role', [UserController::class, 'updateRole']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::post('users/{id}/restore', [UserController::class, 'restore']);
        Route::apiResource('departments', DepartmentController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('statuses', StatusController::class)->except(['index', 'show']);
    });

    // Public / Shared Lookups
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::get('departments/{department}', [DepartmentController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);
    Route::get('statuses', [StatusController::class, 'index']);
    Route::get('statuses/{status}', [StatusController::class, 'show']);

    // Profile Routes
    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('profile', [ProfileController::class, 'update']);

    // Notification Routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Ticket Routes
    Route::apiResource('tickets', TicketController::class)->except(['destroy']);
    Route::get('tickets/{ticket}/replies', [ReplyController::class, 'index']);
    Route::post('tickets/{ticket}/replies', [ReplyController::class, 'store']);
    Route::get('tickets/{ticket}/activities', [TicketActivityController::class, 'index']);
});
