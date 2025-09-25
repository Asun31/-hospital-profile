<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\RawatInap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RawatInapController extends Controller
{
    public function index()
    {
        $rawatinap_m = RawatInap::all();
        return response()->json($rawatinap_m);
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

        $rawatinap_m = RawatInap::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($rawatinap_m, 201);
    }

    public function destroy($id)
    {
        $rawatinap = RawatInap::find($id);

        if (!$rawatinap) {
            return response()->json(['message' => 'rawatinap tidak ditemukan'], 404);
        }

        if ($rawatinap->img && Storage::disk('public')->exists($rawatinap->img)) {
            Storage::disk('public')->delete($rawatinap->img);
        }

        $rawatinap->delete();

        return response()->json(['message' => 'rawatinap berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit rawatinap
     */
    public function update(Request $request, $id)
    {
        $rawatinap = RawatInap::find($id);

        if (!$rawatinap) {
            return response()->json(['message' => 'rawatinap tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($rawatinap->img && Storage::disk('public')->exists($rawatinap->img)) {
                Storage::disk('public')->delete($rawatinap->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $rawatinap->img = $imagePath;
        }

        $rawatinap->title = $request->title;
        $rawatinap->content = $request->content;
        $rawatinap->save();

        return response()->json($rawatinap, 200);
    }

    public function show($id)
    {
        $rawatinap = RawatInap::find($id);

        if (!$rawatinap) {
            return response()->json(['message' => 'rawatinap tidak ditemukan'], 404);
        }

        return response()->json($rawatinap);
    }

}