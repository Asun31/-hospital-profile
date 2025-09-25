<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    SejarahController, StrukturController, VisiMisiController,
    BeritaController, ArtikelController, SosmedController,
    PengumumanController, RawatJalanController, PenghargaanController,
    DaftarDokterController, JadwalDokterController, SpesialisController,
    DireksiController, DokterAnakController, DokterAnastesiController,
    DokterBedahController, DokterGigiController, DokterGiziController,
    DokterObgynController, DokterPenyakitDalamController, DokterRadiologiController,
    DokterRehabilitasiController, DokterSarafController, DokterThtController,
    DokterUmumController, SlideController, RawatInapController, LaboratoriumController,
    RadiologiController
};

// ------------------- User -------------------
Route::middleware('auth:sanctum')->get('/user', fn(Request $request) => $request->user());

// ------------------- API Resources -------------------
// Sederhanakan semua CRUD menggunakan apiResource
Route::apiResources([
    'sejarah' => SejarahController::class,
    'direksi' => DireksiController::class,
    'struktur' => StrukturController::class,
    'visimisi' => VisiMisiController::class,
    'berita' => BeritaController::class,
    'artikel' => ArtikelController::class,
    'sosmed' => SosmedController::class,
    'pengumuman' => PengumumanController::class,
    'rawatjalan' => RawatJalanController::class,
    'rawatinap' => RawatInapController::class,
    'laboratorium' => LaboratoriumController::class,
    'radiologi' => RadiologiController::class,
    'penghargaan' => PenghargaanController::class,
    'dokteranak' => DokterAnakController::class,
    'dokteranastesi' => DokterAnastesiController::class,
    'dokterbedah' => DokterBedahController::class,
    'doktergigi' => DokterGigiController::class,
    'doktergizi' => DokterGiziController::class,
    'dokterobgyn' => DokterObgynController::class,
    'dokterpenyakitdalam' => DokterPenyakitDalamController::class,
    'dokterradiologi' => DokterRadiologiController::class,
    'dokterrehabilitasi' => DokterRehabilitasiController::class,
    'doktersaraf' => DokterSarafController::class,
    'doktertht' => DokterThtController::class,
    'dokterumum' => DokterUmumController::class,
    'daftardokter' => DaftarDokterController::class,
    'jadwaldokter' => JadwalDokterController::class,
    'spesialis' => SpesialisController::class,
    'slides' => SlideController::class,
]);