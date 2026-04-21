<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceFormField\ReorderServiceFormFieldRequest;
use App\Http\Requests\ServiceFormField\StoreServiceFormFieldRequest;
use App\Http\Requests\ServiceFormField\UpdateServiceFormFieldRequest;
use App\Services\ServiceFormFieldService;

/**
 * ServiceFormFieldController handles dynamic service form field management.
 */
class ServiceFormFieldController extends Controller
{
    public function __construct(private readonly ServiceFormFieldService $serviceFormFieldService)
    {
    }

    /**
     * Return fields by service.
     */
    public function index(int $serviceId)
    {
        return $this->successResponse('Service fields fetched', $this->serviceFormFieldService->listByService($serviceId));
    }

    /**
     * Create field for target service.
     */
    public function store(StoreServiceFormFieldRequest $request, int $serviceId)
    {
        $data = $this->serviceFormFieldService->create($serviceId, $request->validated());

        return $this->successResponse('Service field created', $data, 201);
    }

    /**
     * Update dynamic field.
     */
    public function update(UpdateServiceFormFieldRequest $request, int $fieldId)
    {
        $data = $this->serviceFormFieldService->update($fieldId, $request->validated());

        return $this->successResponse('Service field updated', $data);
    }

    /**
     * Delete dynamic field.
     */
    public function destroy(int $fieldId)
    {
        $this->serviceFormFieldService->delete($fieldId);

        return $this->successResponse('Service field deleted', null);
    }

    /**
     * Reorder fields for service.
     */
    public function reorder(ReorderServiceFormFieldRequest $request, int $serviceId)
    {
        $data = $this->serviceFormFieldService->reorder($serviceId, $request->validated('fields'));

        return $this->successResponse('Service fields reordered', $data);
    }
}
