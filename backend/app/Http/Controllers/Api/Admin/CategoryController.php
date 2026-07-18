<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Actions\Admin\CreateCategoryAction;
use App\Actions\Admin\UpdateCategoryAction;
use App\Actions\Admin\DeleteCategoryAction;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Category::class);
        $categories = Category::with('department')->get();
        return response()->json(CategoryResource::collection($categories));
    }

    public function show(Category $category): JsonResponse
    {
        $this->authorize('view', $category);
        $category->load('department');
        return response()->json(new CategoryResource($category));
    }

    public function store(StoreCategoryRequest $request, CreateCategoryAction $action): JsonResponse
    {
        $category = $action->execute($request->validated());
        $category->load('department');
        return response()->json(new CategoryResource($category), 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action): JsonResponse
    {
        $category = $action->execute($category, $request->validated());
        $category->load('department');
        return response()->json(new CategoryResource($category));
    }

    public function destroy(Category $category, DeleteCategoryAction $action): JsonResponse
    {
        $this->authorize('delete', $category);
        $action->execute($category);
        return response()->json(null, 204);
    }
}
