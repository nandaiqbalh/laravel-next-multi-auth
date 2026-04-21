<?php

namespace App\Repositories;

use App\Models\Submission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * SubmissionRepository handles submission persistence operations.
 */
class SubmissionRepository
{
    /**
     * Create submission record.
     */
    public function create(array $payload): Submission
    {
        return Submission::query()->create($payload)->load(['profile', 'service', 'processor']);
    }

    /**
     * Return paginated submissions for a profile.
     */
    public function paginateByProfileId(string $profileId, int $perPage = 20): LengthAwarePaginator
    {
        return Submission::query()
            ->with(['service', 'processor'])
            ->where('umkm_profile_id', $profileId)
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Return paginated submissions for admin queue.
     */
    public function paginateForAdmin(int $perPage = 20, ?string $status = null, ?string $search = null): LengthAwarePaginator
    {
        return Submission::query()
            ->with(['profile', 'service.perangkatDaerah', 'processor'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($search, function ($query) use ($search) {
                $lowerSearch = strtolower($search);
                $query->where(function ($searchQuery) use ($lowerSearch) {
                    $searchQuery
                        ->whereRaw('LOWER(umkm_profile_id::text) LIKE ?', ["%{$lowerSearch}%"])
                        ->orWhereHas('service', function ($serviceQuery) use ($lowerSearch) {
                            $serviceQuery
                                ->whereRaw('LOWER(code) LIKE ?', ["%{$lowerSearch}%"])
                                ->orWhereRaw('LOWER(name) LIKE ?', ["%{$lowerSearch}%"]);
                        });
                    });
            })
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Find submission by id.
     */
    public function findOrFail(int $id): Submission
    {
        return Submission::query()->with(['profile', 'service', 'processor', 'logs.changer'])->findOrFail($id);
    }

    /**
     * Update submission record.
     */
    public function update(Submission $submission, array $payload): Submission
    {
        $submission->update($payload);

        return $submission->refresh()->load(['profile', 'service', 'processor', 'logs.changer']);
    }

    /**
     * Return status summary for dashboard cards.
     */
    public function summaryCounts(): array
    {
        return [
            'diajukan' => Submission::query()->where('status', 'diajukan')->count(),
            'dalam_proses' => Submission::query()->where('status', 'dalam_proses')->count(),
            'revisi' => Submission::query()->where('status', 'revisi')->count(),
            'selesai' => Submission::query()->where('status', 'selesai')->count(),
        ];
    }
}
