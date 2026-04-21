<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\User;
use App\Models\ServiceFormField;
use App\Repositories\ServiceCatalogRepository;
use App\Repositories\SubmissionLogRepository;
use App\Repositories\SubmissionRepository;
use App\Repositories\UmkmClaimRepository;
use App\Repositories\UmkmProfileRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * SubmissionService handles UMKM submission business flow.
 */
class SubmissionService
{
    public function __construct(
        private readonly SubmissionRepository $submissionRepository,
        private readonly SubmissionLogRepository $submissionLogRepository,
        private readonly ServiceCatalogRepository $serviceCatalogRepository,
        private readonly UmkmProfileRepository $umkmProfileRepository,
        private readonly UmkmClaimRepository $umkmClaimRepository,
        private readonly AuditLogService $auditLogService
    ) {
    }

    /**
     * Return all service catalog items.
     *
     * @param void
     * @returns array<int, mixed>
     *
     * Usage:
     * $services = $this->submissionService->serviceCatalog();
     */
    public function serviceCatalog(): array
    {
        return $this->serviceCatalogRepository
            ->all()
            ->where('is_active', true)
            ->values()
            ->all();
    }

    /**
     * Submit new service request for authenticated user.
     *
     * @param User $user
     * @param array<string, mixed> $payload
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->submit($request->user(), $request->validated());
     */
    public function submit(User $user, array $payload): Submission
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            throw new RuntimeException('Profil UMKM belum tersedia');
        }

        if (! $profile->is_verified) {
            throw new RuntimeException('Profil UMKM belum diverifikasi admin');
        }

        $latestClaim = $this->umkmClaimRepository->latestByProfileId($profile->id_data_badan_usaha);
        if (! $latestClaim || $latestClaim->status !== 'approved') {
            throw new RuntimeException('Claim UMKM belum disetujui admin');
        }

        $service = $this->serviceCatalogRepository->findOrFail((int) $payload['service_id']);

        if (! $service->is_active) {
            throw new RuntimeException('Layanan tidak aktif');
        }

        $formData = Arr::get($payload, 'form_data', []);
        $this->validateSubmissionFormData($service->formFields->all(), is_array($formData) ? $formData : []);

        $documentUrl = Arr::get($payload, 'document_url');

        if (! $documentUrl && empty($formData)) {
            throw new RuntimeException('Dokumen atau form_data wajib diisi');
        }

        $submission = $this->submissionRepository->create([
            'umkm_profile_id' => $profile->id_data_badan_usaha,
            'service_id' => $payload['service_id'],
            'status' => 'diajukan',
            'document_url' => $documentUrl,
            'form_data' => $formData,
            'catatan_admin' => null,
            'submitted_at' => now(),
        ]);

        $this->submissionLogRepository->create([
            'submission_id' => $submission->id,
            'status_from' => null,
            'status_to' => 'diajukan',
            'note' => 'Pengajuan dibuat oleh UMKM user',
            'changed_by' => $user->id,
        ]);

        $this->auditLogService->log(
            $user->id,
            'submission.created',
            'submission',
            (string) $submission->id,
            [
                'service_id' => $submission->service_id,
                'status' => $submission->status,
            ]
        );

        return $this->submissionRepository->findOrFail($submission->id);
    }

    /**
     * Return paginated submission payload for authenticated user.
     *
     * @param User $user
     * @param int $perPage
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $submissions = $this->submissionService->listForUser($request->user(), 20);
     */
    public function listForUser(User $user, int $perPage = 20): array
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            return [
                'items' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $perPage,
                    'total' => 0,
                ],
            ];
        }

        $submissions = $this->submissionRepository->paginateByProfileId($profile->id_data_badan_usaha, $perPage);

        return [
            'items' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ];
    }

    /**
     * Return submission detail for authenticated user.
     *
     * @param int $submissionId
     * @param User $user
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->detailForUser($id, $request->user());
     */
    public function detailForUser(int $submissionId, User $user): Submission
    {
        $profile = $this->umkmProfileRepository->findByUserId($user->id);

        if (! $profile) {
            throw new RuntimeException('Profil UMKM tidak ditemukan');
        }

        $submission = $this->submissionRepository->findOrFail($submissionId);

        if ($submission->umkm_profile_id !== $profile->id_data_badan_usaha) {
            throw new RuntimeException('Pengajuan tidak ditemukan');
        }

        return $submission;
    }

    /**
     * Return paginated admin submission queue.
     *
     * @param int $perPage
     * @param string|null $status
     * @returns array{items: array<int, mixed>, meta: array<string, int>}
     *
     * Usage:
     * $queue = $this->submissionService->listForAdmin(20, 'dalam_proses');
     */
    public function listForAdmin(int $perPage = 20, ?string $status = null, ?string $search = null): array
    {
        $submissions = $this->submissionRepository->paginateForAdmin($perPage, $status, $search);

        return [
            'items' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ];
    }

    /**
     * Process submission status by admin.
     *
     * @param int $submissionId
     * @param array<string, mixed> $payload
     * @param User $admin
     * @returns Submission
     *
     * Usage:
     * $submission = $this->submissionService->process($id, $request->validated(), $request->user());
     */
    public function process(int $submissionId, array $payload, User $admin): Submission
    {
        $submission = $this->submissionRepository->findOrFail($submissionId);
        $fromStatus = $submission->status;
        $toStatus = $payload['status'];

        $updatePayload = [
            'status' => $toStatus,
            'catatan_admin' => $payload['catatan_admin'] ?? null,
            'processed_by' => $admin->id,
        ];

        if ($toStatus === 'dalam_proses' && ! $submission->processed_at) {
            $updatePayload['processed_at'] = now();
        }

        if ($toStatus === 'revisi') {
            $updatePayload['processed_at'] = now();
            $updatePayload['completed_at'] = null;
        }

        if ($toStatus === 'selesai') {
            $updatePayload['processed_at'] = $submission->processed_at ?? now();
            $updatePayload['completed_at'] = now();
        }

        $submission = $this->submissionRepository->update($submission, $updatePayload);

        $this->submissionLogRepository->create([
            'submission_id' => $submission->id,
            'status_from' => $fromStatus,
            'status_to' => $toStatus,
            'note' => $payload['catatan_admin'] ?? null,
            'changed_by' => $admin->id,
        ]);

        $this->auditLogService->log(
            $admin->id,
            'submission.processed',
            'submission',
            (string) $submission->id,
            [
                'status_from' => $fromStatus,
                'status_to' => $toStatus,
            ]
        );

        return $this->submissionRepository->findOrFail($submission->id);
    }

    /**
     * Return submission status summary counters.
     *
     * @param void
     * @returns array<string, int>
     *
     * Usage:
     * $summary = $this->submissionService->summary();
     */
    public function summary(): array
    {
        return $this->submissionRepository->summaryCounts();
    }

    /**
     * Validate payload against configured dynamic fields.
     *
     * @param array<int, ServiceFormField> $fields
     * @param array<string, mixed> $formData
     */
    private function validateSubmissionFormData(array $fields, array $formData): void
    {
        foreach ($fields as $field) {
            $value = Arr::get($formData, $field->name);

            if ($field->is_required && ($value === null || $value === '')) {
                throw new RuntimeException("Field {$field->label} wajib diisi");
            }

            if ($value === null || $value === '') {
                continue;
            }

            $this->validateSubmissionFieldType($field, $value);
        }
    }

    /**
     * Validate one dynamic value based on field type.
     */
    private function validateSubmissionFieldType(ServiceFormField $field, mixed $value): void
    {
        $type = strtolower((string) $field->type);

        if ($type === 'number' && ! is_numeric($value)) {
            throw new RuntimeException("Field {$field->label} harus berupa angka");
        }

        if ($type === 'email' && (! is_string($value) || ! filter_var($value, FILTER_VALIDATE_EMAIL))) {
            throw new RuntimeException("Field {$field->label} harus berupa email valid");
        }

        if ($type === 'date' && (! is_string($value) || strtotime($value) === false)) {
            throw new RuntimeException("Field {$field->label} harus berupa tanggal valid");
        }

        if ($type === 'tel' && (! is_string($value) || ! preg_match('/^[0-9+()\-\s]{6,25}$/', $value))) {
            throw new RuntimeException("Field {$field->label} harus berupa nomor telepon valid");
        }

        if ($type === 'file' && (! is_string($value) || ! Str::startsWith($value, ['http://', 'https://']))) {
            throw new RuntimeException("Field {$field->label} harus berupa URL file");
        }

        if (in_array($type, ['select', 'radio'], true)) {
            $allowedOptions = collect($field->options ?? [])
                ->map(function ($option) {
                    if (is_array($option)) {
                        return (string) ($option['value'] ?? $option['label'] ?? '');
                    }

                    return (string) $option;
                })
                ->filter()
                ->values()
                ->all();

            if (! in_array((string) $value, $allowedOptions, true)) {
                throw new RuntimeException("Nilai field {$field->label} tidak valid");
            }
        }

        if ($type === 'checkbox' && ! is_array($value)) {
            throw new RuntimeException("Field {$field->label} harus berupa daftar nilai");
        }
    }
}
