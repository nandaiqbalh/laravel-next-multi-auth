<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\RoleService;
use Illuminate\Http\Request;

/**
 * Role controller handles CRUD endpoint orchestration for roles.
 */
class RoleController extends Controller
{
    public function __construct(private readonly RoleService $roleService)
    {
    }

    /**
     * Display paginated roles with optional search.
     */
    public function index(Request $request)
    {
        $data = $this->roleService->list(20, $request->string('search')->toString());

        return $this->successResponse('Roles fetched', $data);
    }

    /**
     * Store new role record.
     */
    public function store(StoreRoleRequest $request)
    {
        $role = $this->roleService->create($request->validated());

        return $this->successResponse('Role created', $role, 201);
    }

    /**
     * Display one role detail.
     */
    public function show(int $role)
    {
        return $this->successResponse('Role fetched', $this->roleService->find($role));
    }

    /**
     * Update role record.
     */
    public function update(UpdateRoleRequest $request, int $role)
    {
        $updatedRole = $this->roleService->update($role, $request->validated());

        return $this->successResponse('Role updated', $updatedRole);
    }

    /**
     * Delete role record.
     */
    public function destroy(int $role)
    {
        $this->roleService->delete($role);

        return $this->successResponse('Role deleted', null);
    }
}
