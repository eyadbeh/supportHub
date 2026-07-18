<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Spatie\Activitylog\Models\Activity;

class TicketActivityController extends Controller
{
    public function index(Ticket $ticket): JsonResponse
    {
        // Only Admin/Support can view activity log based on our discussion
        $this->authorize('update', $ticket);

        $activities = Activity::where('subject_type', Ticket::class)
            ->where('subject_id', $ticket->id)
            ->with('causer')
            ->latest()
            ->get();

        return response()->json(ActivityResource::collection($activities));
    }
}
