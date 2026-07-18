<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Ticket;
use App\Models\Reply;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Overview counts (using dynamic statuses)
        $statusCounts = Ticket::join('statuses', 'tickets.status_id', '=', 'statuses.id')
            ->select('statuses.name', DB::raw('count(*) as count'))
            ->groupBy('statuses.name')
            ->pluck('count', 'name');

        $totalTickets = Ticket::count();

        // 2. Distributions
        $byDepartment = Ticket::join('departments', 'tickets.department_id', '=', 'departments.id')
            ->select('departments.name', DB::raw('count(*) as count'))
            ->groupBy('departments.name')
            ->get();

        $byCategory = Ticket::join('categories', 'tickets.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('count(*) as count'))
            ->groupBy('categories.name')
            ->get();

        $byPriority = Ticket::select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get();

        // 3. Recent Activity
        $recentTickets = Ticket::with(['user', 'status', 'department'])
            ->latest()
            ->take(5)
            ->get();

        $recentReplies = Reply::with(['user', 'ticket'])
            ->latest()
            ->take(5)
            ->get();

        $recentLogs = Activity::with(['causer', 'subject'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'overview' => [
                    'total' => $totalTickets,
                    'by_status' => $statusCounts,
                ],
                'distributions' => [
                    'department' => $byDepartment,
                    'category' => $byCategory,
                    'priority' => $byPriority,
                ],
                'recent' => [
                    'tickets' => $recentTickets,
                    'replies' => $recentReplies,
                    'logs' => $recentLogs,
                ]
            ]
        ]);
    }
}
