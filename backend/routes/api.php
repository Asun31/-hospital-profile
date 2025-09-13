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

// ------------------- Sejarah -------------------
Route::get('/sejarah', [SejarahController::class, 'index']);  
Route::post('/sejarah', [SejarahController::class, 'store']); 
Route::put('/sejarah/{id}', [SejarahController::class, 'update']); // ✅ Tambah update
Route::delete('/sejarah/{id}', [SejarahController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Struktur -------------------
Route::get('/struktur', [StrukturController::class, 'index']);  
Route::post('/struktur', [StrukturController::class, 'store']); 
Route::put('/struktur/{id}', [StrukturController::class, 'update']); // ✅ Tambah update
Route::delete('/struktur/{id}', [StrukturController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- VisiMisi -------------------
Route::get('/visimisi', [VisiMisiController::class, 'index']);  
Route::post('/visimisi', [VisiMisiController::class, 'store']); 
Route::put('/visimisi/{id}', [VisiMisiController::class, 'update']); // ✅ Tambah update
Route::delete('/visimisi/{id}', [VisiMisiController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Berita -------------------
Route::get('/berita', [BeritaController::class, 'index']);  
Route::post('/berita', [BeritaController::class, 'store']); 
Route::put('/berita/{id}', [BeritaController::class, 'update']); // ✅ Tambah update
Route::delete('/berita/{id}', [BeritaController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Pengumuman -------------------
Route::get('/pengumuman', [PengumumanController::class, 'index']);  
Route::post('/pengumuman', [PengumumanController::class, 'store']); 
Route::put('/pengumuman/{id}', [PengumumanController::class, 'update']); // ✅ Tambah update
Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Penghargaan -------------------
Route::get('/penghargaan', [PenghargaanController::class, 'index']);  
Route::post('/penghargaan', [PenghargaanController::class, 'store']); 
Route::put('/penghargaan/{id}', [PenghargaanController::class, 'update']); // ✅ Tambah update
Route::delete('/penghargaan/{id}', [PenghargaanController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Daftar Dokter -------------------
Route::get('/daftardokter', [DaftarDokterController::class, 'index']);  
Route::post('/daftardokter', [DaftarDokterController::class, 'store']); 
Route::put('/daftardokter/{id}', [DaftarDokterController::class, 'update']); // ✅ Tambah update
Route::delete('/daftardokter/{id}', [DaftarDokterController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Jadwal Dokter -------------------
Route::get('/jadwaldokter', [JadwalDokterController::class, 'index']);  
Route::post('/jadwaldokter', [JadwalDokterController::class, 'store']); 
Route::put('/jadwaldokter/{id}', [JadwalDokterController::class, 'update']); // ✅ Tambah update
Route::delete('/jadwaldokter/{id}', [JadwalDokterController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
