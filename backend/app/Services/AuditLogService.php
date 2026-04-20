<?php

namespace App\Services;

use App\Repositories\AuditLogRepository;

/**
 * AuditLogService provides high-level audit trail operations.
 */
class AuditLogService
{
    public function __construct(private readonly AuditLogRepository $auditLogRepository)
    {
    }

    /**
     * Create a new audit log event.
     *
     * @param string|null $userId
     * @param string $action
     * @param string $entityType
     * @param string $entityId
     * @param array<string, mixed> $metadata
     * @returns void
     *
     * Usage:
     * $this->auditLogService->log($user->id, 'submission.created', 'submission', (string) $submission->id);
     */
    public function log(?string $userId, string $action, string $entityType, string $entityId, array $metadata = []): void
    {
        $this->auditLogRepository->create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Return paginated audit trail payload.
     *
     * @param int $perPage
     * @param string|null $entityType
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $audit = $this->auditLogService->list(20, 'submission');
     */
    public function list(int $perPage = 20, ?string $entityType = null): array
    {
        $logs = $this->auditLogRepository->paginate($perPage, $entityType);

        return [
            'items' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ];
    }
}
