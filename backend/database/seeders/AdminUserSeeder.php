<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Admin user seeder inserts one default administrator account.
 */
class AdminUserSeeder extends Seeder
{
    /**
     * Seed default administrator account.
     */
    public function run(): void
    {
        $adminRole = Role::query()->where('slug', 'superadmin')->first()
            ?? Role::query()->where('name', 'SUPERADMIN')->firstOrFail();

        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'nik' => '0000000000000001',
                'name' => 'System Admin',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
            ]
        );
    }
}
