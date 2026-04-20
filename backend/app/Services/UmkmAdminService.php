<?php

namespace App\Services;

use App\Repositories\UserRepository;

/**
 * UmkmAdminService assembles payloads for UMKM admin dashboards.
 */
class UmkmAdminService
{
    public function __construct(
        private readonly UmkmProfileService $umkmProfileService,
        private readonly UmkmClaimService $umkmClaimService,
        private readonly SubmissionService $submissionService,
        private readonly AuditLogService $auditLogService,
        private readonly UserRepository $userRepository
    ) {
    }

    /**
     * Build summary cards for UMKM admin dashboard.
     *
     * @param void
     * @returns array<string, mixed>
     *
     * Usage:
     * $summary = $this->umkmAdminService->dashboardSummary();
     */
    public function dashboardSummary(): array
    {
        return [
            'profiles' => $this->umkmProfileService->summary(),
            'claims' => $this->umkmClaimService->summary(),
            'submissions' => $this->submissionService->summary(),
        ];
    }

    /**
     * Return UMKM profile list payload.
     *
     * @param int $perPage
     * @param string|null $search
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $profiles = $this->umkmAdminService->dataUmkm(20, 'kuliner');
     */
    public function dataUmkm(int $perPage = 20, ?string $search = null): array
    {
        return $this->umkmProfileService->listForAdmin($perPage, $search);
    }

    /**
     * Return submission queue payload.
     *
     * @param int $perPage
     * @param string|null $status
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $queue = $this->umkmAdminService->pengajuan(20, 'pending');
     */
    public function pengajuan(int $perPage = 20, ?string $status = null): array
    {
        return $this->submissionService->listForAdmin($perPage, $status);
    }

    /**
     * Return recap payload that combines domain summary counters.
     *
     * @param void
     * @returns array<string, mixed>
     *
     * Usage:
     * $rekap = $this->umkmAdminService->rekap();
     */
    public function rekap(): array
    {
        return $this->dashboardSummary();
    }

    /**
     * Return paginated user payload for UMKM admin user screen.
     *
     * @param int $perPage
     * @param string|null $search
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $users = $this->umkmAdminService->users(20, 'andi');
     */
    public function users(int $perPage = 20, ?string $search = null): array
    {
        $users = $this->userRepository->paginate($perPage, $search);

        return [
            'items' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ];
    }

    /**
     * Return paginated audit trail payload.
     *
     * @param int $perPage
     * @param string|null $entityType
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $audit = $this->umkmAdminService->auditTrail(20, null);
     */
    public function auditTrail(int $perPage = 20, ?string $entityType = null): array
    {
        return $this->auditLogService->list($perPage, $entityType);
    }
}
