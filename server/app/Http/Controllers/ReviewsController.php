<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewsController extends Controller
{
    public function search(Request $request)
    {
        $reviews = Review::with("user")->where([
            ["product_id", "=", $request->input("product_id")]
        ]);

        // where rating
        if (!empty($request->input("rating"))) {
            $reviews->where("rating", "=", $request->input("rating"));
        }

        // paginate

        $reviews = $reviews->paginate(15);

        return response()->json(["content" => $reviews]);
    }

    public function create(Request $request)
    {
        $review = new Review();
        $review->product_id = $request->product_id;
        $review->user_id = auth()->guard("sanctum")->id();
        $review->review = $request->review;
        $review->rating = $request->rating;
        $review->save();

        return response()->json(["content" => $review]);
    }
}
