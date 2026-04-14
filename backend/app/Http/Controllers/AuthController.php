<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

/**
 * Auth controller handles API authentication endpoints.
 */
class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * Handle user registration and token issue.
     */
    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return $this->successResponse('Register success', $result, 201);
    }

    /**
     * Handle credential login and token issue.
     */
    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login($request->validated());

            return $this->successResponse('Login success', $result);
        } catch (AuthenticationException $exception) {
            return $this->errorResponse($exception->getMessage(), null, 401);
        }
    }

    /**
     * Return authenticated user profile.
     */
    public function me(Request $request)
    {
        return $this->successResponse('Profile fetched', $request->user()->load('role'));
    }

    /**
     * Revoke current user tokens.
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse('Logout success', null);
    }
}
