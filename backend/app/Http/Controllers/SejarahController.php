<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Sejarah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SejarahController extends Controller
{
    public function index()
    {
        $sejarah_m = Sejarah::all();
        return response()->json($sejarah_m);
    }

    public function store(Request $request)
    {
        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            $imagePath = $request->file('img')->store('images', 'public');
        }

        $sejarah_m = Sejarah::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($sejarah_m, 201);
    }

    public function destroy($id)
    {
        $sejarah = Sejarah::find($id);

        if (!$sejarah) {
            return response()->json(['message' => 'sejarah tidak ditemukan'], 404);
        }

        if ($sejarah->img && Storage::disk('public')->exists($sejarah->img)) {
            Storage::disk('public')->delete($sejarah->img);
        }

        $sejarah->delete();

        return response()->json(['message' => 'sejarah berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit sejarah
     */
    public function update(Request $request, $id)
    {
        $sejarah = Sejarah::find($id);

        if (!$sejarah) {
            return response()->json(['message' => 'sejarah tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($sejarah->img && Storage::disk('public')->exists($sejarah->img)) {
                Storage::disk('public')->delete($sejarah->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $sejarah->img = $imagePath;
        }

        $sejarah->title = $request->title;
        $sejarah->content = $request->content;
        $sejarah->save();

        return response()->json($sejarah, 200);
    }
}
