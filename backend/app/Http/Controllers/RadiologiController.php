<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Radiologi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RadiologiController extends Controller
{
    public function index()
    {
        $radiologi_m = Radiologi::all();
        return response()->json($radiologi_m);
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

        $radiologi_m = Radiologi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($radiologi_m, 201);
    }

    public function destroy($id)
    {
        $radiologi = Radiologi::find($id);

        if (!$radiologi) {
            return response()->json(['message' => 'radiologi tidak ditemukan'], 404);
        }

        if ($radiologi->img && Storage::disk('public')->exists($radiologi->img)) {
            Storage::disk('public')->delete($radiologi->img);
        }

        $radiologi->delete();

        return response()->json(['message' => 'radiologi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit radiologi
     */
    public function update(Request $request, $id)
    {
        $radiologi = Radiologi::find($id);

        if (!$radiologi) {
            return response()->json(['message' => 'radiologi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($radiologi->img && Storage::disk('public')->exists($radiologi->img)) {
                Storage::disk('public')->delete($radiologi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $radiologi->img = $imagePath;
        }

        $radiologi->title = $request->title;
        $radiologi->content = $request->content;
        $radiologi->save();

        return response()->json($radiologi, 200);
    }

    public function show($id)
    {
        $radiologi = Radiologi::find($id);

        if (!$radiologi) {
            return response()->json(['message' => 'radiologi tidak ditemukan'], 404);
        }

        return response()->json($radiologi);
    }

}