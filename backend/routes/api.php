<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/profile', function () {
    return response()->json([
        ['img' => 'https://via.placeholder.com/300x160', 'title' => 'Visi & Misi', 'content' => 'Visi RSUD Talang Ubi'],
        ['img' => 'https://via.placeholder.com/300x160', 'title' => 'Sejarah', 'content' => 'Sejarah RSUD Talang Ubi']
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
