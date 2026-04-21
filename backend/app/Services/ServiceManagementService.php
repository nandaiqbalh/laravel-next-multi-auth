<?php

namespace App\Services;

use App\Models\ServiceCatalog;
use App\Repositories\PerangkatDaerahRepository;
use App\Repositories\ServiceCatalogRepository;
use Illuminate\Support\Facades\Auth;

/**
 * ServiceManagementService handles admin layanan CRUD for services.
 */
class ServiceManagementService
{
    public function __construct(
        private readonly ServiceCatalogRepository $serviceCatalogRepository,
        private readonly PerangkatDaerahRepository $perangkatDaerahRepository,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    /**
     * Return paginated services for admin layar management.
     */
    public function list(int $perPage = 20, ?string $search = null, ?int $perangkatDaerahId = null): array
    {
        if ($perangkatDaerahId === null) {
            $user = Auth::user();

            if ($user && ! $user->relationLoaded('role')) {
                $user->load('role');
            }

            if ($user?->role?->perangkat_daerah_id) {
                $perangkatDaerahId = $user->role->perangkat_daerah_id;
            }
        }

        $services = $this->serviceCatalogRepository->paginateForAdmin($perPage, $search, $perangkatDaerahId);

        return [
            'items' => $services->items(),
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
        ];
    }

    /**
     * Create service catalog entity.
     */
    public function create(array $payload): ServiceCatalog
    {
        $this->perangkatDaerahRepository->findOrFail((int) $payload['perangkat_daerah_id']);

        $service = $this->serviceCatalogRepository->create($payload);

        $this->auditLogService->log(
            Auth::id(),
            'service.created',
            'service',
            (string) $service->id,
            [
                'code' => $service->code,
                'name' => $service->name,
                'perangkat_daerah_id' => $service->perangkat_daerah_id,
            ]
        );

        return $service;
    }

    /**
     * Return one service detail.
     */
    public function find(int $id): ServiceCatalog
    {
        return $this->serviceCatalogRepository->findOrFail($id);
    }

    /**
     * Update service catalog entity.
     */
    public function update(int $id, array $payload): ServiceCatalog
    {
        if (isset($payload['perangkat_daerah_id'])) {
            $this->perangkatDaerahRepository->findOrFail((int) $payload['perangkat_daerah_id']);
        }

        $service = $this->serviceCatalogRepository->findOrFail($id);
        $updated = $this->serviceCatalogRepository->update($service, $payload);

        $this->auditLogService->log(
            Auth::id(),
            'service.updated',
            'service',
            (string) $updated->id,
            [
                'code' => $updated->code,
                'name' => $updated->name,
                'perangkat_daerah_id' => $updated->perangkat_daerah_id,
                'is_active' => $updated->is_active,
            ]
        );

        return $updated;
    }

    /**
     * Delete service entity.
     */
    public function delete(int $id): void
    {
        $service = $this->serviceCatalogRepository->findOrFail($id);
        $this->serviceCatalogRepository->delete($service);

        $this->auditLogService->log(
            Auth::id(),
            'service.deleted',
            'service',
            (string) $service->id,
            [
                'code' => $service->code,
                'name' => $service->name,
            ]
        );
    }
}
