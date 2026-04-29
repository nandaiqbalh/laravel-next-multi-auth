<?php

namespace App\Http\Controllers;

use App\Http\Requests\UmkmProfile\UpsertUmkmProfileRequest;
use App\Services\UmkmProfileService;

/**
 * UmkmProfileController handles user UMKM profile endpoints.
 */
class UmkmProfileController extends Controller
{
    public function __construct(private readonly UmkmProfileService $umkmProfileService)
    {
    }

    /**
     * Return authenticated user's UMKM profile.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/profile/me
     */
    public function me()
    {
        $profile = $this->umkmProfileService->myProfile(request()->user());

        return $this->successResponse('Profil UMKM fetched', $profile);
    }

    /**
     * Return UMKM profile matched by authenticated user's NIK.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/profile/by-nik
     */
    public function byNik()
    {
        $profile = $this->umkmProfileService->profileByNik(request()->user());

        return $this->successResponse('Profil UMKM fetched', $profile);
    }

    /**
     * Create or update authenticated user's UMKM profile.
     *
     * @param UpsertUmkmProfileRequest $request
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * POST /api/umkm/profile
     */
    public function upsert(UpsertUmkmProfileRequest $request)
    {
        $profile = $this->umkmProfileService->upsertMyProfile($request->user(), $request->validated());

        return $this->successResponse('Profil UMKM berhasil disimpan', $profile);
    }
}
