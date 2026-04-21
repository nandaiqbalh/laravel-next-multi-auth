<?php

namespace App\Services;

use App\Repositories\PerangkatDaerahRepository;
use App\Repositories\ServiceCatalogRepository;
use App\Repositories\ServiceFormFieldRepository;
use Illuminate\Support\Facades\Cache;

/**
 * PublicCatalogService provides cached read-only data for public endpoints.
 */
class PublicCatalogService
{
    public function __construct(
        private readonly PerangkatDaerahRepository $perangkatDaerahRepository,
        private readonly ServiceCatalogRepository $serviceCatalogRepository,
        private readonly ServiceFormFieldRepository $serviceFormFieldRepository,
    ) {
    }

    /**
     * Return all perangkat daerah with lightweight fields.
     */
    public function perangkatDaerahList(): array
    {
        return Cache::remember('public.perangkat-daerah', now()->addMinutes(10), function () {
            return $this->perangkatDaerahRepository
                ->all()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'slug' => $item->slug,
                ])
                ->all();
        });
    }

    /**
     * Return active services by perangkat daerah slug.
     */
    public function activeServicesBySlug(string $slug): array
    {
        return Cache::remember("public.perangkat-daerah.{$slug}.services", now()->addMinutes(10), function () use ($slug) {
            return $this->serviceCatalogRepository
                ->listActiveByPerangkatSlug($slug)
                ->map(fn ($item) => $item->toArray())
                ->all();
        });
    }

    /**
     * Return public form fields by service id.
     */
    public function formFieldsByService(int $serviceId): array
    {
        return Cache::remember("public.services.{$serviceId}.fields", now()->addMinutes(10), function () use ($serviceId) {
            return $this->serviceFormFieldRepository
                ->listByServiceId($serviceId)
                ->map(fn ($item) => $item->toArray())
                ->all();
        });
    }
}
