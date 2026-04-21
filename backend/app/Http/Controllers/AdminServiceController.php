<?php

namespace App\Http\Controllers;

use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Services\ServiceManagementService;
use Illuminate\Http\Request;

/**
 * AdminServiceController handles CRUD orchestration for admin layanan service management.
 */
class AdminServiceController extends Controller
{
    public function __construct(private readonly ServiceManagementService $serviceManagementService)
    {
    }

    /**
     * Return paginated service list.
     */
    public function index(Request $request)
    {
        $data = $this->serviceManagementService->list(
            perPage: (int) $request->integer('per_page', 20),
            search: $request->string('search')->toString() ?: null,
            perangkatDaerahId: $request->integer('perangkat_daerah_id') ?: null,
        );

        return $this->successResponse('Services fetched', $data);
    }

    /**
     * Create service row.
     */
    public function store(StoreServiceRequest $request)
    {
        $data = $this->serviceManagementService->create($request->validated());

        return $this->successResponse('Service created', $data, 201);
    }

    /**
     * Show service detail.
     */
    public function show(int $id)
    {
        return $this->successResponse('Service fetched', $this->serviceManagementService->find($id));
    }

    /**
     * Update service row.
     */
    public function update(UpdateServiceRequest $request, int $id)
    {
        $data = $this->serviceManagementService->update($id, $request->validated());

        return $this->successResponse('Service updated', $data);
    }

    /**
     * Delete service row.
     */
    public function destroy(int $id)
    {
        $this->serviceManagementService->delete($id);

        return $this->successResponse('Service deleted', null);
    }
}
