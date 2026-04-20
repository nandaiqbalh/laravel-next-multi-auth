<?php

namespace App\Services;

use App\Models\UmkmProfile;
use App\Models\User;
use App\Repositories\UmkmProfileRepository;

/**
 * UmkmProfileService handles UMKM profile business rules.
 */
class UmkmProfileService
{
    public function __construct(
        private readonly UmkmProfileRepository $umkmProfileRepository,
        private readonly AuditLogService $auditLogService
    ) {
    }

    /**
     * Return authenticated user's UMKM profile.
     *
     * @param User $user
     * @returns UmkmProfile|null
     *
     * Usage:
     * $profile = $this->umkmProfileService->myProfile($request->user());
     */
    public function myProfile(User $user): ?UmkmProfile
    {
        return $this->umkmProfileRepository->findByUserId($user->id);
    }

    /**
     * Upsert authenticated user's UMKM profile.
     *
     * @param User $user
     * @param array<string, mixed> $payload
     * @returns UmkmProfile
     *
     * Usage:
     * $profile = $this->umkmProfileService->upsertMyProfile($request->user(), $request->validated());
     */
    public function upsertMyProfile(User $user, array $payload): UmkmProfile
    {
        $payload['user_id'] = $user->id;
        $payload['is_verified'] = false;
        $payload['verified_by'] = null;
        $payload['verified_at'] = null;

        $profile = $this->umkmProfileRepository->upsertByUserId($user->id, $payload);

        $this->auditLogService->log(
            $user->id,
            'umkm_profile.upserted',
            'umkm_profile',
            $profile->id_data_badan_usaha,
            [
                'nama_usaha' => $profile->nama_usaha,
                'is_verified' => $profile->is_verified,
            ]
        );

        return $profile;
    }

    /**
     * Return paginated profile payload for admin pages.
     *
     * @param int $perPage
     * @param string|null $search
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $data = $this->umkmProfileService->listForAdmin(20, 'batik');
     */
    public function listForAdmin(int $perPage = 20, ?string $search = null): array
    {
        $profiles = $this->umkmProfileRepository->paginate($perPage, $search);

        return [
            'items' => $profiles->items(),
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'last_page' => $profiles->lastPage(),
                'per_page' => $profiles->perPage(),
                'total' => $profiles->total(),
            ],
        ];
    }

    /**
     * Return aggregate profile verification summary.
     *
     * @param void
     * @returns array<string, int>
     *
     * Usage:
     * $summary = $this->umkmProfileService->summary();
     */
    public function summary(): array
    {
        return $this->umkmProfileRepository->summaryCounts();
    }
}
