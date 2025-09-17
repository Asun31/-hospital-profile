<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterRadiologi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterRadiologiController extends Controller
{
    public function index()
    {
        $dokterradiologi = DokterRadiologi::all();
        return response()->json($dokterradiologi);
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

        $dokterradiologi = DokterRadiologi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokterradiologi, 201);
    }

    public function destroy($id)
    {
        $dokterradiologi = DokterRadiologi::find($id);

        if (!$dokterradiologi) {
            return response()->json(['message' => 'dokterradiologi tidak ditemukan'], 404);
        }

        if ($dokterradiologi->img && Storage::disk('public')->exists($dokterradiologi->img)) {
            Storage::disk('public')->delete($dokterradiologi->img);
        }

        $dokterradiologi->delete();

        return response()->json(['message' => 'dokterradiologi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokterradiologi
     */
    public function update(Request $request, $id)
    {
        $dokterradiologi = DokterRadiologi::find($id);

        if (!$dokterradiologi) {
            return response()->json(['message' => 'dokterradiologi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokterradiologi->img && Storage::disk('public')->exists($dokterradiologi->img)) {
                Storage::disk('public')->delete($dokterradiologi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokterradiologi->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokterradiologi->img2 && Storage::disk('public')->exists($dokterradiologi->img2)) {
                Storage::disk('public')->delete($dokterradiologi->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokterradiologi->img2 = $imagePath;
        }

        $dokterradiologi->title = $request->title;
        $dokterradiologi->content = $request->content;
        $dokterradiologi->save();

        return response()->json($dokterradiologi, 200);
    }
}
