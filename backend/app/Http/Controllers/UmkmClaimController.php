<?php

namespace App\Http\Controllers;

use App\Http\Requests\UmkmClaim\ProcessUmkmClaimRequest;
use App\Http\Requests\UmkmClaim\StoreUmkmClaimRequest;
use App\Services\UmkmClaimService;
use RuntimeException;

/**
 * UmkmClaimController handles UMKM claim lifecycle endpoints.
 */
class UmkmClaimController extends Controller
{
    public function __construct(private readonly UmkmClaimService $umkmClaimService)
    {
    }

    /**
     * Submit new UMKM claim by authenticated UMKM user.
     *
     * @param StoreUmkmClaimRequest $request
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * POST /api/umkm/claims
     */
    public function store(StoreUmkmClaimRequest $request)
    {
        try {
            $claim = $this->umkmClaimService->submit($request->user());

            return $this->successResponse('Claim UMKM berhasil diajukan', $claim, 201);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }

    /**
     * Return latest claim for authenticated UMKM user.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/claims/latest
     */
    public function latest()
    {
        $claim = $this->umkmClaimService->latestForUser(request()->user());

        return $this->successResponse('Claim UMKM terbaru fetched', $claim);
    }

    /**
     * Return paginated claims for admin queue.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/claims
     */
    public function index()
    {
        $data = $this->umkmClaimService->listForAdmin(
            perPage: (int) request()->integer('per_page', 20),
            status: request()->string('status')->toString() ?: null,
        );

        return $this->successResponse('Claim UMKM fetched', $data);
    }

    /**
     * Process admin decision for a claim.
     *
     * @param ProcessUmkmClaimRequest $request
     * @param int $claim
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * PATCH /api/umkm/admin/claims/{claim}
     */
    public function process(ProcessUmkmClaimRequest $request, int $claim)
    {
        try {
            $processed = $this->umkmClaimService->process($claim, $request->validated(), $request->user());

            return $this->successResponse('Claim UMKM berhasil diproses', $processed);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }
}
