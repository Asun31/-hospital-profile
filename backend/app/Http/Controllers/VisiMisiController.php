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
            'img' => 'required|image|mimes:jpeg,jpg,png,bmp,gif|max:2048',
            'title' => 'required|string',  
            'content' => 'required|string', 
        ]);

        if (!$request->hasFile('img') || !$request->file('img')->isValid()) {
            return response()->json(['error' => 'Gambar yang di-upload tidak valid.'], 400);
        }

        $imagePath = $request->file('img')->store('images', 'public');  

        $visimisi_m = VisiMisi::create([
            'img' => $imagePath, 
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($visimisi_m, 201); 
    }
}
