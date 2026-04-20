<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * UmkmProfile stores full UMKM profile in a single table as required by business rules.
 */
class UmkmProfile extends Model
{
    protected $table = 'umkm_profiles';

    protected $primaryKey = 'id_data_badan_usaha';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id_data_badan_usaha',
        'user_id',
        'nik_pengusaha',
        'nama_pengusaha',
        'nib',
        'jenis_kelamin',
        'is_disabilitas',
        'tanggal_lahir',
        'prov_pengusaha',
        'kab_pengusaha',
        'kec_pengusaha',
        'kel_pengusaha',
        'alamat_pengusaha',
        'rt_pengusaha',
        'rw_pengusaha',
        'kontak_hp',
        'pendidikan_formal',
        'nama_usaha',
        'kegiatan_utama',
        'produk_utama',
        'kategori_kbli',
        'kode_kbli',
        'status_badan_usaha',
        'modal_pendirian',
        'bulan_mulai_operasi',
        'tahun_mulai_operasi',
        'prov_usaha',
        'kab_usaha',
        'kec_usaha',
        'kel_usaha',
        'alamat_usaha',
        'rt_usaha',
        'rw_usaha',
        'foto_usaha',
        'alamat_latitude',
        'alamat_longitude',
        'tk_dibayar_laki',
        'tk_dibayar_perempuan',
        'tk_dibayar_disabil_laki',
        'tk_dibayar_disabil_perempuan',
        'tk_not_dibayar_laki',
        'tk_not_dibayar_perempuan',
        'tk_not_dibayar_disabil_laki',
        'tk_not_dibayar_disabil_perempuan',
        'skala_usaha',
        'omzet_tahunan',
        'asset',
        'is_verified',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'is_disabilitas' => 'boolean',
        'tanggal_lahir' => 'date',
        'modal_pendirian' => 'decimal:2',
        'bulan_mulai_operasi' => 'integer',
        'tahun_mulai_operasi' => 'integer',
        'alamat_latitude' => 'decimal:8',
        'alamat_longitude' => 'decimal:8',
        'tk_dibayar_laki' => 'integer',
        'tk_dibayar_perempuan' => 'integer',
        'tk_dibayar_disabil_laki' => 'integer',
        'tk_dibayar_disabil_perempuan' => 'integer',
        'tk_not_dibayar_laki' => 'integer',
        'tk_not_dibayar_perempuan' => 'integer',
        'tk_not_dibayar_disabil_laki' => 'integer',
        'tk_not_dibayar_disabil_perempuan' => 'integer',
        'omzet_tahunan' => 'decimal:2',
        'asset' => 'decimal:2',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    /**
     * Resolve UMKM owner user.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $profile->user;
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Resolve verifier user for this UMKM profile.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $profile->verifier;
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get claim history for this UMKM profile.
     *
     * @param void
     * @returns HasMany
     *
     * Usage:
     * $profile->claims()->latest('created_at')->get();
     */
    public function claims(): HasMany
    {
        return $this->hasMany(UmkmClaim::class, 'umkm_profile_id', 'id_data_badan_usaha');
    }

    /**
     * Get service submissions for this UMKM profile.
     *
     * @param void
     * @returns HasMany
     *
     * Usage:
     * $profile->submissions()->get();
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'umkm_profile_id', 'id_data_badan_usaha');
    }
}
