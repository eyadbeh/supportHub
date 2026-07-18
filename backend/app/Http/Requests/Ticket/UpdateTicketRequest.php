<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy handles it
    }

    public function rules(): array
    {
        return [
            'department_id' => ['sometimes', 'exists:departments,id'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'status_id' => ['sometimes', 'exists:statuses,id'],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
            'priority' => ['sometimes', 'in:Low,Medium,High,Critical'],
        ];
    }
}
