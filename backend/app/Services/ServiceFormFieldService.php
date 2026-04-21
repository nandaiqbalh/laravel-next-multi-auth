<?php

namespace App\Services;

use App\Models\ServiceFormField;
use App\Repositories\ServiceCatalogRepository;
use App\Repositories\ServiceFormFieldRepository;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

/**
 * ServiceFormFieldService handles CRUD and ordering of dynamic fields per service.
 */
class ServiceFormFieldService
{
    private const SUPPORTED_TYPES = [
        'text',
        'textarea',
        'select',
        'number',
        'date',
        'file',
        'radio',
        'checkbox',
        'email',
        'tel',
    ];

    public function __construct(
        private readonly ServiceFormFieldRepository $serviceFormFieldRepository,
        private readonly ServiceCatalogRepository $serviceCatalogRepository,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    /**
     * Return ordered fields for service.
     */
    public function listByService(int $serviceId): array
    {
        $this->serviceCatalogRepository->findOrFail($serviceId);

        return $this->serviceFormFieldRepository->listByServiceId($serviceId)->all();
    }

    /**
     * Create dynamic field.
     */
    public function create(int $serviceId, array $payload): ServiceFormField
    {
        $service = $this->serviceCatalogRepository->findOrFail($serviceId);

        $normalizedType = strtolower((string) $payload['type']);
        $this->validateFieldType($normalizedType);

        $field = $this->serviceFormFieldRepository->create([
            ...$payload,
            'service_id' => $service->id,
            'type' => $normalizedType,
        ]);

        $this->auditLogService->log(
            Auth::id(),
            'service_field.created',
            'service_form_field',
            (string) $field->id,
            [
                'service_id' => $service->id,
                'name' => $field->name,
                'type' => $field->type,
            ]
        );

        return $field;
    }

    /**
     * Update dynamic field.
     */
    public function update(int $fieldId, array $payload): ServiceFormField
    {
        $field = $this->serviceFormFieldRepository->findOrFail($fieldId);

        if (isset($payload['type'])) {
            $payload['type'] = strtolower((string) $payload['type']);
            $this->validateFieldType($payload['type']);
        }

        $updated = $this->serviceFormFieldRepository->update($field, $payload);

        $this->auditLogService->log(
            Auth::id(),
            'service_field.updated',
            'service_form_field',
            (string) $updated->id,
            [
                'service_id' => $updated->service_id,
                'name' => $updated->name,
                'type' => $updated->type,
            ]
        );

        return $updated;
    }

    /**
     * Delete dynamic field.
     */
    public function delete(int $fieldId): void
    {
        $field = $this->serviceFormFieldRepository->findOrFail($fieldId);
        $this->serviceFormFieldRepository->delete($field);

        $this->auditLogService->log(
            Auth::id(),
            'service_field.deleted',
            'service_form_field',
            (string) $field->id,
            [
                'service_id' => $field->service_id,
                'name' => $field->name,
            ]
        );
    }

    /**
     * Reorder dynamic fields.
     */
    public function reorder(int $serviceId, array $fields): array
    {
        $this->serviceCatalogRepository->findOrFail($serviceId);

        foreach ($fields as $entry) {
            $field = $this->serviceFormFieldRepository->findOrFail((int) $entry['id']);

            if ($field->service_id !== $serviceId) {
                throw new RuntimeException('Field tidak termasuk ke layanan ini.');
            }

            $this->serviceFormFieldRepository->update($field, ['order' => (int) $entry['order']]);
        }

        $this->auditLogService->log(
            Auth::id(),
            'service_field.reordered',
            'service',
            (string) $serviceId,
            ['count' => count($fields)]
        );

        return $this->listByService($serviceId);
    }

    /**
     * Validate supported field type.
     */
    private function validateFieldType(string $type): void
    {
        if (! in_array($type, self::SUPPORTED_TYPES, true)) {
            throw new RuntimeException('Tipe field tidak didukung.');
        }
    }
}
