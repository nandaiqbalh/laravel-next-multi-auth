<?php

namespace App\Http\Requests\UmkmProfile;

use Illuminate\Foundation\Http\FormRequest;

/**
 * RejectUmkmProfileHistoryRequest validates admin rejection payload.
 */
class RejectUmkmProfileHistoryRequest extends FormRequest
{
    /**
     * Determine whether request is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Return validation rules for rejection payload.
     *
     * @returns array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'catatan_admin' => ['nullable', 'string'],
        ];
    }
}
