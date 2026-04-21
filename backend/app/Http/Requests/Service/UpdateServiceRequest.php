<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * UpdateServiceRequest validates admin service update payload.
 */
class UpdateServiceRequest extends FormRequest
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
        $serviceId = $this->route('service') ?? $this->route('id');

        return [
            'code' => ['required', 'string', 'max:20', Rule::unique('services', 'code')->ignore($serviceId)],
            'name' => ['required', 'string', 'max:120'],
            'perangkat_daerah_id' => ['required', 'integer', 'exists:perangkat_daerahs,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
