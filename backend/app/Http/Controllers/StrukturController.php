<?php

// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */

namespace App\Http\Controllers;

use App\Models\Struktur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StrukturController extends Controller
{
    public function index()
    {
        $struktur_m = Struktur::all();  
        return response()->json($struktur_m);  
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
    
        $struktur_m = Struktur::create([
            'img' => $imagePath, 
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($struktur_m, 201); 
    }
}
