<?php

namespace App\Http\Controllers;

use App\Http\Requests\UmkmProfile\RejectUmkmProfileHistoryRequest;
use App\Http\Requests\UmkmProfile\SubmitUmkmProfileUpdateRequest;
use App\Services\UmkmProfileHistoryService;
use RuntimeException;

/**
 * UmkmProfileHistoryController handles UMKM profile update request endpoints.
 */
class UmkmProfileHistoryController extends Controller
{
    public function __construct(private readonly UmkmProfileHistoryService $umkmProfileHistoryService)
    {
    }

    /**
     * Submit UMKM profile change request for authenticated user.
     *
     * Usage:
     * POST /api/umkm/profile/update-request
     */
    public function submit(SubmitUmkmProfileUpdateRequest $request)
    {
        try {
            $payload = $request->validated();
            $history = $this->umkmProfileHistoryService->submitChange(
                $request->user(),
                (string) $payload['id_data_badan_usaha'],
                $payload,
            );

            return $this->successResponse('Permintaan perubahan profil UMKM berhasil diajukan', $history, 201);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }

    /**
     * Return history list for authenticated user.
     *
     * Usage:
     * GET /api/umkm/profile/history
     */
    public function history()
    {
        $data = $this->umkmProfileHistoryService->listForUser(
            request()->user(),
            (int) request()->integer('per_page', 10),
        );

        return $this->successResponse('Riwayat perubahan profil UMKM fetched', $data);
    }

    /**
     * Return history queue for admin.
     *
     * Usage:
     * GET /api/umkm/admin/umkm/profile/history
     */
    public function adminIndex()
    {
        $data = $this->umkmProfileHistoryService->listForAdmin(
            perPage: (int) request()->integer('per_page', 20),
            status: request()->string('status')->toString() ?: null,
        );

        return $this->successResponse('Riwayat perubahan profil UMKM fetched', $data);
    }

    /**
     * Approve UMKM profile change request.
     *
     * Usage:
     * POST /api/umkm/admin/umkm/profile/history/:id/approve
     */
    public function approve(int $id)
    {
        try {
            $history = $this->umkmProfileHistoryService->approve($id, request()->user());

            return $this->successResponse('Permintaan perubahan profil UMKM disetujui', $history);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }

    /**
     * Reject UMKM profile change request.
     *
     * Usage:
     * POST /api/umkm/admin/umkm/profile/history/:id/reject
     */
    public function reject(RejectUmkmProfileHistoryRequest $request, int $id)
    {
        try {
            $history = $this->umkmProfileHistoryService->reject(
                $id,
                $request->user(),
                $request->validated('catatan_admin'),
            );

            return $this->successResponse('Permintaan perubahan profil UMKM ditolak', $history);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }
}
