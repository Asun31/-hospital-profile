<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublikasiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route untuk mengambil data kartu dari database
Route::get('/profile', [ProfileController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/profile', [ProfileController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Route untuk mengambil data kartu dari database
Route::get('/publikasi', [PublikasiController::class, 'index']);  
// Route untuk menambah data kartu baru
Route::post('/publikasi', [PublikasiController::class, 'store']); 
// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
