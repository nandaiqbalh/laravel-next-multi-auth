<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('umkm_import_states', function (Blueprint $table) {
            $table->id();
            $table->string('source', 100)->unique();
            $table->unsignedInteger('last_success_page')->default(0);
            $table->unsignedInteger('last_attempt_page')->nullable();
            $table->unsignedInteger('last_page_from_api')->nullable();
            $table->unsignedBigInteger('total_rows_processed')->default(0);
            $table->unsignedBigInteger('total_rows_inserted')->default(0);
            $table->unsignedBigInteger('total_rows_updated')->default(0);
            $table->unsignedBigInteger('total_rows_failed')->default(0);
            $table->boolean('is_running')->default(false);
            $table->text('last_error')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_import_states');
    }
};
