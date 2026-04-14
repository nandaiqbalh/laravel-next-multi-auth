<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

/**
 * User controller handles CRUD endpoint orchestration for users.
 */
class UserController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    /**
     * Display paginated users with optional search.
     */
    public function index(Request $request)
    {
        $data = $this->userService->list(20, $request->string('search')->toString());

        return $this->successResponse('Users fetched', $data);
    }

    /**
     * Store new user record.
     */
    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->create($request->validated());

        return $this->successResponse('User created', $user, 201);
    }

    /**
     * Display one user detail.
     */
    public function show(int $user)
    {
        return $this->successResponse('User fetched', $this->userService->find($user));
    }

    /**
     * Update user record.
     */
    public function update(UpdateUserRequest $request, int $user)
    {
        $updatedUser = $this->userService->update($user, $request->validated());

        return $this->successResponse('User updated', $updatedUser);
    }

    /**
     * Delete user record.
     */
    public function destroy(int $user)
    {
        $this->userService->delete($user);

        return $this->successResponse('User deleted', null);
    }
}
