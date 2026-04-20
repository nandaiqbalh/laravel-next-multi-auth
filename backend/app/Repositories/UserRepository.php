<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * User repository handles direct data access for user entities.
 */
class UserRepository
{
    /**
     * Return paginated user data with optional search and role relation.
     */
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return User::query()
            ->with('role')
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new user record.
     */
    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    /**
     * Find user by id with role relation.
     */
    public function findOrFail(string $id): User
    {
        return User::query()->with('role')->findOrFail($id);
    }

    /**
     * Find user by NIK with role relation.
     */
    public function findByNik(string $nik): ?User
    {
        return User::query()->with('role')->where('nik', $nik)->first();
    }

    /**
     * Find user by email with role relation.
     */
    public function findByEmail(string $email): ?User
    {
        return User::query()->with('role')->where('email', $email)->first();
    }

    /**
     * Update an existing user record.
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->refresh()->load('role');
    }

    /**
     * Delete a user record.
     */
    public function delete(User $user): void
    {
        $user->delete();
    }
}
