<?php

namespace App\Repositories;

use App\Models\AuditLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * AuditLogRepository handles immutable audit trail persistence.
 */
class AuditLogRepository
{
    /**
     * Create audit entry.
     */
    public function create(array $payload): AuditLog
    {
        return AuditLog::query()->create($payload)->load('user');
    }

    /**
     * Return paginated audit logs.
     */
    public function paginate(int $perPage = 20, ?string $entityType = null): LengthAwarePaginator
    {
        return AuditLog::query()
            ->with('user')
            ->when($entityType, fn ($query) => $query->where('entity_type', $entityType))
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
