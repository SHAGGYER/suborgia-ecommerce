<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductProperty;
use App\Models\PropertyField;
use App\Models\Review;
use App\Models\StockCollection;
use App\Models\StockCollectionItem;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class ProductsController extends Controller
{
    public function getProduct(Request $request, $id)
    {
        $product = Product::with("category", "brand", "images", "properties.fields", "stockCollections")
            ->where("id", $id)
            ->first();

        return response()->json(["content" => $product]);
    }

    public function search(Request $request)
    {
        $products = Product::with("category", "brand", "images", "properties.fields");

        if ($request->has("search")) {
            $products = $products->where("name", "like", "%" . $request->input("search") . "%");
        }

        $products = $this->handleAdditionalQuery($request, $products);
        $products = $this->handleOrderByQuery($request, $products);

        $products = $products->paginate(15);

        return response()->json(["content" => $products]);
    }

    public function create(Request $request)
    {
        $request->validate([
            "name" => "required",
            "description" => "required",
            "price" => "required",
            "category" => "required",
            "stock" => "required",
        ]);

        $product = $this->createOrUpdateProduct($request, null);
        $this->uploadImages($request->file("images"), $product->id);
        $this->createOrUpdateProperties($request, $product);

        $product = Product::with("category", "brand", "images", "properties.fields", "stockCollections")->whereId($product->id)->first();

        return response()->json(["content" => $product]);
    }

    public function update(Request $request, $id)
    {
        $product = $this->createOrUpdateProduct($request, $id);

        if (null !== $request->file("images") && count($request->file("images"))) {
            $this->uploadImages($request->file("images"), $product->id);
        }
        $this->createOrUpdateProperties($request, $product);

        $product = Product::with("category", "brand", "images", "properties.fields", "stockCollections")->whereId($product->id)->first();

        return response()->json(["content" => $product]);
    }

    public static function uploadFile($file)
    {
        $allowedfileExtension = ['png', 'webp', 'jpg', 'jpeg', 'svg', 'gif'];
        $extension = $file->getClientOriginalExtension();
        $check = in_array($extension, $allowedfileExtension);

        if (!$check) {
            return response()->json(["content" => "Invalid file type"]);
        }

        $fileName = Str::random(16) . '.' . $extension;
        $file->move(public_path('uploads'), $fileName);
        return URL::to('/') . "/uploads/" . $fileName;
    }

    private function uploadImages($images, $productId)
    {
        /* 
        *   Images upload
        */

        $allowedfileExtension = ['png', 'webp', 'jpg', 'jpeg', 'svg', 'gif'];
        $files = $images;
        foreach ($files as $file) {
            $fileName = self::uploadFile($file);

            $dbImage = new ProductImage();
            $dbImage->file_path = $fileName;
            $dbImage->product_id = $productId;
            $dbImage->save();
        }
    }

    private function createOrUpdateProduct(Request $request, $id)
    {
        if ($id != null) {
            $product = Product::find($id);
        } else {
            $product = new Product();
        }

        $product->name = $request->name;
        $product->description = $request->input("description");
        $product->long_description = $request->input("long_description");
        $product->price = $request->input("price");
        $product->category_id = $request->input("category");
        $product->base_price = !empty($request->input("base_price")) ? $request->input("base_price") : null;
        $product->buy_price = !empty($request->input("buy_price")) ? $request->input("buy_price") : null;
        $product->brand_id = !empty($request->input("brand")) ? $request->input("brand") : null;
        $product->stock = $request->input("stock");
        $product->save();

        return $product;
    }

    private function createOrUpdateProperties($request, $product)
    {
        $properties = json_decode($request->input("properties"), true);
        foreach ($properties as $requestProperty) {
            if (isset($requestProperty["id"])) {
                $property = ProductProperty::find($requestProperty["id"]);
            } else {
                $property = new ProductProperty();
            }
            $property->product_id = $product->id;
            $property->name = $requestProperty["name"];
            $property->save();

            foreach ($requestProperty["fields"] as $requestField) {
                if (isset($requestField["id"])) {
                    $field = PropertyField::find($requestField["id"]);
                } else {
                    $field = new PropertyField();
                }

                $field->property_id = $property->id;
                $field->name = $requestField["name"];
                $field->type = $requestField["type"];
                $field->adjusted_price = $requestField["adjusted_price"];
                $field->stock = isset($request["stock"]) && !empty($requestField["stock"]) ? $requestField["stock"] : null;
                $field->save();
            }
        }
    }

    public function deleteProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(["message" => "Product not found"], 404);
        }

        foreach ($product->images as $image) {
            $image->delete();
        }

        foreach ($product->properties as $property) {
            foreach ($property->fields as $field) {
                $field->delete();
            }
            $property->delete();
        }

        $product->delete();
        return response()->json(["content" => "ok"], 204);
    }

    public function updateStockCollection(Request $request, $id)
    {
        $stockCollection = StockCollection::find($id);
        $stockCollection->stock = $request->stock;
        $stockCollection->save();

        return response()->json(["content" => $stockCollection]);
    }

    public function getStockCollections(Request $request, $id)
    {
        $stockCollections = StockCollection::with("items.field")
            ->where("product_id", $id)
            ->get();

        return response()->json(["content" => $stockCollections]);
    }

    public function createStockCollection(Request $request)
    {
        $stockCollection = new StockCollection();
        $stockCollection->product_id = $request->product_id;
        $stockCollection->stock = $request->stock;
        $stockCollection->save();

        foreach ($request->items as $item) {
            $dbItem = new StockCollectionItem();
            $dbItem->collection_id = $stockCollection->id;
            $dbItem->field_id = $item["field_id"];
            $dbItem->save();
        }

        return response()->json(["content" => $stockCollection]);
    }
}
