<?php

namespace App\Http\Controllers;

use App\Models\Sosmed;
use Illuminate\Http\Request;

class SosmedController extends Controller
{
    public function index() {
        return response()->json(Sosmed::all());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $sosmed = Sosmed::create($validated);

        return response()->json($sosmed, 201);
    }

    public function show($id) {
        $sosmed = Sosmed::find($id);
        if (!$sosmed) return response()->json(['message'=>'Sosmed tidak ditemukan'],404);
        return response()->json($sosmed);
    }

    public function update(Request $request, $id) {
        $sosmed = Sosmed::find($id);
        if (!$sosmed) return response()->json(['message'=>'Sosmed tidak ditemukan'],404);

        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $sosmed->update($validated);
        return response()->json($sosmed);
    }

    public function destroy($id) {
        $sosmed = Sosmed::find($id);
        if (!$sosmed) return response()->json(['message'=>'Sosmed tidak ditemukan'],404);
        $sosmed->delete();
        return response()->json(['message'=>'Sosmed berhasil dihapus']);
    }
}
