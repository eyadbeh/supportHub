<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class StoreReplyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy handles it
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
        ];
    }
}
