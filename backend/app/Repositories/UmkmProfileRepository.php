<?php

namespace App\Repositories;

use App\Models\UmkmProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * UmkmProfileRepository handles persistence for UMKM profiles.
 */
class UmkmProfileRepository
{
    /**
     * Find profile by owner user id.
     */
    public function findByUserId(string $userId): ?UmkmProfile
    {
        return UmkmProfile::query()
            ->with(['verifier'])
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Find profile by pengusaha NIK.
     */
    public function findByNikPengusaha(string $nik): ?UmkmProfile
    {
        return UmkmProfile::query()
            ->with(['user', 'verifier'])
            ->where('nik_pengusaha', $nik)
            ->first();
    }

    /**
     * Find profile by profile identifier.
     */
    public function findByIdOrFail(string $profileId): UmkmProfile
    {
        return UmkmProfile::query()->with(['user', 'verifier'])->findOrFail($profileId);
    }

    /**
     * Upsert profile by owner user id.
     */
    public function upsertByUserId(string $userId, array $payload): UmkmProfile
    {
        $profile = $this->findByUserId($userId);

        if ($profile) {
            $profile->fill($payload)->save();

            return $profile->refresh()->load(['user', 'verifier']);
        }

        if (! empty($payload['id_data_badan_usaha'])) {
            $existing = UmkmProfile::query()
                ->where('id_data_badan_usaha', $payload['id_data_badan_usaha'])
                ->first();

            if ($existing && (! $existing->user_id || $existing->user_id === $userId)) {
                $existing->fill(array_merge($payload, ['user_id' => $userId]))->save();

                return $existing->refresh()->load(['user', 'verifier']);
            }
        }

        if (! empty($payload['nik_pengusaha'])) {
            $existing = UmkmProfile::query()
                ->where('nik_pengusaha', $payload['nik_pengusaha'])
                ->first();

            if ($existing && (! $existing->user_id || $existing->user_id === $userId)) {
                $existing->fill(array_merge($payload, ['user_id' => $userId]))->save();

                return $existing->refresh()->load(['user', 'verifier']);
            }
        }

        $profile = UmkmProfile::query()->create($payload);

        return $profile->refresh()->load(['user', 'verifier']);
    }

    /**
     * Attach profile to user if not yet linked.
     */
    public function attachUser(UmkmProfile $profile, string $userId): UmkmProfile
    {
        $profile->user_id = $userId;
        $profile->save();

        return $profile->refresh()->load(['user', 'verifier']);
    }

    /**
     * Return paginated profiles for admin screens.
     */
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return UmkmProfile::query()
            ->with(['user', 'verifier'])
            ->when($search, function ($query) use ($search) {
                $query->where('id_data_badan_usaha', 'like', "%{$search}%")
                    ->orWhere('nama_pengusaha', 'like', "%{$search}%")
                    ->orWhere('nama_usaha', 'like', "%{$search}%")
                    ->orWhere('nik_pengusaha', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Return profile summary counts for dashboard.
     */
    public function summaryCounts(): array
    {
        return [
            'total' => UmkmProfile::query()->count(),
            'verified' => UmkmProfile::query()->where('is_verified', true)->count(),
            'unverified' => UmkmProfile::query()->where('is_verified', false)->count(),
        ];
    }
}
