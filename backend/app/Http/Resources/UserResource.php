<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transforms User model data for API responses.
 *
 * Never exposes: password, remember_token, deleted_at.
 * Always includes: roles and permissions as flat string arrays.
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar ? asset('storage/'.$this->avatar) : null,
            'roles' => $this->getRoleNames(),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'departments' => $this->whenLoaded('departments', fn () => $this->departments->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
            ])),
            'created_at' => $this->created_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
