<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterPenyakitDalam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterPenyakitDalamController extends Controller
{
    public function index()
    {
        $DokterPenyakitDalam = DokterPenyakitDalam::all();
        return response()->json($DokterPenyakitDalam);
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

        $DokterPenyakitDalam = DokterPenyakitDalam::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($DokterPenyakitDalam, 201);
    }

    public function destroy($id)
    {
        $DokterPenyakitDalam = DokterPenyakitDalam::find($id);

        if (!$DokterPenyakitDalam) {
            return response()->json(['message' => 'DokterPenyakitDalam tidak ditemukan'], 404);
        }

        if ($DokterPenyakitDalam->img && Storage::disk('public')->exists($DokterPenyakitDalam->img)) {
            Storage::disk('public')->delete($DokterPenyakitDalam->img);
        }

        $DokterPenyakitDalam->delete();

        return response()->json(['message' => 'DokterPenyakitDalam berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit DokterPenyakitDalam
     */
    public function update(Request $request, $id)
    {
        $DokterPenyakitDalam = DokterPenyakitDalam::find($id);

        if (!$DokterPenyakitDalam) {
            return response()->json(['message' => 'DokterPenyakitDalam tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($DokterPenyakitDalam->img && Storage::disk('public')->exists($DokterPenyakitDalam->img)) {
                Storage::disk('public')->delete($DokterPenyakitDalam->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $DokterPenyakitDalam->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($DokterPenyakitDalam->img2 && Storage::disk('public')->exists($DokterPenyakitDalam->img2)) {
                Storage::disk('public')->delete($DokterPenyakitDalam->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $DokterPenyakitDalam->img2 = $imagePath;
        }

        $DokterPenyakitDalam->title = $request->title;
        $DokterPenyakitDalam->content = $request->content;
        $DokterPenyakitDalam->save();

        return response()->json($DokterPenyakitDalam, 200);
    }
}
