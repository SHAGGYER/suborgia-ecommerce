<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannersController extends Controller
{
    public function deleteBannersWithIds(Request $request)
    {
        $ids = $request->input("ids");
        Banner::whereIn("id", $ids)->delete();

        return response()->json(["content" => "ok"]);
    }

    public function search(Request $request)
    {
        $banners = Banner::with("product.images", "product.properties.fields")->paginate(15);

        return response()->json(["content" => $banners]);
    }

    public function getRandomBanners(Request $request)
    {
        $banners = Banner::inRandomOrder()->limit($request->input("count"))->get();

        return response()->json(["content" => $banners]);
    }

    public function createBanner(Request $request)
    {
        $banner = new Banner();
        $banner->product_id = $request->product_id;
        $banner->file_path = ProductsController::uploadFile($request->file("file"));
        $banner->save();

        return response()->json(["content" => $banner]);
    }
}
