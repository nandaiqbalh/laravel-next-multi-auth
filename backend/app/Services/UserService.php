<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

/**
 * User service encapsulates business rules for user management.
 */
class UserService
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    /**
     * Return standardized paginated user payload.
     */
    public function list(int $perPage = 20, ?string $search = null): array
    {
        $users = $this->userRepository->paginate($perPage, $search);

        return [
            'items' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ];
    }

    /**
     * Create user with validated data.
     */
    public function create(array $payload): User
    {
        $payload['password'] = Hash::make($payload['password']);

        return $this->userRepository->create($payload)->load('role');
    }

    /**
     * Retrieve one user by id.
     */
    public function find(string $id): User
    {
        return $this->userRepository->findOrFail($id);
    }

    /**
     * Update user by id.
     */
    public function update(string $id, array $payload): User
    {
        if (! empty($payload['password'])) {
            $payload['password'] = Hash::make($payload['password']);
        } else {
            unset($payload['password']);
        }

        $user = $this->userRepository->findOrFail($id);

        return $this->userRepository->update($user, $payload);
    }

    /**
     * Delete user by id.
     */
    public function delete(string $id): void
    {
        $user = $this->userRepository->findOrFail($id);
        $this->userRepository->delete($user);
    }
}
