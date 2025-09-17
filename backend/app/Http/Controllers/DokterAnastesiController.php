<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterAnastesi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterAnastesiController extends Controller
{
    public function index()
    {
        $dokteranastesi_m = DokterAnastesi::all();
        return response()->json($dokteranastesi_m);
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

        $dokteranastesi_m = DokterAnastesi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokteranastesi_m, 201);
    }

    public function destroy($id)
    {
        $dokteranastesi = DokterAnastesi::find($id);

        if (!$dokteranastesi) {
            return response()->json(['message' => 'dokteranastesi tidak ditemukan'], 404);
        }

        if ($dokteranastesi->img && Storage::disk('public')->exists($dokteranastesi->img)) {
            Storage::disk('public')->delete($dokteranastesi->img);
        }

        $dokteranastesi->delete();

        return response()->json(['message' => 'dokteranastesi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokteranastesi
     */
    public function update(Request $request, $id)
    {
        $dokteranastesi = DokterAnastesi::find($id);

        if (!$dokteranastesi) {
            return response()->json(['message' => 'dokteranastesi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokteranastesi->img && Storage::disk('public')->exists($dokteranastesi->img)) {
                Storage::disk('public')->delete($dokteranastesi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokteranastesi->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokteranastesi->img2 && Storage::disk('public')->exists($dokteranastesi->img2)) {
                Storage::disk('public')->delete($dokteranastesi->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokteranastesi->img2 = $imagePath;
        }

        $dokteranastesi->title = $request->title;
        $dokteranastesi->content = $request->content;
        $dokteranastesi->save();

        return response()->json($dokteranastesi, 200);
    }
}
