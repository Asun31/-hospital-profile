<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterObgyn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterObgynController extends Controller
{
    public function index()
    {
        $dokterobgyn = DokterObgyn::all();
        return response()->json($dokterobgyn);
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

        $dokterobgyn = DokterObgyn::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokterobgyn, 201);
    }

    public function destroy($id)
    {
        $dokterobgyn = DokterObgyn::find($id);

        if (!$dokterobgyn) {
            return response()->json(['message' => 'dokterobgyn tidak ditemukan'], 404);
        }

        if ($dokterobgyn->img && Storage::disk('public')->exists($dokterobgyn->img)) {
            Storage::disk('public')->delete($dokterobgyn->img);
        }

        $dokterobgyn->delete();

        return response()->json(['message' => 'dokterobgyn berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokterobgyn
     */
    public function update(Request $request, $id)
    {
        $dokterobgyn = DokterObgyn::find($id);

        if (!$dokterobgyn) {
            return response()->json(['message' => 'dokterobgyn tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokterobgyn->img && Storage::disk('public')->exists($dokterobgyn->img)) {
                Storage::disk('public')->delete($dokterobgyn->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokterobgyn->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokterobgyn->img2 && Storage::disk('public')->exists($dokterobgyn->img2)) {
                Storage::disk('public')->delete($dokterobgyn->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokterobgyn->img2 = $imagePath;
        }

        $dokterobgyn->title = $request->title;
        $dokterobgyn->content = $request->content;
        $dokterobgyn->save();

        return response()->json($dokterobgyn, 200);
    }
}
