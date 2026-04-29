<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * UmkmProfileHistory stores profile change requests for UMKM profiles.
 */
class UmkmProfileHistory extends Model
{
    protected $table = 'umkm_profile_histories';

    protected $fillable = [
        'umkm_profile_id',
        'payload',
        'status',
        'catatan_admin',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Resolve related UMKM profile.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(UmkmProfile::class, 'umkm_profile_id', 'id_data_badan_usaha');
    }

    /**
     * Resolve history creator user.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Resolve history approver user.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
