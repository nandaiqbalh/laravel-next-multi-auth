<?php

namespace App\Services;

use App\Repositories\ServiceCatalogRepository;
use Illuminate\Support\Collection;

/**
 * ServiceCatalogService exposes UMKM service catalog use-cases.
 */
class ServiceCatalogService
{
    public function __construct(private readonly ServiceCatalogRepository $serviceCatalogRepository)
    {
    }

    /**
     * Return full service catalog.
     *
     * @param void
     * @returns Collection<int, mixed>
     *
     * Usage:
     * $services = $this->serviceCatalogService->all();
     */
    public function all(): Collection
    {
        return $this->serviceCatalogRepository->all();
    }
}
