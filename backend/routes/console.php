<?php

use App\Services\Imports\UmkmSidtImportService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('umkm:sync-sidt
    {--source=kulon_progo : Key source untuk tracker import}
    {--start-page= : Paksa mulai dari halaman tertentu}
    {--end-page= : Berhenti sampai halaman tertentu}
    {--max-pages= : Batasi jumlah halaman untuk 1 kali run}
    {--limit=50 : Jumlah row per request API}
    {--sleep-ms=0 : Jeda antar request (milidetik)}
    {--from-scratch : Reset tracker dan mulai lagi dari page 1}', function () {
    return app(UmkmSidtImportService::class)->run($this, [
        'source' => $this->option('source'),
        'start_page' => $this->option('start-page'),
        'end_page' => $this->option('end-page'),
        'max_pages' => $this->option('max-pages'),
        'limit' => $this->option('limit'),
        'sleep_ms' => $this->option('sleep-ms'),
        'from_scratch' => (bool) $this->option('from-scratch'),
    ]);
})->purpose('Sinkronisasi UMKM SIDT per halaman dan simpan progress halaman terakhir')
    ;
