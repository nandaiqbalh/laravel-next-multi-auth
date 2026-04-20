<?php

namespace App\Repositories;

use App\Models\ServiceCatalog;
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
        return ServiceCatalog::query()->orderBy('code')->get();
    }

    /**
     * Create or update service by code.
     */
    public function upsertByCode(string $code, string $name): ServiceCatalog
    {
        return ServiceCatalog::query()->updateOrCreate(['code' => $code], ['name' => $name]);
    }

    /**
     * Find service by id.
     */
    public function findOrFail(int $id): ServiceCatalog
    {
        return ServiceCatalog::query()->findOrFail($id);
    }
}
