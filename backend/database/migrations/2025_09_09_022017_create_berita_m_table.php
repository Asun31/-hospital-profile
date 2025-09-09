<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBeritaMTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('berita_m', function (Blueprint $table) {
            $table->id(); // Auto-incrementing id
            $table->text('title'); // Kolom title
            $table->text('content'); // Kolom content
            $table->timestamps(); // Kolom created_at dan updated_at
            $table->text('img'); // Kolom img
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('berita_m');
    }
}
