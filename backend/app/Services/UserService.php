<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * User service encapsulates business rules for user management.
 */
class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly AuditLogService $auditLogService,
    ) {
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

        $user = $this->userRepository->create($payload)->load('role');

        $this->auditLogService->log(
            Auth::id(),
            'user.created',
            'user',
            (string) $user->id,
            [
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
        );

        return $user;
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
        $updatedUser = $this->userRepository->update($user, $payload);

        $this->auditLogService->log(
            Auth::id(),
            'user.updated',
            'user',
            (string) $updatedUser->id,
            [
                'name' => $updatedUser->name,
                'email' => $updatedUser->email,
                'role_id' => $updatedUser->role_id,
            ],
        );

        return $updatedUser;
    }

    /**
     * Delete user by id.
     */
    public function delete(string $id): void
    {
        $user = $this->userRepository->findOrFail($id);
        $this->userRepository->delete($user);

        $this->auditLogService->log(
            Auth::id(),
            'user.deleted',
            'user',
            (string) $user->id,
            [
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
        );
    }
}
