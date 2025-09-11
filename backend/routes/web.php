<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

Route::get('/frontend/{file}', function ($file) {
    $path = public_path("frontend/" . $file);

    if (!file_exists($path)) {
        abort(404);
    }

    $ext = pathinfo($path, PATHINFO_EXTENSION);

    $contentType = 'text/plain';
    if ($ext === 'js') {
        $contentType = 'application/javascript; charset=UTF-8';
    } elseif ($ext === 'css') {
        $contentType = 'text/css; charset=UTF-8';
    } elseif ($ext === 'html') {
        $contentType = 'text/html; charset=UTF-8';
    }

    return response(File::get($path), 200)
        ->header('Content-Type', $contentType);
});
