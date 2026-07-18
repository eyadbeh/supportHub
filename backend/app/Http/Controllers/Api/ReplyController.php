<?php

namespace App\Http\Controllers\Api;

use App\Actions\Ticket\CreateReplyAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreReplyRequest;
use App\Http\Resources\ReplyResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

class ReplyController extends Controller
{
    public function index(Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        $replies = $ticket->replies()->with('user')->oldest()->get();

        return response()->json(ReplyResource::collection($replies));
    }

    public function store(StoreReplyRequest $request, Ticket $ticket, CreateReplyAction $action): JsonResponse
    {
        $this->authorize('create', [\App\Models\Reply::class, $ticket]);

        $reply = $action->execute($ticket, $request->validated(), $request->user()->id);

        $reply->load('user');

        return response()->json(new ReplyResource($reply), 201);
    }
}
