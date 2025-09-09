<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllCustomTables extends Migration
{
    public function up()
    {
        // berita_m
        Schema::create('berita_m', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        // daftardokter_m
        Schema::create('daftardokter_m', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();
            $table->string('title');   // Nama dokter
            $table->text('content');   // Deskripsi
            $table->timestamps();
        });

        // jadwaldokter_m
        Schema::create('jadwaldokter_m', function (Blueprint $table) {
            $table->id();
            $table->string('nama_dokter');
            $table->string('spesialisasi')->nullable();
            $table->string('hari')->nullable();
            $table->string('jam_mulai')->nullable();
            $table->string('jam_selesai')->nullable();
            $table->timestamps();
        });

        // penghargaan_m
        Schema::create('penghargaan_m', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        // pengumuman_m
        Schema::create('pengumuman_m', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->date('tanggal')->nullable();
            $table->timestamps();
        });

        // sejarah_m
        Schema::create('sejarah_m', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();
            $table->string('title');
            $table->longText('content');
            $table->timestamps();
        });

        // struktur_m
        Schema::create('struktur_m', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->timestamps();
        });

        // visimisi_m
        Schema::create('visimisi_m', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('berita_m');
        Schema::dropIfExists('daftardokter_m');
        Schema::dropIfExists('jadwaldokter_m');
        Schema::dropIfExists('penghargaan_m');
        Schema::dropIfExists('pengumuman_m');
        Schema::dropIfExists('sejarah_m');
        Schema::dropIfExists('struktur_m');
        Schema::dropIfExists('visimisi_m');
    }
}
