<?php

namespace App\Http\Requests\ServiceFormField;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreServiceFormFieldRequest validates dynamic field create payload.
 */
class StoreServiceFormFieldRequest extends FormRequest
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
            'label' => ['required', 'string', 'max:150'],
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'max:40'],
            'is_required' => ['sometimes', 'boolean'],
            'options' => ['nullable', 'array'],
            'order' => ['required', 'integer', 'min:1'],
            'placeholder' => ['nullable', 'string', 'max:255'],
        ];
    }
}
