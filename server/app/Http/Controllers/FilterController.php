<?php

namespace App\Http\Controllers;

use App\Models\BestSeller;
use App\Models\Category;
use App\Models\Filter;
use App\Models\Product;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function getFilters(Request $request)
    {
        $filters = Filter::with("filter")->where([
            ["name", "=", $request->input("filter")]
        ])->get();
        return response()->json($filters);
    }

    public function getCategories(Request $request)
    {
        $categories = Category::with("brands")->get();
        return response()->json($categories);
    }

    public function getProduct(Request $request, $id)
    {
        $product = Product::with("category", "properties.fields")->where([
            ["id", "=", $id]
        ])->first();
        return response()->json(["content" => $product]);
    }

    public function getProducts(Request $request)
    {
        $products = Product::with("category", "properties.fields")
            ->where(function ($query) use ($request) {
                $query->where("category_id", "=", $request->input("category"))
                    ->orWhere("brand_id", "=", $request->input("brand"));
            });

        if (!empty($request->input("max"))) {
            $products = $products->where("price", "<=", $request->input("max"));
        }

        if (!empty($request->input("min"))) {
            $products = $products->where("price", ">=", $request->input("min"));
        }
        $products = $products->get();
        return response()->json($products);
    }

    public function getBestSellers(Request $request)
    {
        $products = BestSeller::with("product.properties.fields")->inRandomOrder()->get()->take(16);

        $products = $products->map(function ($item) {
            return $item->product;
        });

        return response()->json(["content" => $products]);
    }
}
