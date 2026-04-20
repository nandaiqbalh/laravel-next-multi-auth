<?php

namespace App\Repositories;

use App\Models\UmkmClaim;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * UmkmClaimRepository handles claim persistence operations.
 */
class UmkmClaimRepository
{
    /**
     * Create a claim record.
     */
    public function create(array $payload): UmkmClaim
    {
        return UmkmClaim::query()->create($payload)->load(['profile', 'approver']);
    }

    /**
     * Get latest claim by profile id.
     */
    public function latestByProfileId(string $profileId): ?UmkmClaim
    {
        return UmkmClaim::query()
            ->with(['profile', 'approver'])
            ->where('umkm_profile_id', $profileId)
            ->latest('created_at')
            ->first();
    }

    /**
     * Check if profile has pending claim.
     */
    public function hasPendingByProfileId(string $profileId): bool
    {
        return UmkmClaim::query()
            ->where('umkm_profile_id', $profileId)
            ->where('status', 'pending')
            ->exists();
    }

    /**
     * Return paginated claim data for admin.
     */
    public function paginate(int $perPage = 20, ?string $status = null): LengthAwarePaginator
    {
        return UmkmClaim::query()
            ->with(['profile', 'approver'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Find claim by id.
     */
    public function findOrFail(int $id): UmkmClaim
    {
        return UmkmClaim::query()->with(['profile', 'approver'])->findOrFail($id);
    }

    /**
     * Update claim data.
     */
    public function update(UmkmClaim $claim, array $payload): UmkmClaim
    {
        $claim->update($payload);

        return $claim->refresh()->load(['profile', 'approver']);
    }

    /**
     * Return status summary for admin dashboard.
     */
    public function summaryCounts(): array
    {
        return [
            'pending' => UmkmClaim::query()->where('status', 'pending')->count(),
            'approved' => UmkmClaim::query()->where('status', 'approved')->count(),
            'rejected' => UmkmClaim::query()->where('status', 'rejected')->count(),
        ];
    }
}
