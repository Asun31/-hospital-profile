<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterTht;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterThtController extends Controller
{
    public function index()
    {
        $doktertht = DokterTht::all();
        return response()->json($doktertht);
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

        $doktertht = DokterTht::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($doktertht, 201);
    }

    public function destroy($id)
    {
        $doktertht = DokterTht::find($id);

        if (!$doktertht) {
            return response()->json(['message' => 'doktertht tidak ditemukan'], 404);
        }

        if ($doktertht->img && Storage::disk('public')->exists($doktertht->img)) {
            Storage::disk('public')->delete($doktertht->img);
        }

        $doktertht->delete();

        return response()->json(['message' => 'doktertht berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit doktertht
     */
    public function update(Request $request, $id)
    {
        $doktertht = DokterTht::find($id);

        if (!$doktertht) {
            return response()->json(['message' => 'doktertht tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($doktertht->img && Storage::disk('public')->exists($doktertht->img)) {
                Storage::disk('public')->delete($doktertht->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $doktertht->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($doktertht->img2 && Storage::disk('public')->exists($doktertht->img2)) {
                Storage::disk('public')->delete($doktertht->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $doktertht->img2 = $imagePath;
        }

        $doktertht->title = $request->title;
        $doktertht->content = $request->content;
        $doktertht->save();

        return response()->json($doktertht, 200);
    }
}
