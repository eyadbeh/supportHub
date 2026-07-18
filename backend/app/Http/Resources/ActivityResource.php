<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'log_name' => $this->log_name,
            'description' => $this->description,
            'event' => $this->event,
            'subject_id' => $this->subject_id,
            'causer' => new UserResource($this->whenLoaded('causer')),
            'properties' => $this->properties,
            'created_at' => $this->created_at,
        ];
    }
}
