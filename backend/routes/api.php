<?php

use App\Http\Controllers\CardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route untuk mengambil data kartu dari database
Route::get('/profile', [CardController::class, 'index']);  

// Route untuk menambah data kartu baru
Route::post('/profile', [CardController::class, 'store']); 

// Route untuk mengambil data user (dengan autentikasi)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
