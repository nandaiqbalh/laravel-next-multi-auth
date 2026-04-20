<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Store user request validates create user payload.
 */
class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Return validation rules for create user endpoint.
     */
    public function rules(): array
    {
        return [
            'nik' => ['required', 'string', 'max:32', 'unique:users,nik'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }

    /**
     * Custom error messages for create user validation.
     */
    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi.',
            'nik.string' => 'Format NIK tidak valid.',
            'nik.max' => 'NIK tidak boleh lebih dari :max karakter.',
            'nik.unique' => 'NIK sudah terdaftar.',

            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Format nama tidak valid.',
            'name.max' => 'Nama tidak boleh lebih dari :max karakter.',

            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari :max karakter.',
            'email.unique' => 'Email sudah terdaftar.',

            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Format password tidak valid.',
            'password.min' => 'Password harus minimal :min karakter.',

            'role_id.required' => 'Peran wajib dipilih.',
            'role_id.exists' => 'Peran tidak ditemukan.',
        ];
    }
}
