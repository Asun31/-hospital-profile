<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Direksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DireksiController extends Controller
{
    public function index()
    {
        $direksi_m = Direksi::all();
        return response()->json($direksi_m);
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

        $direksi_m = Direksi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($direksi_m, 201);
    }

    public function destroy($id)
    {
        $direksi = Direksi::find($id);

        if (!$direksi) {
            return response()->json(['message' => 'direksi tidak ditemukan'], 404);
        }

        if ($direksi->img && Storage::disk('public')->exists($direksi->img)) {
            Storage::disk('public')->delete($direksi->img);
        }

        $direksi->delete();

        return response()->json(['message' => 'direksi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit direksi
     */
    public function update(Request $request, $id)
    {
        $direksi = Direksi::find($id);

        if (!$direksi) {
            return response()->json(['message' => 'direksi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($direksi->img && Storage::disk('public')->exists($direksi->img)) {
                Storage::disk('public')->delete($direksi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $direksi->img = $imagePath;
        }

        $direksi->title = $request->title;
        $direksi->content = $request->content;
        $direksi->save();

        return response()->json($direksi, 200);
    }
}
