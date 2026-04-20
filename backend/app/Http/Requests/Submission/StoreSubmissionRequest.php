<?php

namespace App\Http\Requests\Submission;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreSubmissionRequest validates UMKM service submission payload.
 */
class StoreSubmissionRequest extends FormRequest
{
    /**
     * Determine whether request is authorized.
     *
     * @param void
     * @returns bool
     *
     * Usage:
     * $request->authorize();
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Return validation rules for creating a service submission.
     *
     * @param void
     * @returns array<string, mixed>
     *
     * Usage:
     * $payload = $request->validated();
     */
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'document_url' => ['required', 'url', 'max:2000'],
        ];
    }
}
