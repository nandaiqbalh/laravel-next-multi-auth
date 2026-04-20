<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Login request validates credential payload.
 */
class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Return validation rules for login endpoint.
     */
    public function rules(): array
    {
        return [
            'nik' => ['required', 'string', 'max:32'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }
}
