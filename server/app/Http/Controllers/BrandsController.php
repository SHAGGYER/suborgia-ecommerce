<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandsController extends Controller
{
    // create

    public function create(Request $request)
    {
        $request->validate([
            "category" => "required|integer",
            "name" => "required|string",
        ]);

        $brand = new Brand();
        $brand->category_id = $request->category;
        $brand->name = $request->name;
        $brand->save();

        $brand = Brand::with("category")->find($brand->id);

        return response()->json([
            "content" => $brand,
        ]);
    }

    // search

    public function search(Request $request)
    {
        $brands = Brand::with("category");

        if ($request->has("search")) {
            $brands = $brands->where("name", "like", "%{$request->search}%");
        }

        $brands = $brands->paginate(15);

        return response()->json([
            "content" => $brands,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            "name" => "required|string",
            "category" => "required|integer"
        ]);

        $brand = Brand::find($id);
        $brand->name = $request->name;
        if ($request->has("category")) {
            $brand->category_id = $request->category;
        }
        $brand->save();

        $brand = Brand::with("category")->find($brand->id);

        return response()->json([
            "content" => $brand,
        ]);
    }

    public function delete(Request $request, $id)
    {
        $brand = Brand::find($id);
        $brand->delete();

        return response()->json([
            "content" => "ok",
        ], 204);
    }
}
