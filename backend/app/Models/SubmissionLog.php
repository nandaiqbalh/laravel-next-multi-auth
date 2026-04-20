<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * SubmissionLog stores immutable status transition entries.
 */
class SubmissionLog extends Model
{
    protected $table = 'submission_logs';

    public const UPDATED_AT = null;

    protected $fillable = [
        'submission_id',
        'status_from',
        'status_to',
        'note',
        'changed_by',
    ];

    /**
     * Resolve submission relation.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $log->submission;
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class, 'submission_id');
    }

    /**
     * Resolve user that triggered status transition.
     *
     * @param void
     * @returns BelongsTo
     *
     * Usage:
     * $log->changer;
     */
    public function changer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
