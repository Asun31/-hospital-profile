<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStrukturMTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('struktur_m', function (Blueprint $table) {
            $table->id(); // Kolom id sebagai primary key
            $table->string('jabatan'); // Kolom jabatan untuk menyimpan posisi atau peran
            $table->string('nama'); // Kolom nama untuk menyimpan nama orang dalam jabatan tersebut
            $table->timestamps(); // Kolom created_at dan updated_at
            $table->text('img')->nullable(); // Kolom img untuk menyimpan gambar, bisa null
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('struktur_m');
    }
}
