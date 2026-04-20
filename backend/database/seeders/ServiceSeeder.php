<?php

namespace Database\Seeders;

use App\Repositories\ServiceCatalogRepository;
use Illuminate\Database\Seeder;

/**
 * ServiceSeeder inserts default UMKM service catalog entries.
 */
class ServiceSeeder extends Seeder
{
    /**
     * Seed service catalog defaults.
     */
    public function run(): void
    {
        $repository = app(ServiceCatalogRepository::class);

        foreach ([
            'PIRT' => 'Sertifikasi PIRT',
            'NIB' => 'Nomor Induk Berusaha',
            'KURASI' => 'Kurasi Produk UMKM',
            'HALAL' => 'Sertifikasi Halal',
            'QRIS' => 'Aktivasi QRIS',
            'BBM' => 'Bina Bisnis Mandiri',
        ] as $code => $name) {
            $repository->upsertByCode($code, $name);
        }
    }
}
