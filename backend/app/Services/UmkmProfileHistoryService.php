<?php

namespace App\Services;

use App\Models\UmkmProfileHistory;
use App\Models\User;
use App\Repositories\UmkmProfileHistoryRepository;
use App\Repositories\UmkmProfileRepository;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * UmkmProfileHistoryService handles UMKM profile change requests.
 */
class UmkmProfileHistoryService
{
    public function __construct(
        private readonly UmkmProfileHistoryRepository $umkmProfileHistoryRepository,
        private readonly UmkmProfileRepository $umkmProfileRepository,
        private readonly AuditLogService $auditLogService
    ) {
    }

    /**
     * Submit change request for authenticated user.
     *
     * @param User $user
     * @param string $profileId
     * @param array<string, mixed> $payload
     * @return UmkmProfileHistory
     */
    public function submitChange(User $user, string $profileId, array $payload): UmkmProfileHistory
    {
        $profile = $this->umkmProfileRepository->findByIdOrFail($profileId);

        if ($profile->user_id && $profile->user_id !== $user->id) {
            throw new RuntimeException('Profil UMKM tidak ditemukan untuk pengguna ini');
        }

        if (! $profile->user_id && $profile->nik_pengusaha !== $user->nik) {
            throw new RuntimeException('Profil UMKM tidak ditemukan untuk pengguna ini');
        }

        if ($this->umkmProfileHistoryRepository->hasPendingByProfileId($profileId)) {
            throw new RuntimeException('Masih ada permintaan perubahan yang menunggu persetujuan');
        }

        $history = $this->umkmProfileHistoryRepository->createDraft([
            'umkm_profile_id' => $profileId,
            'payload' => $payload,
            'status' => 'pending',
            'created_by' => $user->id,
        ]);

        $this->auditLogService->log(
            $user->id,
            'umkm_profile_history.submitted',
            'umkm_profile_history',
            (string) $history->id,
            [
                'umkm_profile_id' => $history->umkm_profile_id,
                'status' => $history->status,
            ]
        );

        return $history;
    }

    /**
     * Approve pending history and apply changes to profile.
     */
    public function approve(int $historyId, User $admin): UmkmProfileHistory
    {
        return DB::transaction(function () use ($historyId, $admin) {
            $history = $this->umkmProfileHistoryRepository->findByIdOrFail($historyId);

            if ($history->status !== 'pending') {
                throw new RuntimeException('Permintaan perubahan sudah diproses');
            }

            $this->umkmProfileHistoryRepository->applyToProfile($history);

            $history = $this->umkmProfileHistoryRepository->updateStatus(
                $history,
                'approved',
                $admin->id,
                null,
                now(),
            );

            $this->auditLogService->log(
                $admin->id,
                'umkm_profile_history.approved',
                'umkm_profile_history',
                (string) $history->id,
                [
                    'umkm_profile_id' => $history->umkm_profile_id,
                    'status' => $history->status,
                ]
            );

            return $history;
        });
    }

    /**
     * Reject pending history and store admin note.
     */
    public function reject(int $historyId, User $admin, ?string $note = null): UmkmProfileHistory
    {
        $history = $this->umkmProfileHistoryRepository->findByIdOrFail($historyId);

        if ($history->status !== 'pending') {
            throw new RuntimeException('Permintaan perubahan sudah diproses');
        }

        $history = $this->umkmProfileHistoryRepository->updateStatus(
            $history,
            'rejected',
            $admin->id,
            $note,
            null,
        );

        $this->auditLogService->log(
            $admin->id,
            'umkm_profile_history.rejected',
            'umkm_profile_history',
            (string) $history->id,
            [
                'umkm_profile_id' => $history->umkm_profile_id,
                'status' => $history->status,
            ]
        );

        return $history;
    }

    /**
     * Return history list for authenticated user.
     *
     * @return array<string, mixed>
     */
    public function listForUser(User $user, int $perPage = 20): array
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile && $user->nik) {
            $profile = $this->umkmProfileRepository->findByNikPengusaha($user->nik);
        }

        if (! $profile || ($profile->user_id && $profile->user_id !== $user->id)) {
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

        $histories = $this->umkmProfileHistoryRepository->paginateByProfileId($profile->id_data_badan_usaha, $perPage);

        return [
            'items' => $histories->items(),
            'meta' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ];
    }

    /**
     * Return history list for admin queue.
     *
     * @return array<string, mixed>
     */
    public function listForAdmin(int $perPage = 20, ?string $status = null): array
    {
        $histories = $this->umkmProfileHistoryRepository->paginateForAdmin($perPage, $status);

        return [
            'items' => $histories->items(),
            'meta' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ];
    }
}
