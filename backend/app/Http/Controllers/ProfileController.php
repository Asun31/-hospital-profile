<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // Method untuk mengambil data kartu
    public function index()
    {
        $profiles = Profile::all();  
        return response()->json($profiles);  
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
        $profiles = Profile::create([
            'img' => $imagePath, 
            'title' => $request->title,
            'content' => $request->content,
        ]);

        // Mengembalikan response dengan data kartu yang baru disimpan
        return response()->json($profiles, 201); 
    }
}
