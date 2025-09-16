<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterAnak;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterAnakController extends Controller
{
    public function index()
    {
        $dokteranak_m = DokterAnak::all();
        return response()->json($dokteranak_m);
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

        $dokteranak_m = DokterAnak::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokteranak_m, 201);
    }

    public function destroy($id)
    {
        $dokteranak = DokterAnak::find($id);

        if (!$dokteranak) {
            return response()->json(['message' => 'dokteranak tidak ditemukan'], 404);
        }

        if ($dokteranak->img && Storage::disk('public')->exists($dokteranak->img)) {
            Storage::disk('public')->delete($dokteranak->img);
        }

        $dokteranak->delete();

        return response()->json(['message' => 'dokteranak berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit DokterAnak
     */
    public function update(Request $request, $id)
    {
        $dokteranak = DokterAnak::find($id);

        if (!$dokteranak) {
            return response()->json(['message' => 'dokteranak tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokteranak->img && Storage::disk('public')->exists($dokteranak->img)) {
                Storage::disk('public')->delete($dokteranak->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokteranak->img = $imagePath;
        }

        $dokteranak->title = $request->title;
        $dokteranak->content = $request->content;
        $dokteranak->save();

        return response()->json($dokteranak, 200);
    }
}
