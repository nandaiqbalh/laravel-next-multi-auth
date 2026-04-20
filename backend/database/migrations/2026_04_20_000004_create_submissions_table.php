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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('umkm_profile_id', 100);
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->enum('status', ['diajukan', 'dalam_proses', 'revisi', 'selesai'])->default('diajukan');
            $table->text('document_url');
            $table->text('catatan_admin')->nullable();
            $table->uuid('processed_by')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('umkm_profile_id')->references('id_data_badan_usaha')->on('umkm_profiles')->cascadeOnDelete();
            $table->foreign('processed_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
