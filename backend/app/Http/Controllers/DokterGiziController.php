<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\DokterGizi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokterGiziController extends Controller
{
    public function index()
    {
        $doktergizi = DokterGizi::all();
        return response()->json($doktergizi);
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

        $doktergizi = DokterGizi::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($doktergizi, 201);
    }

    public function destroy($id)
    {
        $doktergizi = DokterGizi::find($id);

        if (!$doktergizi) {
            return response()->json(['message' => 'doktergizi tidak ditemukan'], 404);
        }

        if ($doktergizi->img && Storage::disk('public')->exists($doktergizi->img)) {
            Storage::disk('public')->delete($doktergizi->img);
        }

        $doktergizi->delete();

        return response()->json(['message' => 'doktergizi berhasil dihapus'], 200);
    }

    /**
     * Tambahan: Update/Edit doktergizi
     */
    public function update(Request $request, $id)
    {
        $doktergizi = DokterGizi::find($id);

        if (!$doktergizi) {
            return response()->json(['message' => 'doktergizi tidak ditemukan'], 404);
        }

        $request->validate([
            'img' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',
            'content' => 'required|string',
            'img2' => 'nullable|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
        ]);

        // Jika ada gambar baru, hapus yang lama dan upload baru
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            if ($doktergizi->img && Storage::disk('public')->exists($doktergizi->img)) {
                Storage::disk('public')->delete($doktergizi->img);
            }
            $imagePath = $request->file('img')->store('images', 'public');
            $doktergizi->img = $imagePath;
        }
        if ($request->hasFile('img2') && $request->file('img2')->isValid()) {
            if ($doktergizi->img2 && Storage::disk('public')->exists($doktergizi->img2)) {
                Storage::disk('public')->delete($doktergizi->img2);
            }
            $imagePath = $request->file('img2')->store('images', 'public');
            $doktergizi->img2 = $imagePath;
        }

        $doktergizi->title = $request->title;
        $doktergizi->content = $request->content;
        $doktergizi->save();

        return response()->json($doktergizi, 200);
    }
}
