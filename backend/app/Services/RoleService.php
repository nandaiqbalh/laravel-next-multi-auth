<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;

/**
 * Role service encapsulates business rules for role management.
 */
class RoleService
{
    public function __construct(private readonly RoleRepository $roleRepository)
    {
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
        return $this->roleRepository->create($payload);
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

        return $this->roleRepository->update($role, $payload);
    }

    /**
     * Delete role by id.
     */
    public function delete(int $id): void
    {
        $role = $this->roleRepository->findOrFail($id);
        $this->roleRepository->delete($role);
    }
}
