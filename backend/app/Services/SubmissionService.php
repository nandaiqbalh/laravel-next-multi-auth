<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\User;
use App\Repositories\ServiceCatalogRepository;
use App\Repositories\SubmissionLogRepository;
use App\Repositories\SubmissionRepository;
use App\Repositories\UmkmClaimRepository;
use App\Repositories\UmkmProfileRepository;
use RuntimeException;

/**
 * SubmissionService handles UMKM submission business flow.
 */
class SubmissionService
{
    public function __construct(
        private readonly SubmissionRepository $submissionRepository,
        private readonly SubmissionLogRepository $submissionLogRepository,
        private readonly ServiceCatalogRepository $serviceCatalogRepository,
        private readonly UmkmProfileRepository $umkmProfileRepository,
        private readonly UmkmClaimRepository $umkmClaimRepository,
        private readonly AuditLogService $auditLogService
    ) {
    }

    /**
     * Return all service catalog items.
     *
     * @param void
     * @returns array<int, mixed>
     *
     * Usage:
     * $services = $this->submissionService->serviceCatalog();
     */
    public function serviceCatalog(): array
    {
        return $this->serviceCatalogRepository->all()->all();
    }

    /**
     * Submit new service request for authenticated user.
     *
     * @param User $user
     * @param array<string, mixed> $payload
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->submit($request->user(), $request->validated());
     */
    public function submit(User $user, array $payload): Submission
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            throw new RuntimeException('Profil UMKM belum tersedia');
        }

        if (! $profile->is_verified) {
            throw new RuntimeException('Profil UMKM belum diverifikasi admin');
        }

        $latestClaim = $this->umkmClaimRepository->latestByProfileId($profile->id_data_badan_usaha);
        if (! $latestClaim || $latestClaim->status !== 'approved') {
            throw new RuntimeException('Claim UMKM belum disetujui admin');
        }

        $this->serviceCatalogRepository->findOrFail((int) $payload['service_id']);

        $submission = $this->submissionRepository->create([
            'umkm_profile_id' => $profile->id_data_badan_usaha,
            'service_id' => $payload['service_id'],
            'status' => 'diajukan',
            'document_url' => $payload['document_url'],
            'catatan_admin' => null,
            'submitted_at' => now(),
        ]);

        $this->submissionLogRepository->create([
            'submission_id' => $submission->id,
            'status_from' => null,
            'status_to' => 'diajukan',
            'note' => 'Pengajuan dibuat oleh UMKM user',
            'changed_by' => $user->id,
        ]);

        $this->auditLogService->log(
            $user->id,
            'submission.created',
            'submission',
            (string) $submission->id,
            [
                'service_id' => $submission->service_id,
                'status' => $submission->status,
            ]
        );

        return $this->submissionRepository->findOrFail($submission->id);
    }

    /**
     * Return paginated submission payload for authenticated user.
     *
     * @param User $user
     * @param int $perPage
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $submissions = $this->submissionService->listForUser($request->user(), 20);
     */
    public function listForUser(User $user, int $perPage = 20): array
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            return [
                'items' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $perPage,
                    'total' => 0,
                ],
            ];
        }

        $submissions = $this->submissionRepository->paginateByProfileId($profile->id_data_badan_usaha, $perPage);

        return [
            'items' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ];
    }

    /**
     * Return submission detail for authenticated user.
     *
     * @param int $submissionId
     * @param User $user
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->detailForUser($id, $request->user());
     */
    public function detailForUser(int $submissionId, User $user): Submission
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            throw new RuntimeException('Profil UMKM tidak ditemukan');
        }

        $submission = $this->submissionRepository->findOrFail($submissionId);

        if ($submission->umkm_profile_id !== $profile->id_data_badan_usaha) {
            throw new RuntimeException('Pengajuan tidak ditemukan');
        }

        return $submission;
    }

    /**
     * Return paginated admin submission queue.
     *
     * @param int $perPage
     * @param string|null $status
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $queue = $this->submissionService->listForAdmin(20, 'dalam_proses');
     */
    public function listForAdmin(int $perPage = 20, ?string $status = null): array
    {
        $submissions = $this->submissionRepository->paginateForAdmin($perPage, $status);

        return [
            'items' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ];
    }

    /**
     * Process submission status by admin.
     *
     * @param int $submissionId
     * @param array<string, mixed> $payload
     * @param User $admin
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->process($id, $request->validated(), $request->user());
     */
    public function process(int $submissionId, array $payload, User $admin): Submission
    {
        $submission = $this->submissionRepository->findOrFail($submissionId);
        $fromStatus = $submission->status;
        $toStatus = $payload['status'];

        $updatePayload = [
            'status' => $toStatus,
            'catatan_admin' => $payload['catatan_admin'] ?? null,
            'processed_by' => $admin->id,
        ];

        if ($toStatus === 'dalam_proses' && ! $submission->processed_at) {
            $updatePayload['processed_at'] = now();
        }

        if ($toStatus === 'revisi') {
            $updatePayload['processed_at'] = now();
            $updatePayload['completed_at'] = null;
        }

        if ($toStatus === 'selesai') {
            $updatePayload['processed_at'] = $submission->processed_at ?? now();
            $updatePayload['completed_at'] = now();
        }

        $submission = $this->submissionRepository->update($submission, $updatePayload);

        $this->submissionLogRepository->create([
            'submission_id' => $submission->id,
            'status_from' => $fromStatus,
            'status_to' => $toStatus,
            'note' => $payload['catatan_admin'] ?? null,
            'changed_by' => $admin->id,
        ]);

        $this->auditLogService->log(
            $admin->id,
            'submission.processed',
            'submission',
            (string) $submission->id,
            [
                'status_from' => $fromStatus,
                'status_to' => $toStatus,
            ]
        );

        return $this->submissionRepository->findOrFail($submission->id);
    }

    /**
     * Return submission status summary counters.
     *
     * @param void
     * @returns array<string, int>
     *
     * Usage:
     * $summary = $this->submissionService->summary();
     */
    public function summary(): array
    {
        return $this->submissionRepository->summaryCounts();
    }
}
