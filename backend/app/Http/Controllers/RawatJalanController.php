<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\RawatJalan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RawatJalanController extends Controller
{
    public function index()
    {
        $rawatjalan_m = RawatJalan::all();
        return response()->json($rawatjalan_m);
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

        $rawatjalan_m = RawatJalan::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($rawatjalan_m, 201);
    }

    public function destroy($id)
    {
        $rawatjalan = RawatJalan::find($id);

        if (!$rawatjalan) {
            return response()->json(['message' => 'rawatjalan tidak ditemukan'], 404);
        }

        if ($rawatjalan->img && Storage::disk('public')->exists($rawatjalan->img)) {
            Storage::disk('public')->delete($rawatjalan->img);
        }

        $rawatjalan->delete();

        return response()->json(['message' => 'rawatjalan berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit rawatjalan
     */
    public function update(Request $request, $id)
    {
        $rawatjalan = RawatJalan::find($id);

        if (!$rawatjalan) {
            return response()->json(['message' => 'rawatjalan tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($rawatjalan->img && Storage::disk('public')->exists($rawatjalan->img)) {
                Storage::disk('public')->delete($rawatjalan->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $rawatjalan->img = $imagePath;
        }

        $rawatjalan->title = $request->title;
        $rawatjalan->content = $request->content;
        $rawatjalan->save();

        return response()->json($rawatjalan, 200);
    }

    public function show($id)
    {
        $rawatjalan = RawatJalan::find($id);

        if (!$rawatjalan) {
            return response()->json(['message' => 'rawatjalan tidak ditemukan'], 404);
        }

        return response()->json($rawatjalan);
    }

}