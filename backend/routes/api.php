<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AdminServiceController;
use App\Http\Controllers\PerangkatDaerahController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceFormFieldController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UmkmAdminController;
use App\Http\Controllers\UmkmClaimController;
use App\Http\Controllers\UmkmProfileController;
use App\Http\Controllers\UmkmProfileHistoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/public/perangkat-daerah', [PublicCatalogController::class, 'perangkatDaerah']);
Route::get('/public/layanan/{slug}', [PublicCatalogController::class, 'servicesBySlug']);
Route::get('/public/layanan/{serviceId}/fields', [PublicCatalogController::class, 'serviceFields']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/umkm/services', [SubmissionController::class, 'services']);

    Route::middleware('role:UMKM_USER')->group(function () {
        Route::get('/umkm/profile/me', [UmkmProfileController::class, 'me']);
        Route::get('/umkm/profile/by-nik', [UmkmProfileController::class, 'byNik']);
        Route::post('/umkm/profile/update-request', [UmkmProfileHistoryController::class, 'submit']);
        Route::get('/umkm/profile/history', [UmkmProfileHistoryController::class, 'history']);

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

        Route::get('/umkm/profile/history', [UmkmProfileHistoryController::class, 'adminIndex']);
        Route::post('/umkm/profile/history/{id}/approve', [UmkmProfileHistoryController::class, 'approve']);
        Route::post('/umkm/profile/history/{id}/reject', [UmkmProfileHistoryController::class, 'reject']);
    });

    Route::middleware('role:UMKM_ADMIN,ADMIN_LAYANAN')->prefix('/umkm/admin')->group(function () {
        Route::apiResource('services', AdminServiceController::class)
            ->parameters(['services' => 'service'])
            ->only(['index', 'store', 'show', 'update', 'destroy']);

        Route::get('services/{serviceId}/fields', [ServiceFormFieldController::class, 'index']);
        Route::post('services/{serviceId}/fields', [ServiceFormFieldController::class, 'store']);
        Route::patch('services/{serviceId}/fields/reorder', [ServiceFormFieldController::class, 'reorder']);
        Route::patch('service-fields/{fieldId}', [ServiceFormFieldController::class, 'update']);
        Route::delete('service-fields/{fieldId}', [ServiceFormFieldController::class, 'destroy']);
    });

    Route::middleware('role:SUPERADMIN')->group(function () {
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('users', UserController::class);
        Route::apiResource('perangkat-daerah', PerangkatDaerahController::class)
            ->parameters(['perangkat-daerah' => 'perangkat_daerah'])
            ->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::get('/audit-trail', [AuditLogController::class, 'index']);
    });
});
