<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterSaraf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterSarafController extends Controller
{
    public function index()
    {
        $doktersaraf = DokterSaraf::all();
        return response()->json($doktersaraf);
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

        $doktersaraf = DokterSaraf::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($doktersaraf, 201);
    }

    public function destroy($id)
    {
        $doktersaraf = DokterSaraf::find($id);

        if (!$doktersaraf) {
            return response()->json(['message' => 'doktersaraf tidak ditemukan'], 404);
        }

        if ($doktersaraf->img && Storage::disk('public')->exists($doktersaraf->img)) {
            Storage::disk('public')->delete($doktersaraf->img);
        }

        $doktersaraf->delete();

        return response()->json(['message' => 'doktersaraf berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit doktersaraf
     */
    public function update(Request $request, $id)
    {
        $doktersaraf = DokterSaraf::find($id);

        if (!$doktersaraf) {
            return response()->json(['message' => 'doktersaraf tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($doktersaraf->img && Storage::disk('public')->exists($doktersaraf->img)) {
                Storage::disk('public')->delete($doktersaraf->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $doktersaraf->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($doktersaraf->img2 && Storage::disk('public')->exists($doktersaraf->img2)) {
                Storage::disk('public')->delete($doktersaraf->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $doktersaraf->img2 = $imagePath;
        }

        $doktersaraf->title = $request->title;
        $doktersaraf->content = $request->content;
        $doktersaraf->save();

        return response()->json($doktersaraf, 200);
    }
}
