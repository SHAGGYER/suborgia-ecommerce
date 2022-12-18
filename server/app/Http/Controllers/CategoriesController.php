<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function delete(Request $request, $id)
    {
        $category = Category::find($id);
        $category->delete();
        return response()->json(["content" => "ok"], 204);
    }

    public function getCategories(Request $request)
    {
        $categories = Category::with("brands");

        if ($request->has("search")) {
            $categories = $categories->where("name", "like", "%" . $request->input("search") . "%");
        }

        $categories = $categories->paginate(15);

        return response()->json(["content" => $categories]);
    }

    public function create(Request $request)
    {
        $category = new Category();
        $category->name = $request->input("name");
        $category->save();
        return response()->json(["content" => $category]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        $category->name = $request->input("name");
        $category->save();
        return response()->json(["content" => $category]);
    }
}
