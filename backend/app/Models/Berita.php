<?php

/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    use HasFactory;

    // Nama tabel sesuai database
    protected $table = 'berita_m';

    // Tentukan kolom yang bisa diisi secara massal
    protected $fillable = [
        'img', 'title', 'content',
    ];
}
