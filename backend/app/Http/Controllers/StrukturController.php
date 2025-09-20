<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Struktur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StrukturController extends Controller
{
    public function index()
    {
        $struktur_m = Struktur::all();
        return response()->json($struktur_m);
    }

    public function store(Request $request)
    {
        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            $imagePath = $request->file('img')->store('images', 'public');
        }

        $struktur_m = Struktur::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($struktur_m, 201);
    }

    public function destroy($id)
    {
        $struktur = Struktur::find($id);

        if (!$struktur) {
            return response()->json(['message' => 'struktur tidak ditemukan'], 404);
        }

        if ($struktur->img && Storage::disk('public')->exists($struktur->img)) {
            Storage::disk('public')->delete($struktur->img);
        }

        $struktur->delete();

        return response()->json(['message' => 'struktur berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit struktur
     */
    public function update(Request $request, $id)
    {
        $struktur = Struktur::find($id);

        if (!$struktur) {
            return response()->json(['message' => 'struktur tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($struktur->img && Storage::disk('public')->exists($struktur->img)) {
                Storage::disk('public')->delete($struktur->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $struktur->img = $imagePath;
        }

        $struktur->title = $request->title;
        $struktur->content = $request->content;
        $struktur->save();

        return response()->json($struktur, 200);
    }
}
