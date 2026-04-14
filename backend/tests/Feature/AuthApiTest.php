<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

/**
 * Auth API test covers register, login, and me endpoint behavior.
 */
class AuthApiTest extends TestCase
{
    /**
     * It can register a user and return API token payload.
     */
    public function test_register_returns_token_and_user_payload(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('pdo_sqlite extension is not available in current PHP runtime.');
        }

        Artisan::call('migrate:fresh');

        Role::query()->create(['name' => 'user']);

        $response = $this->postJson('/api/register', [
            'name' => 'Tester',
            'email' => 'tester@example.com',
            'password' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'error',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);
    }

    /**
     * It can login and fetch profile via token.
     */
    public function test_login_and_me_endpoint_work_with_sanctum_token(): void
    {
        if (! extension_loaded('pdo_sqlite')) {
            $this->markTestSkipped('pdo_sqlite extension is not available in current PHP runtime.');
        }

        Artisan::call('migrate:fresh');

        $role = Role::query()->create(['name' => 'user']);

        $this->postJson('/api/register', [
            'name' => 'Tester',
            'email' => 'tester@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ])->assertCreated();

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'tester@example.com',
            'password' => 'password123',
        ])->assertOk();

        $token = $loginResponse->json('data.token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('error', false)
            ->assertJsonPath('data.email', 'tester@example.com');
    }
}
