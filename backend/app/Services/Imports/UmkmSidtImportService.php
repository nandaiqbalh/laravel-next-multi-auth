<?php

namespace App\Services\Imports;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Console\Command\Command as SymfonyCommand;

class UmkmSidtImportService
{
    /**
     * Run import from SIDT API and persist page progress.
     */
    public function run(Command $command, array $options): int
    {
        $source = (string) ($options['source'] ?? 'kulon_progo');
        $limit = max(1, (int) ($options['limit'] ?? 50));
        $maxPages = isset($options['max_pages']) ? (int) $options['max_pages'] : null;
        $startPageOption = isset($options['start_page']) ? (int) $options['start_page'] : null;
        $endPage = isset($options['end_page']) ? (int) $options['end_page'] : null;
        $sleepMs = max(0, (int) ($options['sleep_ms'] ?? 0));
        $fromScratch = (bool) ($options['from_scratch'] ?? false);

        $baseUrl = rtrim((string) config('services.umkm_sidt.base_url', ''), '/');
        $endpoint = '/'.ltrim((string) config('services.umkm_sidt.endpoint', ''), '/');
        $xApiToken = (string) config('services.umkm_sidt.x_api_token', '');
        $bearerToken = (string) config('services.umkm_sidt.bearer_token', '');
        $timeout = (int) config('services.umkm_sidt.timeout', 30);

        if ($baseUrl === '' || $endpoint === '' || $xApiToken === '' || $bearerToken === '') {
            $command->error('Konfigurasi UMKM_SIDT_* belum lengkap di .env');

            return SymfonyCommand::FAILURE;
        }

        $state = $this->getOrCreateState($source);

        if ($fromScratch) {
            DB::table('umkm_import_states')
                ->where('source', $source)
                ->update([
                    'last_success_page' => 0,
                    'last_attempt_page' => null,
                    'last_page_from_api' => null,
                    'total_rows_processed' => 0,
                    'total_rows_inserted' => 0,
                    'total_rows_updated' => 0,
                    'total_rows_failed' => 0,
                    'is_running' => false,
                    'last_error' => null,
                    'started_at' => null,
                    'finished_at' => null,
                    'updated_at' => now(),
                ]);

            $state = $this->getOrCreateState($source);
        }

        $currentPage = $startPageOption && $startPageOption > 0
            ? $startPageOption
            : ((int) $state->last_success_page + 1);

        if ($currentPage <= 0) {
            $currentPage = 1;
        }

        $command->info("Mulai import source={$source}, page={$currentPage}, limit={$limit}");
        $processedPages = 0;

        try {
            while (true) {
                if ($endPage !== null && $currentPage > $endPage) {
                    $command->info('Selesai: sudah melewati end-page.');
                    break;
                }

                if ($maxPages !== null && $maxPages > 0 && $processedPages >= $maxPages) {
                    $command->info('Selesai: mencapai max-pages pada run ini.');
                    break;
                }

                DB::table('umkm_import_states')
                    ->where('source', $source)
                    ->update([
                        'is_running' => true,
                        'last_attempt_page' => $currentPage,
                        'last_error' => null,
                        'started_at' => DB::raw('COALESCE(started_at, CURRENT_TIMESTAMP)'),
                        'updated_at' => now(),
                    ]);

                $response = Http::acceptJson()
                    ->withHeaders(['X-API-TOKEN' => $xApiToken])
                    ->withToken($bearerToken)
                    ->timeout($timeout)
                    ->get($baseUrl.$endpoint, [
                        'page' => $currentPage,
                        'limit' => $limit,
                    ]);

                if (! $response->successful()) {
                    $body = mb_substr($response->body(), 0, 500);
                    throw new \RuntimeException("Request gagal [{$response->status()}]: {$body}");
                }

                $rows = $response->json('data.data', []);
                $lastPageFromApi = (int) ($response->json('data.last_page') ?? 0);

                if (! is_array($rows) || $rows === []) {
                    DB::table('umkm_import_states')
                        ->where('source', $source)
                        ->update([
                            'last_success_page' => $currentPage,
                            'last_page_from_api' => $lastPageFromApi > 0 ? $lastPageFromApi : null,
                            'is_running' => false,
                            'finished_at' => now(),
                            'updated_at' => now(),
                        ]);

                    $command->warn("Page {$currentPage} kosong. Import dihentikan.");
                    break;
                }

                $stats = $this->upsertRows($rows);

                DB::table('umkm_import_states')
                    ->where('source', $source)
                    ->update([
                        'last_success_page' => $currentPage,
                        'last_page_from_api' => $lastPageFromApi > 0 ? $lastPageFromApi : null,
                        'total_rows_processed' => DB::raw('total_rows_processed + '.$stats['processed']),
                        'total_rows_inserted' => DB::raw('total_rows_inserted + '.$stats['inserted']),
                        'total_rows_updated' => DB::raw('total_rows_updated + '.$stats['updated']),
                        'total_rows_failed' => DB::raw('total_rows_failed + '.$stats['failed']),
                        'is_running' => false,
                        'finished_at' => now(),
                        'last_error' => null,
                        'updated_at' => now(),
                    ]);

                $command->line("Page {$currentPage}: processed={$stats['processed']} inserted={$stats['inserted']} updated={$stats['updated']} failed={$stats['failed']}");

                $processedPages++;

                if ($lastPageFromApi > 0 && $currentPage >= $lastPageFromApi) {
                    $command->info('Selesai: sudah mencapai last_page dari API.');
                    break;
                }

                $currentPage++;

                if ($sleepMs > 0) {
                    usleep($sleepMs * 1000);
                }
            }
        } catch (\Throwable $exception) {
            DB::table('umkm_import_states')
                ->where('source', $source)
                ->update([
                    'is_running' => false,
                    'finished_at' => now(),
                    'last_error' => mb_substr($exception->getMessage(), 0, 2000),
                    'updated_at' => now(),
                ]);

            Log::error('UMKM SIDT import failed', [
                'source' => $source,
                'page' => $currentPage,
                'error' => $exception->getMessage(),
            ]);

            $command->error('Import gagal: '.$exception->getMessage());

            return SymfonyCommand::FAILURE;
        }

        $latest = DB::table('umkm_import_states')->where('source', $source)->first();

        $command->info('Import selesai.');
        $command->line('last_success_page='.(int) ($latest->last_success_page ?? 0));
        $command->line('total_rows_processed='.(int) ($latest->total_rows_processed ?? 0));
        $command->line('total_rows_inserted='.(int) ($latest->total_rows_inserted ?? 0));
        $command->line('total_rows_updated='.(int) ($latest->total_rows_updated ?? 0));
        $command->line('total_rows_failed='.(int) ($latest->total_rows_failed ?? 0));

        return SymfonyCommand::SUCCESS;
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     * @return array{processed:int, inserted:int, updated:int, failed:int}
     */
    private function upsertRows(array $rows): array
    {
        $stats = [
            'processed' => count($rows),
            'inserted' => 0,
            'updated' => 0,
            'failed' => 0,
        ];

        $ids = [];

        foreach ($rows as $row) {
            $id = $row['id_data_badan_usaha'] ?? null;

            if ($id === null || $id === '') {
                $stats['failed']++;
                continue;
            }

            $ids[] = (string) $id;
        }

        $existingIds = DB::table('umkm_profiles')
            ->whereIn('id_data_badan_usaha', $ids)
            ->pluck('id_data_badan_usaha')
            ->map(fn ($id) => (string) $id)
            ->all();

        $existingSet = array_fill_keys($existingIds, true);
        $now = now();

        $payloads = [];

        foreach ($rows as $row) {
            try {
                $mapped = $this->mapRow($row);

                if ($mapped === null) {
                    $stats['failed']++;
                    continue;
                }

                $id = (string) $mapped['id_data_badan_usaha'];

                if (isset($existingSet[$id])) {
                    $stats['updated']++;
                } else {
                    $stats['inserted']++;
                }

                $payloads[] = array_merge($mapped, [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            } catch (\Throwable $exception) {
                $stats['failed']++;
            }
        }

        if ($payloads !== []) {
            DB::table('umkm_profiles')->upsert(
                $payloads,
                ['id_data_badan_usaha'],
                [
                    'nik_pengusaha',
                    'nama_pengusaha',
                    'nib',
                    'jenis_kelamin',
                    'is_disabilitas',
                    'tanggal_lahir',
                    'prov_pengusaha',
                    'kab_pengusaha',
                    'kec_pengusaha',
                    'kel_pengusaha',
                    'alamat_pengusaha',
                    'rt_pengusaha',
                    'rw_pengusaha',
                    'kontak_hp',
                    'pendidikan_formal',
                    'nama_usaha',
                    'kegiatan_utama',
                    'produk_utama',
                    'kategori_kbli',
                    'kode_kbli',
                    'status_badan_usaha',
                    'modal_pendirian',
                    'bulan_mulai_operasi',
                    'tahun_mulai_operasi',
                    'prov_usaha',
                    'kab_usaha',
                    'kec_usaha',
                    'kel_usaha',
                    'alamat_usaha',
                    'rt_usaha',
                    'rw_usaha',
                    'foto_usaha',
                    'alamat_latitude',
                    'alamat_longitude',
                    'tk_dibayar_laki',
                    'tk_dibayar_perempuan',
                    'tk_dibayar_disabil_laki',
                    'tk_dibayar_disabil_perempuan',
                    'tk_not_dibayar_laki',
                    'tk_not_dibayar_perempuan',
                    'tk_not_dibayar_disabil_laki',
                    'tk_not_dibayar_disabil_perempuan',
                    'skala_usaha',
                    'omzet_tahunan',
                    'asset',
                    'updated_at',
                ]
            );
        }

        return $stats;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>|null
     */
    private function mapRow(array $row): ?array
    {
        $id = $row['id_data_badan_usaha'] ?? null;

        if ($id === null || $id === '') {
            return null;
        }

        return [
            'id_data_badan_usaha' => (string) $id,
            'user_id' => null,
            'nik_pengusaha' => $this->stringVal($row, 'nik_pengusaha', 32),
            'nama_pengusaha' => $this->stringVal($row, 'nama_pengusaha', 150),
            'nib' => $this->nullableStringVal($row, 'nib', 64),
            'jenis_kelamin' => $this->stringVal($row, 'jenis_kelamin', 20),
            'is_disabilitas' => $this->toBool($row['is_disabilitas'] ?? null),
            'tanggal_lahir' => $this->toDate($row['tanggal_lahir'] ?? null),
            'prov_pengusaha' => $this->stringVal($row, 'prov_pengusaha', 120),
            'kab_pengusaha' => $this->stringVal($row, 'kab_pengusaha', 120),
            'kec_pengusaha' => $this->stringVal($row, 'kec_pengusaha', 120),
            'kel_pengusaha' => $this->stringVal($row, 'kel_pengusaha', 120),
            'alamat_pengusaha' => $this->textVal($row, 'alamat_pengusaha'),
            'rt_pengusaha' => $this->nullableStringVal($row, 'rt_pengusaha', 5),
            'rw_pengusaha' => $this->nullableStringVal($row, 'rw_pengusaha', 5),
            'kontak_hp' => $this->stringVal($row, 'kontak_hp', 20),
            'pendidikan_formal' => $this->nullableStringVal($row, 'pendidikan_formal', 120),
            'nama_usaha' => $this->stringVal($row, 'nama_usaha', 150),
            'kegiatan_utama' => $this->nullableTextVal($row, 'kegiatan_utama'),
            'produk_utama' => $this->nullableStringVal($row, 'produk_utama', 180),
            'kategori_kbli' => $this->nullableStringVal($row, 'kategori_kbli', 150),
            'kode_kbli' => $this->nullableStringVal($row, 'kode_kbli', 20),
            'status_badan_usaha' => $this->nullableStringVal($row, 'status_badan_usaha', 120),
            'modal_pendirian' => $this->toDecimal($row['modal_pendirian'] ?? null),
            'bulan_mulai_operasi' => $this->toIntOrNull($row['bulan_mulai_operasi'] ?? null),
            'tahun_mulai_operasi' => $this->toIntOrNull($row['tahun_mulai_operasi'] ?? null),
            'prov_usaha' => $this->stringVal($row, 'prov_usaha', 120),
            'kab_usaha' => $this->stringVal($row, 'kab_usaha', 120),
            'kec_usaha' => $this->stringVal($row, 'kec_usaha', 120),
            'kel_usaha' => $this->stringVal($row, 'kel_usaha', 120),
            'alamat_usaha' => $this->textVal($row, 'alamat_usaha'),
            'rt_usaha' => $this->nullableStringVal($row, 'rt_usaha', 5),
            'rw_usaha' => $this->nullableStringVal($row, 'rw_usaha', 5),
            'foto_usaha' => $this->nullableTextVal($row, 'foto_usaha'),
            'alamat_latitude' => $this->toDecimalInRange($row['alamat_latitude'] ?? null, -90, 90),
            'alamat_longitude' => $this->toDecimalInRange($row['alamat_longitude'] ?? null, -180, 180),
            'tk_dibayar_laki' => $this->toIntOrZero($row['tk_dibayar_laki'] ?? null),
            'tk_dibayar_perempuan' => $this->toIntOrZero($row['tk_dibayar_perempuan'] ?? null),
            'tk_dibayar_disabil_laki' => $this->toIntOrZero($row['tk_dibayar_disabil_laki'] ?? null),
            'tk_dibayar_disabil_perempuan' => $this->toIntOrZero($row['tk_dibayar_disabil_perempuan'] ?? null),
            'tk_not_dibayar_laki' => $this->toIntOrZero($row['tk_not_dibayar_laki'] ?? null),
            'tk_not_dibayar_perempuan' => $this->toIntOrZero($row['tk_not_dibayar_perempuan'] ?? null),
            'tk_not_dibayar_disabil_laki' => $this->toIntOrZero($row['tk_not_dibayar_disabil_laki'] ?? null),
            'tk_not_dibayar_disabil_perempuan' => $this->toIntOrZero($row['tk_not_dibayar_disabil_perempuan'] ?? $row['tk_not_dibayar_disabil_perempua'] ?? null),
            'skala_usaha' => $this->nullableStringVal($row, 'skala_usaha', 100),
            'omzet_tahunan' => $this->toDecimal($row['omzet_tahunan'] ?? null),
            'asset' => $this->toDecimal($row['asset'] ?? null),
        ];
    }

    /**
     * @param array<string, mixed> $row
     */
    private function stringVal(array $row, string $key, int $maxLength): string
    {
        $value = trim((string) ($row[$key] ?? ''));

        return mb_substr($value, 0, $maxLength);
    }

    /**
     * @param array<string, mixed> $row
     */
    private function nullableStringVal(array $row, string $key, int $maxLength): ?string
    {
        if (! isset($row[$key]) || $row[$key] === null || trim((string) $row[$key]) === '') {
            return null;
        }

        return mb_substr(trim((string) $row[$key]), 0, $maxLength);
    }

    /**
     * @param array<string, mixed> $row
     */
    private function textVal(array $row, string $key): string
    {
        return trim((string) ($row[$key] ?? ''));
    }

    /**
     * @param array<string, mixed> $row
     */
    private function nullableTextVal(array $row, string $key): ?string
    {
        if (! isset($row[$key]) || $row[$key] === null || trim((string) $row[$key]) === '') {
            return null;
        }

        return trim((string) $row[$key]);
    }

    /**
     * @param mixed $value
     */
    private function toBool(mixed $value): bool
    {
        return in_array((string) $value, ['1', 'true', 'TRUE'], true);
    }

    /**
     * @param mixed $value
     */
    private function toDate(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $raw = trim((string) $value);

        if ($raw === '' || str_starts_with($raw, '0001-01-01')) {
            return null;
        }

        try {
            return Carbon::parse($raw)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @param mixed $value
     */
    private function toDecimal(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $raw = trim((string) $value);

        if ($raw === '') {
            return null;
        }

        $normalized = str_replace([',', ' '], ['', ''], $raw);

        if (! is_numeric($normalized)) {
            return null;
        }

        return $normalized;
    }

    /**
     * @param mixed $value
     */
    private function toDecimalInRange(mixed $value, float $min, float $max): ?string
    {
        $decimal = $this->toDecimal($value);

        if ($decimal === null) {
            return null;
        }

        $numeric = (float) $decimal;

        if ($numeric < $min || $numeric > $max) {
            return null;
        }

        return $decimal;
    }

    /**
     * @param mixed $value
     */
    private function toIntOrZero(mixed $value): int
    {
        if ($value === null || $value === '') {
            return 0;
        }

        return max(0, (int) $value);
    }

    /**
     * @param mixed $value
     */
    private function toIntOrNull(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return max(0, (int) $value);
    }

    /**
     * @return object
     */
    private function getOrCreateState(string $source): object
    {
        $now = now();

        DB::table('umkm_import_states')->updateOrInsert(
            ['source' => $source],
            [
                'updated_at' => $now,
                'created_at' => $now,
            ]
        );

        return DB::table('umkm_import_states')->where('source', $source)->first();
    }
}
