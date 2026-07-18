<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Http\Resources\DepartmentResource;
use App\Http\Requests\Admin\StoreDepartmentRequest;
use App\Http\Requests\Admin\UpdateDepartmentRequest;
use App\Actions\Admin\CreateDepartmentAction;
use App\Actions\Admin\UpdateDepartmentAction;
use App\Actions\Admin\DeleteDepartmentAction;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Department::class);
        $departments = Department::all();
        return response()->json(DepartmentResource::collection($departments));
    }

    public function show(Department $department): JsonResponse
    {
        $this->authorize('view', $department);
        return response()->json(new DepartmentResource($department));
    }

    public function store(StoreDepartmentRequest $request, CreateDepartmentAction $action): JsonResponse
    {
        $department = $action->execute($request->validated());
        return response()->json(new DepartmentResource($department), 201);
    }

    public function update(UpdateDepartmentRequest $request, Department $department, UpdateDepartmentAction $action): JsonResponse
    {
        $department = $action->execute($department, $request->validated());
        return response()->json(new DepartmentResource($department));
    }

    public function destroy(Department $department, DeleteDepartmentAction $action): JsonResponse
    {
        $this->authorize('delete', $department);
        $action->execute($department);
        return response()->json(null, 204);
    }
}
