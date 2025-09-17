<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterUmum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterUmumController extends Controller
{
    public function index()
    {
        $dokterumum = DokterUmum::all();
        return response()->json($dokterumum);
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

        $dokterumum = DokterUmum::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokterumum, 201);
    }

    public function destroy($id)
    {
        $dokterumum = DokterUmum::find($id);

        if (!$dokterumum) {
            return response()->json(['message' => 'dokterumum tidak ditemukan'], 404);
        }

        if ($dokterumum->img && Storage::disk('public')->exists($dokterumum->img)) {
            Storage::disk('public')->delete($dokterumum->img);
        }

        $dokterumum->delete();

        return response()->json(['message' => 'dokterumum berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokterumum
     */
    public function update(Request $request, $id)
    {
        $dokterumum = DokterUmum::find($id);

        if (!$dokterumum) {
            return response()->json(['message' => 'dokterumum tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokterumum->img && Storage::disk('public')->exists($dokterumum->img)) {
                Storage::disk('public')->delete($dokterumum->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokterumum->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokterumum->img2 && Storage::disk('public')->exists($dokterumum->img2)) {
                Storage::disk('public')->delete($dokterumum->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokterumum->img2 = $imagePath;
        }

        $dokterumum->title = $request->title;
        $dokterumum->content = $request->content;
        $dokterumum->save();

        return response()->json($dokterumum, 200);
    }
}
