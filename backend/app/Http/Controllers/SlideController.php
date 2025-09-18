<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slide;
use Illuminate\Support\Facades\Storage;

class SlideController extends Controller
{
    public function index()
    {
        return response()->json(Slide::orderBy('id', 'desc')->get()); // ✅ terbaru -> lama
    }

    public function store(Request $request)
    {
        $request->validate([
            'img' => 'required|image|mimes:jpeg,jpg,png,bmp,gif',
            'caption' => 'nullable|string'
        ]);

        $path = $request->file('img')->store('slides', 'public');

        $slide = Slide::create([
            'img' => $path,
            'caption' => $request->caption,
        ]);

        return response()->json($slide, 201);
    }

    public function update(Request $request, $id)
    {
        $slide = Slide::findOrFail($id);

        if ($request->hasFile('img')) {
            Storage::disk('public')->delete($slide->img);
            $path = $request->file('img')->store('slides', 'public');
            $slide->img = $path;
        }

        $slide->caption = $request->caption;
        $slide->save();

        return response()->json($slide);
    }

    public function destroy($id)
    {
        $slide = Slide::findOrFail($id);
        Storage::disk('public')->delete($slide->img);
        $slide->delete();

        return response()->json(['message' => 'Slide deleted']);
    }
}
