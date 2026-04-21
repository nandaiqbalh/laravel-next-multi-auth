<?php

namespace App\Repositories;

use App\Models\ServiceCatalog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * ServiceCatalogRepository handles UMKM service catalog data.
 */
class ServiceCatalogRepository
{
    /**
     * Return all services sorted by code.
     */
    public function all(): Collection
    {
        return ServiceCatalog::query()
            ->with('perangkatDaerah')
            ->orderBy('code')
            ->get();
    }

    /**
     * Create or update service by code.
     */
    public function upsertByCode(string $code, string $name, ?int $perangkatDaerahId = null, bool $isActive = true): ServiceCatalog
    {
        return ServiceCatalog::query()->updateOrCreate(
            ['code' => $code],
            [
                'name' => $name,
                'perangkat_daerah_id' => $perangkatDaerahId,
                'is_active' => $isActive,
            ]
        );
    }

    /**
     * Return paginated services for admin management pages.
     */
    public function paginateForAdmin(int $perPage = 20, ?string $search = null, ?int $perangkatDaerahId = null): LengthAwarePaginator
    {
        return ServiceCatalog::query()
            ->with('perangkatDaerah')
            ->when($search, function ($query) use ($search) {
                $lowerSearch = strtolower($search);
                $query->where(function ($searchQuery) use ($lowerSearch) {
                    $searchQuery
                        ->whereRaw('LOWER(code) LIKE ?', ["%{$lowerSearch}%"])
                        ->orWhereRaw('LOWER(name) LIKE ?', ["%{$lowerSearch}%"]);
                });
            })
            ->when($perangkatDaerahId, fn ($query) => $query->where('perangkat_daerah_id', $perangkatDaerahId))
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Return active services by perangkat daerah slug for public pages.
     */
    public function listActiveByPerangkatSlug(string $slug): Collection
    {
        return ServiceCatalog::query()
            ->with('perangkatDaerah')
            ->where('is_active', true)
            ->whereHas('perangkatDaerah', fn ($query) => $query->where('slug', $slug))
            ->orderBy('name')
            ->get();
    }

    /**
     * Create service catalog row.
     */
    public function create(array $payload): ServiceCatalog
    {
        return ServiceCatalog::query()->create($payload)->load('perangkatDaerah');
    }

    /**
     * Find service by id.
     */
    public function findOrFail(int $id): ServiceCatalog
    {
        return ServiceCatalog::query()->with(['perangkatDaerah', 'formFields'])->findOrFail($id);
    }

    /**
     * Update service catalog row.
     */
    public function update(ServiceCatalog $service, array $payload): ServiceCatalog
    {
        $service->update($payload);

        return $service->refresh()->load('perangkatDaerah');
    }

    /**
     * Delete service catalog row.
     */
    public function delete(ServiceCatalog $service): void
    {
        $service->delete();
    }
}
