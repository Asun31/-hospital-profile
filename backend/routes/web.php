<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

Route::get('/storage/{path}', function ($path) {
    $file = storage_path('app/public/' . $path);

    if (!file_exists($file)) {
        abort(404);
    }

    return Response::file($file, [
        'Access-Control-Allow-Origin' => '*', // izinkan semua origin
    ]);
})->where('path', '.*');

Route::get('/{page?}', function ($page = 'home') {
    $pages = [
        // nama file asli bisa disamarkan
        'beranda'     => 'index.html',
        'sejarah'  => 'sejarah.html',    
    ];

    if (isset($pages[$page])) {
        $file = public_path("frontend/" . $pages[$page]);
        return response()->file($file);
    }

    abort(404);
})->where('page', '.*');

