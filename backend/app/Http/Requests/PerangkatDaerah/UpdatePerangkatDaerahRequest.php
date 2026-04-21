<?php

namespace App\Http\Requests\PerangkatDaerah;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * UpdatePerangkatDaerahRequest validates update perangkat daerah payload.
 */
class UpdatePerangkatDaerahRequest extends FormRequest
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
        $perangkatDaerahId = $this->route('perangkat_daerah') ?? $this->route('perangkatDaerah') ?? $this->route('id');

        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'slug' => [
                'nullable',
                'string',
                'max:180',
                Rule::unique('perangkat_daerahs', 'slug')->ignore($perangkatDaerahId),
            ],
        ];
    }
}
