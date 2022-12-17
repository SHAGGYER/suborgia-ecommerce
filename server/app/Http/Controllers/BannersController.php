<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannersController extends Controller
{
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
