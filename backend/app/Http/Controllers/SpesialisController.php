<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Spesialis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SpesialisController extends Controller
{
    public function index()
    {
        $spesialis_m = Spesialis::all();
        return response()->json($spesialis_m);
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

        $spesialis_m = Spesialis::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($spesialis_m, 201);
    }

    public function destroy($id)
    {
        $spesialis = Spesialis::find($id);

        if (!$spesialis) {
            return response()->json(['message' => 'spesialis tidak ditemukan'], 404);
        }

        if ($spesialis->img && Storage::disk('public')->exists($spesialis->img)) {
            Storage::disk('public')->delete($spesialis->img);
        }

        $spesialis->delete();

        return response()->json(['message' => 'spesialis berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit spesialis
     */
    public function update(Request $request, $id)
    {
        $spesialis = Spesialis::find($id);

        if (!$spesialis) {
            return response()->json(['message' => 'spesialis tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($spesialis->img && Storage::disk('public')->exists($spesialis->img)) {
                Storage::disk('public')->delete($spesialis->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $spesialis->img = $imagePath;
        }

        $spesialis->title = $request->title;
        $spesialis->content = $request->content;
        $spesialis->save();

        return response()->json($spesialis, 200);
    }
}
