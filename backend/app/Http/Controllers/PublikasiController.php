<?php

namespace App\Http\Controllers;

use App\Models\Publikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublikasiController extends Controller
{
    // Method untuk mengambil data kartu
    public function index()
    {
        $publikasis = Publikasi::all();  
        return response()->json($publikasis);  
    }

    // Method untuk menambah kartu baru
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'img' => 'required|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',  
            'content' => 'required|string', 
        ]);

        // Cek apakah gambar ada dan valid
        if (!$request->hasFile('img') || !$request->file('img')->isValid()) {
            return response()->json(['error' => 'Gambar yang di-upload tidak valid.'], 400);
        }

        // Meng-upload gambar dan menyimpan path-nya
        $imagePath = $request->file('img')->store('images', 'public');  
        // Menyimpan data kartu ke dalam database
        $publikasis = Publikasi::create([
            'img' => $imagePath, 
            'title' => $request->title,
            'content' => $request->content,
        ]);

        // Mengembalikan response dengan data kartu yang baru disimpan
        return response()->json($publikasis, 201); 
    }
}
