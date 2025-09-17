<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterRehabilitasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterRehabilitasiController extends Controller
{
    public function index()
    {
        $dokterrehabilitasi = DokterRehabilitasi::all();
        return response()->json($dokterrehabilitasi);
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

        $dokterrehabilitasi = DokterRehabilitasi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokterrehabilitasi, 201);
    }

    public function destroy($id)
    {
        $dokterrehabilitasi = DokterRehabilitasi::find($id);

        if (!$dokterrehabilitasi) {
            return response()->json(['message' => 'dokterrehabilitasi tidak ditemukan'], 404);
        }

        if ($dokterrehabilitasi->img && Storage::disk('public')->exists($dokterrehabilitasi->img)) {
            Storage::disk('public')->delete($dokterrehabilitasi->img);
        }

        $dokterrehabilitasi->delete();

        return response()->json(['message' => 'dokterrehabilitasi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokterrehabilitasi
     */
    public function update(Request $request, $id)
    {
        $dokterrehabilitasi = DokterRehabilitasi::find($id);

        if (!$dokterrehabilitasi) {
            return response()->json(['message' => 'dokterrehabilitasi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokterrehabilitasi->img && Storage::disk('public')->exists($dokterrehabilitasi->img)) {
                Storage::disk('public')->delete($dokterrehabilitasi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokterrehabilitasi->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokterrehabilitasi->img2 && Storage::disk('public')->exists($dokterrehabilitasi->img2)) {
                Storage::disk('public')->delete($dokterrehabilitasi->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokterrehabilitasi->img2 = $imagePath;
        }

        $dokterrehabilitasi->title = $request->title;
        $dokterrehabilitasi->content = $request->content;
        $dokterrehabilitasi->save();

        return response()->json($dokterrehabilitasi, 200);
    }
}
