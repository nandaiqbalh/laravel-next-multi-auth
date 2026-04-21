<?php

namespace App\Services;

use App\Models\PerangkatDaerah;
use App\Repositories\PerangkatDaerahRepository;
use Illuminate\Support\Facades\Auth;

/**
 * PerangkatDaerahService encapsulates business use cases for perangkat daerah management.
 */
class PerangkatDaerahService
{
    public function __construct(
        private readonly PerangkatDaerahRepository $perangkatDaerahRepository,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    /**
     * Return paginated perangkat daerah payload.
     */
    public function list(int $perPage = 20, ?string $search = null): array
    {
        $perangkatDaerahs = $this->perangkatDaerahRepository->paginate($perPage, $search);

        return [
            'items' => $perangkatDaerahs->items(),
            'meta' => [
                'current_page' => $perangkatDaerahs->currentPage(),
                'last_page' => $perangkatDaerahs->lastPage(),
                'per_page' => $perangkatDaerahs->perPage(),
                'total' => $perangkatDaerahs->total(),
            ],
        ];
    }

    /**
     * Create perangkat daerah entity.
     */
    public function create(array $payload): PerangkatDaerah
    {
        $perangkatDaerah = $this->perangkatDaerahRepository->create($payload);

        $this->auditLogService->log(
            Auth::id(),
            'perangkat_daerah.created',
            'perangkat_daerah',
            (string) $perangkatDaerah->id,
            [
                'name' => $perangkatDaerah->name,
                'slug' => $perangkatDaerah->slug,
            ]
        );

        return $perangkatDaerah;
    }

    /**
     * Return perangkat daerah detail by id.
     */
    public function find(int $id): PerangkatDaerah
    {
        return $this->perangkatDaerahRepository->findOrFail($id);
    }

    /**
     * Update perangkat daerah entity.
     */
    public function update(int $id, array $payload): PerangkatDaerah
    {
        $perangkatDaerah = $this->perangkatDaerahRepository->findOrFail($id);
        $updated = $this->perangkatDaerahRepository->update($perangkatDaerah, $payload);

        $this->auditLogService->log(
            Auth::id(),
            'perangkat_daerah.updated',
            'perangkat_daerah',
            (string) $updated->id,
            [
                'name' => $updated->name,
                'slug' => $updated->slug,
            ]
        );

        return $updated;
    }

    /**
     * Delete perangkat daerah entity.
     */
    public function delete(int $id): void
    {
        $perangkatDaerah = $this->perangkatDaerahRepository->findOrFail($id);

        $this->perangkatDaerahRepository->delete($perangkatDaerah);

        $this->auditLogService->log(
            Auth::id(),
            'perangkat_daerah.deleted',
            'perangkat_daerah',
            (string) $perangkatDaerah->id,
            [
                'name' => $perangkatDaerah->name,
                'slug' => $perangkatDaerah->slug,
            ]
        );
    }
}
