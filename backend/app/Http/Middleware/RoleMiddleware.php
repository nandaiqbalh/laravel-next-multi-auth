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

        if (! $user || ! $user->role || ! in_array($user->role->name, $roleNames, true)) {
            return response()->json([
                'error' => true,
                'message' => 'Forbidden access for current role',
                'data' => null,
            ], 403);
        }

        return $next($request);
    }
}
