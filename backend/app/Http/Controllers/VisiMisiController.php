<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\VisiMisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VisiMisiController extends Controller
{
    public function index()
    {
        $visimisi_m = VisiMisi::all();
        return response()->json($visimisi_m);
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

        $visimisi_m = VisiMisi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($visimisi_m, 201);
    }

    public function destroy($id)
    {
        $visimisi = VisiMisi::find($id);

        if (!$visimisi) {
            return response()->json(['message' => 'visimisi tidak ditemukan'], 404);
        }

        if ($visimisi->img && Storage::disk('public')->exists($visimisi->img)) {
            Storage::disk('public')->delete($visimisi->img);
        }

        $visimisi->delete();

        return response()->json(['message' => 'visimisi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit visimisi
     */
    public function update(Request $request, $id)
    {
        $visimisi = VisiMisi::find($id);

        if (!$visimisi) {
            return response()->json(['message' => 'visimisi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($visimisi->img && Storage::disk('public')->exists($visimisi->img)) {
                Storage::disk('public')->delete($visimisi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $visimisi->img = $imagePath;
        }

        $visimisi->title = $request->title;
        $visimisi->content = $request->content;
        $visimisi->save();

        return response()->json($visimisi, 200);
    }
}
