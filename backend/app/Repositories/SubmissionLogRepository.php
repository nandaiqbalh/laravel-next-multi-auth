<?php

namespace App\Repositories;

use App\Models\SubmissionLog;
use Illuminate\Support\Collection;

/**
 * SubmissionLogRepository handles immutable submission transition logs.
 */
class SubmissionLogRepository
{
    /**
     * Create log entry for status transition.
     */
    public function create(array $payload): SubmissionLog
    {
        return SubmissionLog::query()->create($payload)->load(['changer']);
    }

    /**
     * Return logs by submission id ordered newest first.
     */
    public function bySubmissionId(int $submissionId): Collection
    {
        return SubmissionLog::query()
            ->with(['changer'])
            ->where('submission_id', $submissionId)
            ->latest('created_at')
            ->get();
    }
}
