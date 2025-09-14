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
    public function index()
    {
        $berita_m = Berita::all();
        return response()->json($berita_m);
    }

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

    public function destroy($id)
    {
        $berita = Berita::find($id);

        if (!$berita) {
            return response()->json(['message' => 'berita tidak ditemukan'], 404);
        }

        if ($berita->img && Storage::disk('public')->exists($berita->img)) {
            Storage::disk('public')->delete($berita->img);
        }

        $berita->delete();

        return response()->json(['message' => 'berita berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit berita
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::find($id);

        if (!$berita) {
            return response()->json(['message' => 'berita tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($berita->img && Storage::disk('public')->exists($berita->img)) {
                Storage::disk('public')->delete($berita->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $berita->img = $imagePath;
        }

        $berita->title = $request->title;
        $berita->content = $request->content;
        $berita->save();

        return response()->json($berita, 200);
    }
}
