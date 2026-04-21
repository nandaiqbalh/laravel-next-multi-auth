<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\UserRepository;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

/**
 * Auth service encapsulates authentication and token business logic.
 */
class AuthService
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    /**
     * Register a new account and issue API token.
     */
    public function register(array $payload): array
    {
        $defaultRole = Role::query()
            ->where('slug', 'user')
            ->orWhere('name', 'USER')
            ->first();

        if (! $defaultRole) {
            $defaultRole = Role::query()->create([
                'name' => 'USER',
                'slug' => 'user',
                'perangkat_daerah_id' => null,
            ]);
        }

        $payload['role_id'] = $defaultRole->id;
        $payload['password'] = Hash::make($payload['password']);
        $user = $this->userRepository->create($payload);
        $user->load('role.perangkatDaerah');
        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Validate credentials and issue API token.
     */
    public function login(array $payload): array
    {
        $user = $this->userRepository->findByNik($payload['nik']);
        $user?->load('role.perangkatDaerah');

        if (! $user || ! Hash::check($payload['password'], $user->password)) {
            throw new AuthenticationException('Invalid credentials');
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Revoke all active API tokens for the user.
     */
    public function logout($user): void
    {
        $user->tokens()->delete();
    }
}
