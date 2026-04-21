<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreServiceRequest validates admin service create payload.
 */
class StoreServiceRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:20', 'unique:services,code'],
            'name' => ['required', 'string', 'max:120'],
            'perangkat_daerah_id' => ['required', 'integer', 'exists:perangkat_daerahs,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
