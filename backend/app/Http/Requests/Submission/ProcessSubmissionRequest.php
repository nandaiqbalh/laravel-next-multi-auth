<?php

namespace App\Http\Requests\Submission;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ProcessSubmissionRequest validates admin submission status updates.
 */
class ProcessSubmissionRequest extends FormRequest
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
     * Return validation rules for submission processing.
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
            'status' => ['required', 'in:diajukan,dalam_proses,revisi,selesai'],
            'catatan_admin' => ['nullable', 'string'],
        ];
    }
}
