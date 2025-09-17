<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterBedah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterBedahController extends Controller
{
    public function index()
    {
        $dokterbedah_m = DokterBedah::all();
        return response()->json($dokterbedah_m);
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

        $dokterbedah_m = DokterBedah::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($dokterbedah_m, 201);
    }

    public function destroy($id)
    {
        $dokterbedah = DokterBedah::find($id);

        if (!$dokterbedah) {
            return response()->json(['message' => 'dokterbedah tidak ditemukan'], 404);
        }

        if ($dokterbedah->img && Storage::disk('public')->exists($dokterbedah->img)) {
            Storage::disk('public')->delete($dokterbedah->img);
        }

        $dokterbedah->delete();

        return response()->json(['message' => 'dokterbedah berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit dokterbedah
     */
    public function update(Request $request, $id)
    {
        $dokterbedah = DokterBedah::find($id);

        if (!$dokterbedah) {
            return response()->json(['message' => 'dokterbedah tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($dokterbedah->img && Storage::disk('public')->exists($dokterbedah->img)) {
                Storage::disk('public')->delete($dokterbedah->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $dokterbedah->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($dokterbedah->img2 && Storage::disk('public')->exists($dokterbedah->img2)) {
                Storage::disk('public')->delete($dokterbedah->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $dokterbedah->img2 = $imagePath;
        }

        $dokterbedah->title = $request->title;
        $dokterbedah->content = $request->content;
        $dokterbedah->save();

        return response()->json($dokterbedah, 200);
    }
}
