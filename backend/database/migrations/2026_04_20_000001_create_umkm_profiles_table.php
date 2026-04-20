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
        Schema::create('umkm_profiles', function (Blueprint $table) {
            $table->string('id_data_badan_usaha', 100)->primary();
            $table->uuid('user_id')->unique();

            $table->string('nik_pengusaha', 32);
            $table->string('nama_pengusaha', 150);
            $table->string('nib', 64)->nullable();
            $table->string('jenis_kelamin', 20);
            $table->boolean('is_disabilitas')->default(false);
            $table->date('tanggal_lahir')->nullable();

            $table->string('prov_pengusaha', 120);
            $table->string('kab_pengusaha', 120);
            $table->string('kec_pengusaha', 120);
            $table->string('kel_pengusaha', 120);
            $table->text('alamat_pengusaha');
            $table->string('rt_pengusaha', 5)->nullable();
            $table->string('rw_pengusaha', 5)->nullable();

            $table->string('kontak_hp', 20);
            $table->string('pendidikan_formal', 120)->nullable();

            $table->string('nama_usaha', 150);
            $table->text('kegiatan_utama')->nullable();
            $table->string('produk_utama', 180)->nullable();
            $table->string('kategori_kbli', 150)->nullable();
            $table->string('kode_kbli', 20)->nullable();
            $table->string('status_badan_usaha', 120)->nullable();

            $table->decimal('modal_pendirian', 18, 2)->nullable();
            $table->unsignedTinyInteger('bulan_mulai_operasi')->nullable();
            $table->unsignedSmallInteger('tahun_mulai_operasi')->nullable();

            $table->string('prov_usaha', 120);
            $table->string('kab_usaha', 120);
            $table->string('kec_usaha', 120);
            $table->string('kel_usaha', 120);
            $table->text('alamat_usaha');
            $table->string('rt_usaha', 5)->nullable();
            $table->string('rw_usaha', 5)->nullable();

            $table->text('foto_usaha')->nullable();
            $table->decimal('alamat_latitude', 11, 8)->nullable();
            $table->decimal('alamat_longitude', 11, 8)->nullable();

            $table->unsignedInteger('tk_dibayar_laki')->default(0);
            $table->unsignedInteger('tk_dibayar_perempuan')->default(0);
            $table->unsignedInteger('tk_dibayar_disabil_laki')->default(0);
            $table->unsignedInteger('tk_dibayar_disabil_perempuan')->default(0);

            $table->unsignedInteger('tk_not_dibayar_laki')->default(0);
            $table->unsignedInteger('tk_not_dibayar_perempuan')->default(0);
            $table->unsignedInteger('tk_not_dibayar_disabil_laki')->default(0);
            $table->unsignedInteger('tk_not_dibayar_disabil_perempuan')->default(0);

            $table->string('skala_usaha', 100)->nullable();
            $table->decimal('omzet_tahunan', 18, 2)->nullable();
            $table->decimal('asset', 18, 2)->nullable();

            $table->boolean('is_verified')->default(false);
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('verified_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_profiles');
    }
};
