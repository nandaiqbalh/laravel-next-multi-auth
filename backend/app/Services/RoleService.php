<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\Auth;

/**
 * Role service encapsulates business rules for role management.
 */
class RoleService
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly AuditLogService $auditLogService,
    ) {
    }

    /**
     * Return standardized paginated role payload.
     */
    public function list(int $perPage = 20, ?string $search = null): array
    {
        $roles = $this->roleRepository->paginate($perPage, $search);

        return [
            'items' => $roles->items(),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
            ],
        ];
    }

    /**
     * Create a role with validated data.
     */
    public function create(array $payload): Role
    {
        $role = $this->roleRepository->create($payload);

        $this->auditLogService->log(
            Auth::id(),
            'role.created',
            'role',
            (string) $role->id,
            [
                'name' => $role->name,
            ],
        );

        return $role;
    }

    /**
     * Retrieve one role by id.
     */
    public function find(int $id): Role
    {
        return $this->roleRepository->findOrFail($id);
    }

    /**
     * Update role by id.
     */
    public function update(int $id, array $payload): Role
    {
        $role = $this->roleRepository->findOrFail($id);
        $updatedRole = $this->roleRepository->update($role, $payload);

        $this->auditLogService->log(
            Auth::id(),
            'role.updated',
            'role',
            (string) $updatedRole->id,
            [
                'name' => $updatedRole->name,
            ],
        );

        return $updatedRole;
    }

    /**
     * Delete role by id.
     */
    public function delete(int $id): void
    {
        $role = $this->roleRepository->findOrFail($id);
        $this->roleRepository->delete($role);

        $this->auditLogService->log(
            Auth::id(),
            'role.deleted',
            'role',
            (string) $role->id,
            [
                'name' => $role->name,
            ],
        );
    }
}
