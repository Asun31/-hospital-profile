<?php

/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

namespace App\Http\Controllers;

use App\Models\Penghargaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PenghargaanController extends Controller
{
    public function index()
    {
        $penghargaan_m = Penghargaan::all();
        return response()->json($penghargaan_m);
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

        $penghargaan_m = Penghargaan::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($penghargaan_m, 201);
    }

    public function destroy($id)
    {
        $penghargaan = Penghargaan::find($id);

        if (!$penghargaan) {
            return response()->json(['message' => 'penghargaan tidak ditemukan'], 404);
        }

        if ($penghargaan->img && Storage::disk('public')->exists($penghargaan->img)) {
            Storage::disk('public')->delete($penghargaan->img);
        }

        $penghargaan->delete();

        return response()->json(['message' => 'penghargaan berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit Penghargaan
     */
    public function update(Request $request, $id)
    {
        $penghargaan = Penghargaan::find($id);

        if (!$penghargaan) {
            return response()->json(['message' => 'penghargaan tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($penghargaan->img && Storage::disk('public')->exists($penghargaan->img)) {
                Storage::disk('public')->delete($penghargaan->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $penghargaan->img = $imagePath;
        }

        $penghargaan->title = $request->title;
        $penghargaan->content = $request->content;
        $penghargaan->save();

        return response()->json($penghargaan, 200);
    }
}
