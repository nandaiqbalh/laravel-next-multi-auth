<?php

namespace App\Http\Requests\ServiceFormField;

use Illuminate\Foundation\Http\FormRequest;

/**
 * UpdateServiceFormFieldRequest validates dynamic field update payload.
 */
class UpdateServiceFormFieldRequest extends FormRequest
{
    /**
     * Determine if request is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Return validation rules.
     */
    public function rules(): array
    {
        return [
            'label' => ['sometimes', 'required', 'string', 'max:150'],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'type' => ['sometimes', 'required', 'string', 'max:40'],
            'is_required' => ['sometimes', 'boolean'],
            'options' => ['nullable', 'array'],
            'order' => ['sometimes', 'required', 'integer', 'min:1'],
            'placeholder' => ['nullable', 'string', 'max:255'],
        ];
    }
}
