<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Admin access test verifies role middleware protection for admin CRUD routes.
 */
class AdminCrudAccessTest extends TestCase
{
    /**
     * It blocks non-admin user from accessing users CRUD list.
     */
    public function test_non_admin_cannot_access_users_index(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('pdo_sqlite extension is not available in current PHP runtime.');
        }

        Artisan::call('migrate:fresh');

        $userRole = Role::query()->create(['name' => 'user']);

        $user = User::factory()->create([
            'role_id' => $userRole->id,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/users')
            ->assertForbidden()
            ->assertJsonPath('error', true);
    }

    /**
     * It allows admin user to access users CRUD list.
     */
    public function test_admin_can_access_users_index(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('pdo_sqlite extension is not available in current PHP runtime.');
        }

        Artisan::call('migrate:fresh');

        $adminRole = Role::query()->create(['name' => 'admin']);

        $admin = User::factory()->create([
            'role_id' => $adminRole->id,
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/users')
            ->assertOk()
            ->assertJsonPath('error', false)
            ->assertJsonStructure([
                'error',
                'message',
                'data' => ['items', 'meta'],
            ]);
    }
}
