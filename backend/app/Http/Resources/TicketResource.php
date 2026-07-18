<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'closed_at' => $this->closed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'status' => new StatusResource($this->whenLoaded('status')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),

            // Optionally load replies count or replies
            'replies_count' => $this->whenCounted('replies'),
            'replies' => ReplyResource::collection($this->whenLoaded('replies')),
        ];
    }
}
