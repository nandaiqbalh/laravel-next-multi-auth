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
        Schema::table('roles', function (Blueprint $table) {
            $table->string('slug', 120)->nullable()->after('name');
            $table->foreignId('perangkat_daerah_id')
                ->nullable()
                ->after('slug')
                ->constrained('perangkat_daerahs')
                ->nullOnDelete();
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->unique('slug');
            $table->index('perangkat_daerah_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('perangkat_daerah_id');
            $table->dropUnique('roles_slug_unique');
            $table->dropColumn('slug');
        });
    }
};