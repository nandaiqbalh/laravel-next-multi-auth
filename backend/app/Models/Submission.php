<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Submission stores UMKM service request lifecycle.
 */
class Submission extends Model
{
    protected $table = 'submissions';

    protected $fillable = [
        'umkm_profile_id',
        'service_id',
        'status',
        'document_url',
        'form_data',
        'catatan_admin',
        'processed_by',
        'submitted_at',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'form_data' => 'array',
        'submitted_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Resolve UMKM profile of this submission.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $submission->profile;
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(UmkmProfile::class, 'umkm_profile_id', 'id_data_badan_usaha');
    }

    /**
     * Resolve service catalog metadata.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $submission->service;
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(ServiceCatalog::class, 'service_id');
    }

    /**
     * Resolve admin processor user.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $submission->processor;
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Resolve status transition logs.
     *
     * @param void
     * @returns HasMany
     *
     * Usage:
     * $submission->logs()->latest('created_at')->get();
     */
    public function logs(): HasMany
    {
        return $this->hasMany(SubmissionLog::class, 'submission_id');
    }
}
