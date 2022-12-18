<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function delete(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json([
            "message" => "Coupon deleted successfully"
        ], 204);
    }

    public function create(Request $request)
    {
        $coupon = new Coupon();
        $coupon->code = $request->code;
        $coupon->percentage = $request->percentage;
        $coupon->save();

        return [
            "content" => $coupon
        ];
    }

    public function search(Request $request)
    {
        $coupons = Coupon::query();

        if ($request->input("search")) {
            $coupons = $coupons->where('code', 'like', '%' . $request->input("search") . '%')
                ->orWhere('percentage', 'like', '%' . $request->input("search") . '%');
        }

        $coupons = $coupons->paginate(15);

        return [
            "content" => $coupons
        ];
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->code = $request->code;
        $coupon->percentage = $request->percentage;
        $coupon->save();

        return [
            "content" => $coupon
        ];
    }
}
