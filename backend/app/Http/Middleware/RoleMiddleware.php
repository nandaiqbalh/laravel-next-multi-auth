<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Role middleware verifies authenticated user role before endpoint access.
 */
class RoleMiddleware
{
    /**
     * Handle role-based access for protected endpoints.
     */
    public function handle(Request $request, Closure $next, string ...$roleNames): Response
    {
        $user = $request->user();

        if (! $user || ! $user->relationLoaded('role')) {
            $user?->load('role');
        }

        $roleName = $user->role->name;
        $roleSlug = $user->role->slug;
        $hasRole = in_array($roleName, $roleNames, true)
            || ($roleSlug && in_array($roleSlug, $roleNames, true))
            || $this->matchesDynamicAdminRole($roleName, $roleSlug, $roleNames)
            || $this->matchesDynamicUserRole($roleName, $roleSlug, $roleNames);

        if (! $user || ! $user->role || ! $hasRole) {
            return response()->json([
                'error' => true,
                'message' => 'Forbidden access for current role',
                'data' => null,
            ], 403);
        }

        return $next($request);
    }

    private function matchesDynamicAdminRole(string $roleName, ?string $roleSlug, array $roleNames): bool
    {
        foreach ($roleNames as $allowedRole) {
            if (in_array($allowedRole, ['UMKM_ADMIN', 'ADMIN_LAYANAN'], true)) {
                $normalizedSlug = strtolower((string) $roleSlug);
                $normalizedName = strtolower($roleName);

                if (str_starts_with($normalizedSlug, 'admin-') || str_contains($normalizedName, 'admin')) {
                    return true;
                }
            }

            if ($allowedRole === 'SUPERADMIN' && $roleSlug && str_starts_with(strtolower($roleSlug), 'superadmin')) {
                return true;
            }
        }

        return false;
    }

    private function matchesDynamicUserRole(string $roleName, ?string $roleSlug, array $roleNames): bool
    {
        foreach ($roleNames as $allowedRole) {
            if ($allowedRole === 'UMKM_USER') {
                $normalizedSlug = strtolower((string) $roleSlug);
                $normalizedName = strtolower($roleName);

                if ($normalizedSlug === 'user' || $normalizedName === 'user') {
                    return true;
                }
            }
        }

        return false;
    }
}
