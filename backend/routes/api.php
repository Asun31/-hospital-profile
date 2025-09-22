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
use App\Http\Controllers\ArtikelController; 
use App\Http\Controllers\SosmedController; 
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PenghargaanController;
use App\Http\Controllers\DaftarDokterController;
use App\Http\Controllers\JadwalDokterController;
use App\Http\Controllers\SpesialisController;
use App\Http\Controllers\DireksiController;
use App\Http\Controllers\DokterAnakController;
use App\Http\Controllers\DokterAnastesiController;
use App\Http\Controllers\DokterBedahController;
use App\Http\Controllers\DokterGigiController;
use App\Http\Controllers\DokterGiziController;
use App\Http\Controllers\DokterObgynController;
use App\Http\Controllers\DokterPenyakitDalamController;
use App\Http\Controllers\DokterRadiologiController;
use App\Http\Controllers\DokterRehabilitasiController;
use App\Http\Controllers\DokterSarafController;
use App\Http\Controllers\DokterThtController;
use App\Http\Controllers\DokterUmumController;
use App\Http\Controllers\SlideController;
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

// ------------------- direksi -------------------
Route::get('/direksi', [DireksiController::class, 'index']);  
Route::post('/direksi', [DireksiController::class, 'store']); 
Route::put('/direksi/{id}', [DireksiController::class, 'update']); // ✅ Tambah update
Route::delete('/direksi/{id}', [DireksiController::class, 'destroy']); 
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
Route::get('/berita/{id}', [BeritaController::class, 'show']);
Route::post('/berita', [BeritaController::class, 'store']); 
Route::put('/berita/{id}', [BeritaController::class, 'update']); // ✅ Tambah update
Route::delete('/berita/{id}', [BeritaController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Artikel -------------------
Route::get('/artikel', [ArtikelController::class, 'index']);  
Route::get('/artikel/{id}', [ArtikelController::class, 'show']);
Route::post('/artikel', [ArtikelController::class, 'store']); 
Route::put('/artikel/{id}', [ArtikelController::class, 'update']); // ✅ Tambah update
Route::delete('/artikel/{id}', [ArtikelController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Sosmed -------------------
Route::get('/sosmed', [SosmedController::class, 'index']);  
Route::get('/sosmed/{id}', [SosmedController::class, 'show']);
Route::post('/sosmed', [SosmedController::class, 'store']); 
Route::put('/sosmed/{id}', [SosmedController::class, 'update']); // ✅ Tambah update
Route::delete('/sosmed/{id}', [SosmedController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Pengumuman -------------------
Route::get('/pengumuman', [PengumumanController::class, 'index']);  
Route::get('/berpengumumanita/{id}', [PengumumanController::class, 'show']);
Route::post('/pengumuman', [PengumumanController::class, 'store']); 
Route::put('/pengumuman/{id}', [PengumumanController::class, 'update']); // ✅ Tambah update
Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- Penghargaan -------------------
Route::get('/penghargaan', [PenghargaanController::class, 'index']);  
Route::get('/penghargaan/{id}', [PenghargaanController::class, 'show']);
Route::post('/penghargaan', [PenghargaanController::class, 'store']); 
Route::put('/penghargaan/{id}', [PenghargaanController::class, 'update']); // ✅ Tambah update
Route::delete('/penghargaan/{id}', [PenghargaanController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- dokteranak -------------------
Route::get('/dokteranak', [DokterAnakController::class, 'index']);  
Route::post('/dokteranak', [DokterAnakController::class, 'store']); 
Route::put('/dokteranak/{id}', [DokterAnakController::class, 'update']); // ✅ Tambah update
Route::delete('/dokteranak/{id}', [DokterAnakController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- dokteranastesi -------------------
Route::get('/dokteranastesi', [DokterAnastesiController::class, 'index']);  
Route::post('/dokteranastesi', [DokterAnastesiController::class, 'store']); 
Route::put('/dokteranastesi/{id}', [DokterAnastesiController::class, 'update']); // ✅ Tambah update
Route::delete('/dokteranastesi/{id}', [DokterAnastesiController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- dokterbedah -------------------
Route::get('/dokterbedah', [DokterBedahController::class, 'index']);  
Route::post('/dokterbedah', [DokterBedahController::class, 'store']); 
Route::put('/dokterbedah/{id}', [DokterBedahController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterbedah/{id}', [DokterBedahController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- doktergigi -------------------
Route::get('/doktergigi', [DokterGigiController::class, 'index']);  
Route::post('/doktergigi', [DokterGigiController::class, 'store']); 
Route::put('/doktergigi/{id}', [DokterGigiController::class, 'update']); // ✅ Tambah update
Route::delete('/doktergigi/{id}', [DokterGigiController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- doktergizi -------------------
Route::get('/doktergizi', [DokterGiziController::class, 'index']);  
Route::post('/doktergizi', [DokterGiziController::class, 'store']); 
Route::put('/doktergizi/{id}', [DokterGiziController::class, 'update']); // ✅ Tambah update
Route::delete('/doktergizi/{id}', [DokterGiziController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- dokterobgyn -------------------
Route::get('/dokterobgyn', [DokterObgynController::class, 'index']);  
Route::post('/dokterobgyn', [DokterObgynController::class, 'store']); 
Route::put('/dokterobgyn/{id}', [DokterObgynController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterobgyn/{id}', [DokterObgynController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- dokterpenyakitdalam -------------------
Route::get('/dokterpenyakitdalam', [DokterPenyakitDalamController::class, 'index']);  
Route::post('/dokterpenyakitdalam', [DokterPenyakitDalamController::class, 'store']); 
Route::put('/dokterpenyakitdalam/{id}', [DokterPenyakitDalamController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterpenyakitdalam/{id}', [DokterODokterPenyakitDalamControllerbgynController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ------------------- dokterradiologi -------------------
Route::get('/dokterradiologi', [DokterRadiologiController::class, 'index']);  
Route::post('/dokterradiologi', [DokterRadiologiController::class, 'store']); 
Route::put('/dokterradiologi/{id}', [DokterRadiologiController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterradiologi/{id}', [DokterRadiologiController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ------------------- dokterrehabilitasi -------------------
Route::get('/dokterrehabilitasi', [DokterRehabilitasiController::class, 'index']);  
Route::post('/dokterrehabilitasi', [DokterRehabilitasiController::class, 'store']); 
Route::put('/dokterrehabilitasi/{id}', [DokterRehabilitasiController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterrehabilitasi/{id}', [DokterRehabilitasiController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ------------------- doktersaraf -------------------
Route::get('/doktersaraf', [DokterSarafController::class, 'index']);  
Route::post('/doktersaraf', [DokterSarafController::class, 'store']); 
Route::put('/doktersaraf/{id}', [DokterSarafController::class, 'update']); // ✅ Tambah update
Route::delete('/doktersaraf/{id}', [DokterSarafController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ------------------- doktertht -------------------
Route::get('/doktertht', [DokterThtController::class, 'index']);  
Route::post('/doktertht', [DokterThtController::class, 'store']); 
Route::put('/doktertht/{id}', [DokterThtController::class, 'update']); // ✅ Tambah update
Route::delete('/doktertht/{id}', [DokterThtController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ------------------- dokterumum -------------------
Route::get('/dokterumum', [DokterUmumController::class, 'index']);  
Route::post('/dokterumum', [DokterUmumController::class, 'store']); 
Route::put('/dokterumum/{id}', [DokterUmumController::class, 'update']); // ✅ Tambah update
Route::delete('/dokterumum/{id}', [DokterUmumController::class, 'destroy']); 
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

// ------------------- spesialis -------------------
Route::get('/spesialis', [SpesialisController::class, 'index']);  
Route::post('/spesialis', [SpesialisController::class, 'store']); 
Route::put('/spesialis/{id}', [SpesialisController::class, 'update']); // ✅ Tambah update
Route::delete('/spesialis/{id}', [SpesialisController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------- slides -------------------
Route::get('/slides', [SlideController::class, 'index']);  
Route::post('/slides', [SlideController::class, 'store']); 
Route::put('/slides/{id}', [SlideController::class, 'update']); // ✅ Tambah update
Route::delete('/slides/{id}', [SlideController::class, 'destroy']); 
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});