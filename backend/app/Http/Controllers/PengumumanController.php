<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PengumumanController extends Controller
{
    public function index()
    {
        $pengumuman_m = Pengumuman::all();
        return response()->json($pengumuman_m);
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

        $pengumuman_m = Pengumuman::create([
            'img' => $imagePath,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($pengumuman_m, 201);
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::find($id);

        if (!$pengumuman) {
            return response()->json(['message' => 'Pengumuman tidak ditemukan'], 404);
        }

        if ($pengumuman->img && Storage::disk('public')->exists($pengumuman->img)) {
            Storage::disk('public')->delete($pengumuman->img);
        }

        $pengumuman->delete();

        return response()->json(['message' => 'Pengumuman berhasil dihapus'], 200);
    }
}
