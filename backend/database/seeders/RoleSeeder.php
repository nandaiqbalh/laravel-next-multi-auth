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
        $defaultRoles = [
            ['name' => 'SUPERADMIN', 'slug' => 'superadmin'],
            ['name' => 'UMKM_ADMIN', 'slug' => 'umkm-admin'],
            ['name' => 'UMKM_USER', 'slug' => 'umkm-user'],
            ['name' => 'ADMIN_LAYANAN', 'slug' => 'admin-layanan'],
        ];

        foreach ($defaultRoles as $role) {
            $existingRole = Role::query()
                ->where('slug', $role['slug'])
                ->orWhere('name', $role['name'])
                ->first();

            if ($existingRole) {
                $existingRole->update([
                    'name' => $role['name'],
                    'slug' => $role['slug'],
                ]);

                continue;
            }

            Role::query()->create($role);
        }
    }
}
