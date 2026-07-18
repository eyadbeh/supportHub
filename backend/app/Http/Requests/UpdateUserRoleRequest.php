<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::in(['Admin', 'Support', 'User'])],
            'departments' => ['array', Rule::requiredIf($this->input('role') === 'Support')],
            'departments.*' => ['integer', 'exists:departments,id'],
        ];
    }
}
