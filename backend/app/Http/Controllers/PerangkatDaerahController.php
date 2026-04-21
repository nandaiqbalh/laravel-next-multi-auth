<?php

namespace App\Http\Controllers;

use App\Http\Requests\PerangkatDaerah\StorePerangkatDaerahRequest;
use App\Http\Requests\PerangkatDaerah\UpdatePerangkatDaerahRequest;
use App\Services\PerangkatDaerahService;
use Illuminate\Http\Request;

/**
 * PerangkatDaerahController handles CRUD orchestration for perangkat daerah.
 */
class PerangkatDaerahController extends Controller
{
    public function __construct(private readonly PerangkatDaerahService $perangkatDaerahService)
    {
    }

    /**
     * Return paginated perangkat daerah list.
     */
    public function index(Request $request)
    {
        $data = $this->perangkatDaerahService->list(
            perPage: (int) $request->integer('per_page', 20),
            search: $request->string('search')->toString() ?: null,
        );

        return $this->successResponse('Perangkat daerah fetched', $data);
    }

    /**
     * Create perangkat daerah entity.
     */
    public function store(StorePerangkatDaerahRequest $request)
    {
        $data = $this->perangkatDaerahService->create($request->validated());

        return $this->successResponse('Perangkat daerah created', $data, 201);
    }

    /**
     * Show perangkat daerah detail.
     */
    public function show(int $id)
    {
        return $this->successResponse('Perangkat daerah fetched', $this->perangkatDaerahService->find($id));
    }

    /**
     * Update perangkat daerah entity.
     */
    public function update(UpdatePerangkatDaerahRequest $request, int $id)
    {
        $data = $this->perangkatDaerahService->update($id, $request->validated());

        return $this->successResponse('Perangkat daerah updated', $data);
    }

    /**
     * Delete perangkat daerah entity.
     */
    public function destroy(int $id)
    {
        $this->perangkatDaerahService->delete($id);

        return $this->successResponse('Perangkat daerah deleted', null);
    }
}
