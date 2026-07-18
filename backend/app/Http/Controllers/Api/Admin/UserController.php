<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::withTrashed()
            ->with('roles', 'departments')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->assignRole($validated['role']);

            if ($validated['role'] === 'Support' && !empty($validated['departments'])) {
                $user->departments()->sync($validated['departments']);
            }

            activity()
                ->performedOn($user)
                ->event('created')
                ->log("Admin created user {$user->name} with role {$validated['role']}");

            return $user;
        });

        // Eager load relationships for the resource response
        $user->load('roles', 'departments');

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated) {
            // Re-assign role
            $user->syncRoles([$validated['role']]);

            // Sync departments based on the new role
            if ($validated['role'] === 'Support' && !empty($validated['departments'])) {
                $user->departments()->sync($validated['departments']);
            } else {
                // If they are no longer Support (or no departments provided), clear their departments
                $user->departments()->detach();
            }

            activity()
                ->performedOn($user)
                ->event('role_updated')
                ->log("Admin updated role for {$user->name} to {$validated['role']}");
        });

        $user->load('roles', 'departments');

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully.',
            'data' => new UserResource($user),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::withTrashed()->findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot disable yourself.',
            ], 403);
        }

        $user->delete();

        activity()
            ->performedOn($user)
            ->event('deleted')
            ->log("Admin disabled user {$user->name}");

        return response()->json([
            'success' => true,
            'message' => 'User disabled successfully.',
        ]);
    }

    public function restore($id): JsonResponse
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        activity()
            ->performedOn($user)
            ->event('restored')
            ->log("Admin enabled user {$user->name}");

        return response()->json([
            'success' => true,
            'message' => 'User enabled successfully.',
        ]);
    }
}
