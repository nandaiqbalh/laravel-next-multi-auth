<?php

namespace App\Http\Requests\UmkmClaim;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreUmkmClaimRequest validates UMKM claim submission.
 */
class StoreUmkmClaimRequest extends FormRequest
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
     * Return validation rules for claim payload.
     *
     * @param void
     * @returns array<string, mixed>
     *
     * Usage:
     * $request->validated();
     */
    public function rules(): array
    {
        return [];
    }
}
