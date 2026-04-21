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
        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('perangkat_daerah_id')
                ->nullable()
                ->after('name')
                ->constrained('perangkat_daerahs')
                ->cascadeOnDelete();
            $table->boolean('is_active')->default(true)->after('perangkat_daerah_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropConstrainedForeignId('perangkat_daerah_id');
            $table->dropColumn('is_active');
        });
    }
};
