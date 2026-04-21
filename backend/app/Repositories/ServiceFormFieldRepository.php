<?php

namespace App\Repositories;

use App\Models\ServiceFormField;
use Illuminate\Support\Collection;

/**
 * ServiceFormFieldRepository handles persistence for dynamic service fields.
 */
class ServiceFormFieldRepository
{
    /**
     * Return ordered fields by service id.
     */
    public function listByServiceId(int $serviceId): Collection
    {
        return ServiceFormField::query()
            ->where('service_id', $serviceId)
            ->orderBy('order')
            ->orderBy('id')
            ->get();
    }

    /**
     * Create dynamic field row.
     */
    public function create(array $payload): ServiceFormField
    {
        return ServiceFormField::query()->create($payload);
    }

    /**
     * Find field by id.
     */
    public function findOrFail(int $id): ServiceFormField
    {
        return ServiceFormField::query()->findOrFail($id);
    }

    /**
     * Update field row.
     */
    public function update(ServiceFormField $field, array $payload): ServiceFormField
    {
        $field->update($payload);

        return $field->refresh();
    }

    /**
     * Delete field row.
     */
    public function delete(ServiceFormField $field): void
    {
        $field->delete();
    }
}
