<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UmkmAdminController;
use App\Http\Controllers\UmkmClaimController;
use App\Http\Controllers\UmkmProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/umkm/services', [SubmissionController::class, 'services']);

    Route::middleware('role:UMKM_USER')->group(function () {
        Route::get('/umkm/profile/me', [UmkmProfileController::class, 'me']);
        Route::post('/umkm/profile', [UmkmProfileController::class, 'upsert']);

        Route::post('/umkm/claims', [UmkmClaimController::class, 'store']);
        Route::get('/umkm/claims/latest', [UmkmClaimController::class, 'latest']);

        Route::get('/umkm/submissions', [SubmissionController::class, 'indexForUser']);
        Route::post('/umkm/submissions', [SubmissionController::class, 'store']);
        Route::get('/umkm/submissions/{submission}', [SubmissionController::class, 'showForUser']);
    });

    Route::middleware('role:UMKM_ADMIN,SUPERADMIN')->prefix('/umkm/admin')->group(function () {
        Route::get('/dashboard', [UmkmAdminController::class, 'dashboard']);
        Route::get('/data-umkm', [UmkmAdminController::class, 'dataUmkm']);
        Route::get('/pengajuan', [UmkmAdminController::class, 'pengajuan']);
        Route::get('/rekap', [UmkmAdminController::class, 'rekap']);
        Route::get('/users', [UmkmAdminController::class, 'users']);
        Route::get('/audit-trail', [UmkmAdminController::class, 'auditTrail']);

        Route::get('/claims', [UmkmClaimController::class, 'index']);
        Route::patch('/claims/{claim}', [UmkmClaimController::class, 'process']);
        Route::get('/submissions', [SubmissionController::class, 'indexForAdmin']);
        Route::patch('/submissions/{submission}', [SubmissionController::class, 'process']);
    });

    Route::middleware('role:SUPERADMIN')->group(function () {
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('users', UserController::class);
        Route::get('/audit-trail', [AuditLogController::class, 'index']);
    });
});
