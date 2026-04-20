<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * UmkmClaim stores ownership validation request of a UMKM profile.
 */
class UmkmClaim extends Model
{
    protected $table = 'umkm_claims';

    public const UPDATED_AT = null;

    protected $fillable = [
        'umkm_profile_id',
        'status',
        'catatan_admin',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Resolve related UMKM profile.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $claim->profile;
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(UmkmProfile::class, 'umkm_profile_id', 'id_data_badan_usaha');
    }

    /**
     * Resolve claim approver user.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $claim->approver;
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
