<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BeritaController extends Controller
{
    // Ambil semua data kartu
    public function index()
    {
        $berita_m = Berita::all();
        return response()->json($berita_m);
    }

    // Tambah kartu baru
    public function store(Request $request)
    {
        $request->validate([
            'img' => 'required|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        if (!$request->hasFile('img') || !$request->file('img')->isValid()) {
            return response()->json(['error' => 'Gambar yang di-upload tidak valid.'], 400);
        }

        $imagePath = $request->file('img')->store('images', 'public');

        $berita_m = Berita::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($berita_m, 201);
    }

    // Hapus kartu berita
    public function destroy($id)
    {
        $berita = Berita::find($id);

        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }

        // Hapus gambar dari storage jika ada
        if ($berita->img && Storage::disk('public')->exists($berita->img)) {
            Storage::disk('public')->delete($berita->img);
        }

        // Hapus data dari database
        $berita->delete();

        return response()->json(['message' => 'Berita berhasil dihapus'], 200);
    }
}
