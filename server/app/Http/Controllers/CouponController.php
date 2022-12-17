<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function deleteCouponsWithIds(Request $request)
    {
        Coupon::whereIn('id', $request->ids)->delete();

        return [
            "content" => "OK"
        ];
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
}
