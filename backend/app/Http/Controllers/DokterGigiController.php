<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterGigi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterGigiController extends Controller
{
    public function index()
    {
        $doktergigi_m = DokterGigi::all();
        return response()->json($doktergigi_m);
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

        $doktergigi_m = DokterGigi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($doktergigi_m, 201);
    }

    public function destroy($id)
    {
        $doktergigi = DokterGigi::find($id);

        if (!$doktergigi) {
            return response()->json(['message' => 'doktergigi tidak ditemukan'], 404);
        }

        if ($doktergigi->img && Storage::disk('public')->exists($doktergigi->img)) {
            Storage::disk('public')->delete($doktergigi->img);
        }

        $doktergigi->delete();

        return response()->json(['message' => 'doktergigi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit doktergigi
     */
    public function update(Request $request, $id)
    {
        $doktergigi = DokterGigi::find($id);

        if (!$doktergigi) {
            return response()->json(['message' => 'doktergigi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($doktergigi->img && Storage::disk('public')->exists($doktergigi->img)) {
                Storage::disk('public')->delete($doktergigi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $doktergigi->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($doktergigi->img2 && Storage::disk('public')->exists($doktergigi->img2)) {
                Storage::disk('public')->delete($doktergigi->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $doktergigi->img2 = $imagePath;
        }

        $doktergigi->title = $request->title;
        $doktergigi->content = $request->content;
        $doktergigi->save();

        return response()->json($doktergigi, 200);
    }
}
