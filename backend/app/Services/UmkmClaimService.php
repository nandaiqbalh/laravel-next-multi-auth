<?php

namespace App\Services;

use App\Models\UmkmClaim;
use App\Models\User;
use App\Repositories\UmkmClaimRepository;
use App\Repositories\UmkmProfileRepository;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * UmkmClaimService handles UMKM claim flow.
 */
class UmkmClaimService
{
    public function __construct(
        private readonly UmkmClaimRepository $umkmClaimRepository,
        private readonly UmkmProfileRepository $umkmProfileRepository,
        private readonly AuditLogService $auditLogService
    ) {
    }

    /**
     * Submit new claim for authenticated user profile.
     *
     * @param User $user
     * @returns UmkmClaim
     *
     * Usage:
     * $claim = $this->umkmClaimService->submit($request->user());
     */
    public function submit(User $user): UmkmClaim
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            throw new RuntimeException('Profil UMKM belum diisi');
        }

        if ($this->umkmClaimRepository->hasPendingByProfileId($profile->id_data_badan_usaha)) {
            throw new RuntimeException('Masih ada claim pending untuk profil UMKM ini');
        }

        $claim = $this->umkmClaimRepository->create([
            'umkm_profile_id' => $profile->id_data_badan_usaha,
            'status' => 'pending',
        ]);

        $this->auditLogService->log(
            $user->id,
            'umkm_claim.submitted',
            'umkm_claim',
            (string) $claim->id,
            [
                'umkm_profile_id' => $claim->umkm_profile_id,
                'status' => $claim->status,
            ]
        );

        return $claim;
    }

    /**
     * Return latest claim for authenticated user's profile.
     *
     * @param User $user
     * @returns UmkmClaim|null
     *
     * Usage:
     * $claim = $this->umkmClaimService->latestForUser($request->user());
     */
    public function latestForUser(User $user): ?UmkmClaim
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            return null;
        }

        return $this->umkmClaimRepository->latestByProfileId($profile->id_data_badan_usaha);
    }

    /**
     * Return paginated claim payload for admin screens.
     *
     * @param int $perPage
     * @param string|null $status
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $claims = $this->umkmClaimService->listForAdmin(20, 'pending');
     */
    public function listForAdmin(int $perPage = 20, ?string $status = null): array
    {
        $claims = $this->umkmClaimRepository->paginate($perPage, $status);

        return [
            'items' => $claims->items(),
            'meta' => [
                'current_page' => $claims->currentPage(),
                'last_page' => $claims->lastPage(),
                'per_page' => $claims->perPage(),
                'total' => $claims->total(),
            ],
        ];
    }

    /**
     * Process claim status and synchronize profile verification.
     *
     * @param int $claimId
     * @param array<string, mixed> $payload
     * @param User $admin
     * @returns UmkmClaim
     *
     * Usage:
     * $claim = $this->umkmClaimService->process($id, $request->validated(), $request->user());
     */
    public function process(int $claimId, array $payload, User $admin): UmkmClaim
    {
        return DB::transaction(function () use ($claimId, $payload, $admin) {
            $claim = $this->umkmClaimRepository->findOrFail($claimId);

            $nextStatus = $payload['status'];
            $claim = $this->umkmClaimRepository->update($claim, [
                'status' => $nextStatus,
                'catatan_admin' => $payload['catatan_admin'] ?? null,
                'approved_by' => $admin->id,
                'approved_at' => $nextStatus === 'approved' ? now() : null,
            ]);

            $profile = $this->umkmProfileRepository->findByIdOrFail($claim->umkm_profile_id);
            $this->umkmProfileRepository->upsertByUserId($profile->user_id, [
                'id_data_badan_usaha' => $profile->id_data_badan_usaha,
                'is_verified' => $nextStatus === 'approved',
                'verified_by' => $nextStatus === 'approved' ? $admin->id : null,
                'verified_at' => $nextStatus === 'approved' ? now() : null,
            ]);

            $this->auditLogService->log(
                $admin->id,
                'umkm_claim.processed',
                'umkm_claim',
                (string) $claim->id,
                [
                    'status' => $claim->status,
                    'umkm_profile_id' => $claim->umkm_profile_id,
                ]
            );

            return $claim;
        });
    }

    /**
     * Return status summary counts.
     *
     * @param void
     * @returns array<string, int>
     *
     * Usage:
     * $summary = $this->umkmClaimService->summary();
     */
    public function summary(): array
    {
        return $this->umkmClaimRepository->summaryCounts();
    }
}
