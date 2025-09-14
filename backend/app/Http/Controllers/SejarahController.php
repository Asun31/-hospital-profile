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
            'img' => 'required|image|mimes:jpeg,jpg,png,bmp,gif,tiff,heif,raw',
            'title' => 'required|string',  
            'content' => 'required|string', 
        ]);

        if (!$request->hasFile('img') || !$request->file('img')->isValid()) {
            return response()->json(['error' => 'Gambar yang di-upload tidak valid.'], 400);
        }

        $imagePath = $request->file('img')->store('images', 'public');  
        $sejarah_m = Sejarah::create([
            'img' => $imagePath, 
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($sejarah_m, 201); 
    }
}
