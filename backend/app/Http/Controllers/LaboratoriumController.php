<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Laboratorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaboratoriumController extends Controller
{
    public function index()
    {
        $laboratorium_m = Laboratorium::all();
        return response()->json($laboratorium_m);
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

        $laboratorium_m = Laboratorium::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($laboratorium_m, 201);
    }

    public function destroy($id)
    {
        $laboratorium = Laboratorium::find($id);

        if (!$laboratorium) {
            return response()->json(['message' => 'laboratorium tidak ditemukan'], 404);
        }

        if ($laboratorium->img && Storage::disk('public')->exists($laboratorium->img)) {
            Storage::disk('public')->delete($laboratorium->img);
        }

        $laboratorium->delete();

        return response()->json(['message' => 'laboratorium berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit laboratorium
     */
    public function update(Request $request, $id)
    {
        $laboratorium = Laboratorium::find($id);

        if (!$laboratorium) {
            return response()->json(['message' => 'laboratorium tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($laboratorium->img && Storage::disk('public')->exists($laboratorium->img)) {
                Storage::disk('public')->delete($laboratorium->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $laboratorium->img = $imagePath;
        }

        $laboratorium->title = $request->title;
        $laboratorium->content = $request->content;
        $laboratorium->save();

        return response()->json($laboratorium, 200);
    }

    public function show($id)
    {
        $laboratorium = Laboratorium::find($id);

        if (!$laboratorium) {
            return response()->json(['message' => 'laboratorium tidak ditemukan'], 404);
        }

        return response()->json($laboratorium);
    }

}