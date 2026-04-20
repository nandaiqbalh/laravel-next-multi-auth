<?php

namespace App\Http\Requests\UmkmProfile;

use Illuminate\Foundation\Http\FormRequest;

/**
 * UpsertUmkmProfileRequest validates UMKM profile input using exact required column names.
 */
class UpsertUmkmProfileRequest extends FormRequest
{
    /**
     * Determine whether user can submit this request.
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
     * Return validation rules for UMKM profile upsert.
     *
     * @param void
     * @returns array<string, mixed>
     *
     * Usage:
     * $validated = $request->validated();
     */
    public function rules(): array
    {
        return [
            'id_data_badan_usaha' => ['required', 'string', 'max:100'],
            'nik_pengusaha' => ['required', 'string', 'max:32'],
            'nama_pengusaha' => ['required', 'string', 'max:150'],
            'nib' => ['nullable', 'string', 'max:64'],
            'jenis_kelamin' => ['required', 'string', 'max:20'],
            'is_disabilitas' => ['required', 'boolean'],
            'tanggal_lahir' => ['nullable', 'date'],

            'prov_pengusaha' => ['required', 'string', 'max:120'],
            'kab_pengusaha' => ['required', 'string', 'max:120'],
            'kec_pengusaha' => ['required', 'string', 'max:120'],
            'kel_pengusaha' => ['required', 'string', 'max:120'],
            'alamat_pengusaha' => ['required', 'string'],
            'rt_pengusaha' => ['nullable', 'string', 'max:5'],
            'rw_pengusaha' => ['nullable', 'string', 'max:5'],

            'kontak_hp' => ['required', 'string', 'max:20'],
            'pendidikan_formal' => ['nullable', 'string', 'max:120'],

            'nama_usaha' => ['required', 'string', 'max:150'],
            'kegiatan_utama' => ['nullable', 'string'],
            'produk_utama' => ['nullable', 'string', 'max:180'],
            'kategori_kbli' => ['nullable', 'string', 'max:150'],
            'kode_kbli' => ['nullable', 'string', 'max:20'],
            'status_badan_usaha' => ['nullable', 'string', 'max:120'],

            'modal_pendirian' => ['nullable', 'numeric', 'min:0'],
            'bulan_mulai_operasi' => ['nullable', 'integer', 'between:1,12'],
            'tahun_mulai_operasi' => ['nullable', 'integer', 'between:1900,2100'],

            'prov_usaha' => ['required', 'string', 'max:120'],
            'kab_usaha' => ['required', 'string', 'max:120'],
            'kec_usaha' => ['required', 'string', 'max:120'],
            'kel_usaha' => ['required', 'string', 'max:120'],
            'alamat_usaha' => ['required', 'string'],
            'rt_usaha' => ['nullable', 'string', 'max:5'],
            'rw_usaha' => ['nullable', 'string', 'max:5'],

            'foto_usaha' => ['nullable', 'url'],
            'alamat_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'alamat_longitude' => ['nullable', 'numeric', 'between:-180,180'],

            'tk_dibayar_laki' => ['required', 'integer', 'min:0'],
            'tk_dibayar_perempuan' => ['required', 'integer', 'min:0'],
            'tk_dibayar_disabil_laki' => ['required', 'integer', 'min:0'],
            'tk_dibayar_disabil_perempuan' => ['required', 'integer', 'min:0'],

            'tk_not_dibayar_laki' => ['required', 'integer', 'min:0'],
            'tk_not_dibayar_perempuan' => ['required', 'integer', 'min:0'],
            'tk_not_dibayar_disabil_laki' => ['required', 'integer', 'min:0'],
            'tk_not_dibayar_disabil_perempuan' => ['required', 'integer', 'min:0'],

            'skala_usaha' => ['nullable', 'string', 'max:100'],
            'omzet_tahunan' => ['nullable', 'numeric', 'min:0'],
            'asset' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
