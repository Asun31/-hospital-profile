<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

Route::get('/storage/{path}', function ($path) {
    $file = storage_path('app/public/' . $path);

    if (!file_exists($file)) {
        abort(404);
    }

    return Response::file($file, [
        'Access-Control-Allow-Origin' => '*', // Izinkan semua origin
    ]);
})->where('path', '.*');
