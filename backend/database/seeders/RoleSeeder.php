<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

/**
 * Role seeder inserts default system roles.
 */
class RoleSeeder extends Seeder
{
    /**
     * Seed default roles.
     */
    public function run(): void
    {
        foreach (['SUPERADMIN', 'UMKM_ADMIN', 'UMKM_USER'] as $roleName) {
            Role::query()->firstOrCreate(['name' => $roleName]);
        }
    }
}
