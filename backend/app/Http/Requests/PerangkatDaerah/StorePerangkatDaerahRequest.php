<?php

namespace App\Http\Requests\PerangkatDaerah;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StorePerangkatDaerahRequest validates create perangkat daerah payload.
 */
class StorePerangkatDaerahRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:180', 'unique:perangkat_daerahs,slug'],
        ];
    }
}
