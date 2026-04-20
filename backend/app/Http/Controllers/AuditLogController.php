<?php

namespace App\Http\Controllers;

use App\Services\AuditLogService;

/**
 * AuditLogController serves superadmin audit trail endpoint.
 */
class AuditLogController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService)
    {
    }

    /**
     * Return paginated audit logs.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/audit-trail
     */
    public function index()
    {
        $data = $this->auditLogService->list(
            perPage: (int) request()->integer('per_page', 20),
            entityType: request()->string('entity_type')->toString() ?: null,
        );

        return $this->successResponse('Audit trail fetched', $data);
    }
}
