<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Status;
use App\Http\Resources\StatusResource;
use App\Http\Requests\Admin\StoreStatusRequest;
use App\Http\Requests\Admin\UpdateStatusRequest;
use App\Actions\Admin\CreateStatusAction;
use App\Actions\Admin\UpdateStatusAction;
use App\Actions\Admin\DeleteStatusAction;
use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Status::class);
        $statuses = Status::orderBy('sort_order')->get();
        return response()->json(StatusResource::collection($statuses));
    }

    public function show(Status $status): JsonResponse
    {
        $this->authorize('view', $status);
        return response()->json(new StatusResource($status));
    }

    public function store(StoreStatusRequest $request, CreateStatusAction $action): JsonResponse
    {
        $status = $action->execute($request->validated());
        return response()->json(new StatusResource($status), 201);
    }

    public function update(UpdateStatusRequest $request, Status $status, UpdateStatusAction $action): JsonResponse
    {
        $status = $action->execute($status, $request->validated());
        return response()->json(new StatusResource($status));
    }

    public function destroy(Status $status, DeleteStatusAction $action): JsonResponse
    {
        $this->authorize('delete', $status);
        $action->execute($status);
        return response()->json(null, 204);
    }
}
