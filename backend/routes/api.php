<?php

/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

use App\Http\Controllers\SejarahController;
use App\Http\Controllers\StrukturController;
use App\Http\Controllers\VisiMisiController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PenghargaanController;
use App\Http\Controllers\DaftarDokterController;
use App\Http\Controllers\JadwalDokterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route untuk mengambil data kartu dari database
Route::get('/sejarah', [SejarahController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/sejarah', [SejarahController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route untuk mengambil data kartu dari database
Route::get('/struktur', [StrukturController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/struktur', [StrukturController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route untuk mengambil data kartu dari database
Route::get('/visimisi', [VisiMisiController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/visimisi', [VisiMisiController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route untuk mengambil data kartu dari database
Route::get('/berita', [BeritaController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/berita', [BeritaController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route untuk mengambil data kartu dari database
Route::get('/pengumuman', [PengumumanController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/pengumuman', [PengumumanController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route untuk mengambil data kartu dari database
Route::get('/penghargaan', [PenghargaanController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/penghargaan', [PenghargaanController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route untuk mengambil data kartu dari database
Route::get('/daftardokter', [DaftarDokterController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/daftardokter', [DaftarDokterController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route untuk mengambil data kartu dari database
Route::get('/jadwaldokter', [JadwalDokterController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/jadwaldokter', [JadwalDokterController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
