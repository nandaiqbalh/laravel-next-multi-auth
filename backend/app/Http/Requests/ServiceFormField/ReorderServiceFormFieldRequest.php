<?php

namespace App\Http\Requests\ServiceFormField;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ReorderServiceFormFieldRequest validates reorder payload.
 */
class ReorderServiceFormFieldRequest extends FormRequest
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
            'fields' => ['required', 'array', 'min:1'],
            'fields.*.id' => ['required', 'integer', 'exists:service_form_fields,id'],
            'fields.*.order' => ['required', 'integer', 'min:1'],
        ];
    }
}
