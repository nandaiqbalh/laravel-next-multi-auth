<?php

namespace App\Http\Controllers;

use App\Http\Requests\Submission\ProcessSubmissionRequest;
use App\Http\Requests\Submission\StoreSubmissionRequest;
use App\Services\SubmissionService;
use RuntimeException;

/**
 * SubmissionController handles UMKM service submission endpoints.
 */
class SubmissionController extends Controller
{
    public function __construct(private readonly SubmissionService $submissionService)
    {
    }

    /**
     * Return service catalog for submission form.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/services
     */
    public function services()
    {
        return $this->successResponse('Service catalog fetched', $this->submissionService->serviceCatalog());
    }

    /**
     * Create new submission by authenticated UMKM user.
     *
     * @param StoreSubmissionRequest $request
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * POST /api/umkm/submissions
     */
    public function store(StoreSubmissionRequest $request)
    {
        try {
            $submission = $this->submissionService->submit($request->user(), $request->validated());

            return $this->successResponse('Pengajuan layanan berhasil dibuat', $submission, 201);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }

    /**
     * Return paginated user submission list.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/submissions
     */
    public function indexForUser()
    {
        $data = $this->submissionService->listForUser(
            user: request()->user(),
            perPage: (int) request()->integer('per_page', 20),
        );

        return $this->successResponse('Pengajuan layanan fetched', $data);
    }

    /**
     * Return user submission detail.
     *
     * @param int $submission
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/submissions/{submission}
     */
    public function showForUser(int $submission)
    {
        try {
            $data = $this->submissionService->detailForUser($submission, request()->user());

            return $this->successResponse('Detail pengajuan fetched', $data);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 404);
        }
    }

    /**
     * Return paginated admin submission queue.
     *
     * @param void
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * GET /api/umkm/admin/submissions
     */
    public function indexForAdmin()
    {
        $data = $this->submissionService->listForAdmin(
            perPage: (int) request()->integer('per_page', 20),
            status: request()->string('status')->toString() ?: null,
        );

        return $this->successResponse('Queue pengajuan fetched', $data);
    }

    /**
     * Process submission status by admin.
     *
     * @param ProcessSubmissionRequest $request
     * @param int $submission
     * @returns \Illuminate\Http\JsonResponse
     *
     * Usage:
     * PATCH /api/umkm/admin/submissions/{submission}
     */
    public function process(ProcessSubmissionRequest $request, int $submission)
    {
        try {
            $processed = $this->submissionService->process($submission, $request->validated(), $request->user());

            return $this->successResponse('Pengajuan berhasil diproses', $processed);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 422);
        }
    }
}
