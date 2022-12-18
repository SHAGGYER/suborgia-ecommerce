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
        $product = Product::with("category", "properties.fields", "images", "stockCollections.items.field")->where([
            ["id", "=", $id]
        ])->first();

        // get reviews count
        $product->setAttribute("reviews_count", $product->reviews()->count());

        // get amount of orders in the last 7 days
        $product->setAttribute("orders_count", $product->ordersItems()->where("created_at", ">=", now()->subDays(7))->count());

        return response()->json(["content" => $product]);
    }

    public function getProducts(Request $request)
    {
        $products = Product::with("category", "properties.fields", "images", "stockCollections.items.field");

        if (!empty($request->input("category")) || !empty($request->input("brand"))) {
            $products = $products->whereHas("category", function ($query) use ($request) {
                if (!empty($request->input("category"))) {
                    $query->where("id", $request->input("category"));
                }
                if (!empty($request->input("brand"))) {
                    $query->where("brand_id", $request->input("brand"));
                }
            });
        } else {
            $products = $products->inRandomOrder();
        }

        if (!empty($request->input("max"))) {
            $products = $products->where("price", "<=", $request->input("max"));
        }

        if (!empty($request->input("min"))) {
            $products = $products->where("price", ">=", $request->input("min"));
        }
        $products = $products->paginate(10);
        return response()->json($products);
    }

    public function getBestSellers(Request $request)
    {
        $products = BestSeller::with("product.properties.fields", "product.images")->inRandomOrder()->get()->take(16);

        $products = $products->map(function ($item) {
            return $item->product;
        });

        return response()->json(["content" => $products]);
    }
}
