<?php

namespace App\Repositories;

use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Role repository handles direct data access for role entities.
 */
class RoleRepository
{
    /**
     * Return paginated role data with optional search.
     */
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return Role::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new role record.
     */
    public function create(array $data): Role
    {
        return Role::query()->create($data);
    }

    /**
     * Find role by id.
     */
    public function findOrFail(int $id): Role
    {
        return Role::query()->findOrFail($id);
    }

    /**
     * Update an existing role record.
     */
    public function update(Role $role, array $data): Role
    {
        $role->update($data);

        return $role->refresh();
    }

    /**
     * Delete a role record.
     */
    public function delete(Role $role): void
    {
        $role->delete();
    }
}
