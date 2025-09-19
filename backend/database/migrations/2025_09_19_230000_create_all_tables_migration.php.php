<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('direksi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('dokteranak_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokteranastesi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterbedah_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('doktergigi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('doktergizi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterobgyn_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterpenyakitdalam_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterradiologi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterrehabilitasi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('doktersaraf_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('doktertht_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('dokterumum_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->string('img2')->nullable();
            $table->timestamps();
        });

        Schema::create('penghargaan_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('pengumuman_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('sejarah_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('slide_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('caption');
            $table->timestamps();
        });

        Schema::create('spesialis_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('struktur_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('visimisi_m', function (Blueprint $table) {
            $table->id();
            $table->string('img');
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        $tables = [
            'berita_m','direksi_m','dokteranak_m','dokteranastesi_m','dokterbedah_m','doktergigi_m','doktergizi_m',
            'dokterobgyn_m','dokterpenyakitdalam_m','dokterradiologi_m','dokterrehabilitasi_m','doktersaraf_m',
            'doktertht_m','dokterumum_m','penghargaan_m','pengumuman_m','sejarah_m','slide_m','spesialis_m','struktur_m','visimisi_m'
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};