<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSejarahMTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sejarah_m', function (Blueprint $table) {
            $table->id(); // Kolom id sebagai primary key
            $table->text('title'); // Kolom title untuk menyimpan judul sejarah
            $table->text('content'); // Kolom content untuk menyimpan isi sejarah
            $table->timestamps(); // Kolom created_at dan updated_at
            $table->text('img'); // Kolom img untuk menyimpan informasi gambar
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sejarah_m');
    }
}
