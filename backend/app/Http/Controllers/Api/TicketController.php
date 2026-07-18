<?php

namespace App\Http\Controllers\Api;

use App\Actions\Ticket\CreateTicketAction;
use App\Actions\Ticket\UpdateTicketAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Ticket::class);

        $query = Ticket::with(['user', 'department', 'category', 'status', 'assignee']);

        if (!$request->user()->hasRole('Admin|Support')) {
            $query->where('user_id', $request->user()->id);
        }

        // Simple filtering example
        if ($request->has('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        $tickets = $query->latest()->get();

        return response()->json(TicketResource::collection($tickets));
    }

    public function store(StoreTicketRequest $request, CreateTicketAction $action): JsonResponse
    {
        $ticket = $action->execute($request->validated(), $request->user()->id);

        $ticket->load(['user', 'department', 'category', 'status']);

        return response()->json(new TicketResource($ticket), 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        $ticket->load(['user', 'department', 'category', 'status', 'assignee', 'replies.user']);

        return response()->json(new TicketResource($ticket));
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket, UpdateTicketAction $action): JsonResponse
    {
        $this->authorize('update', $ticket);

        $ticket = $action->execute($ticket, $request->validated(), $request->user()->id);

        $ticket->load(['user', 'department', 'category', 'status', 'assignee']);

        return response()->json(new TicketResource($ticket));
    }
}
