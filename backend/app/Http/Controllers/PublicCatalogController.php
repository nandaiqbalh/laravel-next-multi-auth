<?php

namespace App\Http\Controllers;

use App\Services\PublicCatalogService;

/**
 * PublicCatalogController exposes public read-only endpoints for layanan catalog.
 */
class PublicCatalogController extends Controller
{
    public function __construct(private readonly PublicCatalogService $publicCatalogService)
    {
    }

    /**
     * Return perangkat daerah list for public pages.
     */
    public function perangkatDaerah()
    {
        return $this->successResponse('Public perangkat daerah fetched', $this->publicCatalogService->perangkatDaerahList());
    }

    /**
     * Return active services by perangkat daerah slug.
     */
    public function servicesBySlug(string $slug)
    {
        return $this->successResponse('Public services fetched', $this->publicCatalogService->activeServicesBySlug($slug));
    }

    /**
     * Return dynamic form fields by service id.
     */
    public function serviceFields(int $serviceId)
    {
        return $this->successResponse('Public service fields fetched', $this->publicCatalogService->formFieldsByService($serviceId));
    }
}
