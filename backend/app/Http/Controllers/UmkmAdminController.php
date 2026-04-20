<?php

namespace App\Http\Controllers;

use App\Services\UmkmAdminService;

/**
 * UmkmAdminController serves aggregated payloads for UMKM admin dashboard pages.
 */
class UmkmAdminController extends Controller
{
    public function __construct(private readonly UmkmAdminService $umkmAdminService)
    {
    }

    /**
     * Return dashboard summary payload.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/dashboard
     */
    public function dashboard()
    {
        return $this->successResponse('UMKM dashboard fetched', $this->umkmAdminService->dashboardSummary());
    }

    /**
     * Return paginated UMKM profile dataset.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/data-umkm
     */
    public function dataUmkm()
    {
        $data = $this->umkmAdminService->dataUmkm(
            perPage: (int) request()->integer('per_page', 20),
            search: request()->string('search')->toString() ?: null,
        );

        return $this->successResponse('Data UMKM fetched', $data);
    }

    /**
     * Return paginated submission queue.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/pengajuan
     */
    public function pengajuan()
    {
        $data = $this->umkmAdminService->pengajuan(
            perPage: (int) request()->integer('per_page', 20),
            status: request()->string('status')->toString() ?: null,
        );

        return $this->successResponse('Pengajuan UMKM fetched', $data);
    }

    /**
     * Return recap summary payload.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/rekap
     */
    public function rekap()
    {
        return $this->successResponse('Rekap UMKM fetched', $this->umkmAdminService->rekap());
    }

    /**
     * Return paginated users for UMKM admin view.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/users
     */
    public function users()
    {
        $data = $this->umkmAdminService->users(
            perPage: (int) request()->integer('per_page', 20),
            search: request()->string('search')->toString() ?: null,
        );

        return $this->successResponse('UMKM users fetched', $data);
    }

    /**
     * Return paginated audit trail for UMKM admin.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/audit-trail
     */
    public function auditTrail()
    {
        $data = $this->umkmAdminService->auditTrail(
            perPage: (int) request()->integer('per_page', 20),
            entityType: request()->string('entity_type')->toString() ?: null,
        );

        return $this->successResponse('Audit trail fetched', $data);
    }
}
