<?php

namespace App\Repositories;

use App\Models\UmkmProfile;
use App\Models\UmkmProfileHistory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * UmkmProfileHistoryRepository handles persistence for UMKM profile change requests.
 */
class UmkmProfileHistoryRepository
{
    /**
     * Create a new history draft.
     */
    public function createDraft(array $payload): UmkmProfileHistory
    {
        return UmkmProfileHistory::query()->create($payload)->load(['profile', 'creator', 'approver']);
    }

    /**
     * Find history by id.
     */
    public function findById(int $id): ?UmkmProfileHistory
    {
        return UmkmProfileHistory::query()->with(['profile', 'creator', 'approver'])->find($id);
    }

    /**
     * Find history by id or fail.
     */
    public function findByIdOrFail(int $id): UmkmProfileHistory
    {
        return UmkmProfileHistory::query()->with(['profile', 'creator', 'approver'])->findOrFail($id);
    }

    /**
     * Get pending histories.
     */
    public function getPending(): \Illuminate\Database\Eloquent\Collection
    {
        return UmkmProfileHistory::query()
            ->with(['profile', 'creator', 'approver'])
            ->where('status', 'pending')
            ->latest('created_at')
            ->get();
    }

    /**
     * Paginate histories for a profile.
     */
    public function paginateByProfileId(string $profileId, int $perPage = 20): LengthAwarePaginator
    {
        return UmkmProfileHistory::query()
            ->with(['profile', 'creator', 'approver'])
            ->where('umkm_profile_id', $profileId)
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Paginate histories for admin queue.
     */
    public function paginateForAdmin(int $perPage = 20, ?string $status = null): LengthAwarePaginator
    {
        return UmkmProfileHistory::query()
            ->with(['profile', 'creator', 'approver'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Check if profile has pending history.
     */
    public function hasPendingByProfileId(string $profileId): bool
    {
        return UmkmProfileHistory::query()
            ->where('umkm_profile_id', $profileId)
            ->where('status', 'pending')
            ->exists();
    }

    /**
     * Update history status metadata.
     */
    public function updateStatus(
        UmkmProfileHistory $history,
        string $status,
        ?string $adminId,
        ?string $note = null,
        ?\DateTimeInterface $approvedAt = null,
    ): UmkmProfileHistory {
        $history->update([
            'status' => $status,
            'approved_by' => $adminId,
            'approved_at' => $approvedAt,
            'catatan_admin' => $note,
        ]);

        return $history->refresh()->load(['profile', 'creator', 'approver']);
    }

    /**
     * Apply history payload to profile.
     */
    public function applyToProfile(UmkmProfileHistory $history): UmkmProfile
    {
        $profile = UmkmProfile::query()->findOrFail($history->umkm_profile_id);
        $profile->fill($history->payload ?? []);
        $profile->save();

        return $profile->refresh()->load(['user', 'verifier']);
    }
}
