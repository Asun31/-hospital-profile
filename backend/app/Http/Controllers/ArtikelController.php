<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtikelController extends Controller
{
    public function index()
    {
        $artikel_m = Artikel::all();
        return response()->json($artikel_m);
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

        $artikel_m = Artikel::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($artikel_m, 201);
    }

    public function destroy($id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json(['message' => 'artikel tidak ditemukan'], 404);
        }

        if ($artikel->img && Storage::disk('public')->exists($artikel->img)) {
            Storage::disk('public')->delete($artikel->img);
        }

        $artikel->delete();

        return response()->json(['message' => 'artikel berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit artikel
     */
    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json(['message' => 'artikel tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($artikel->img && Storage::disk('public')->exists($artikel->img)) {
                Storage::disk('public')->delete($artikel->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $artikel->img = $imagePath;
        }

        $artikel->title = $request->title;
        $artikel->content = $request->content;
        $artikel->save();

        return response()->json($artikel, 200);
    }

    public function show($id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json(['message' => 'artikel tidak ditemukan'], 404);
        }

        return response()->json($artikel);
    }

}
