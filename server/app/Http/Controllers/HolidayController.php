<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    // create

    public function create(Request $request)
    {
        $request->validate([
            "name" => "required|string",
            "start_date" => "required|date",
            "end_date" => "required|date",
            "discount_percentage" => "required|numeric",
        ]);

        $holiday = new Holiday();
        $holiday->name = $request->name;
        $holiday->start_date = $request->start_date;
        $holiday->end_date = $request->end_date;
        $holiday->discount_percentage = $request->discount_percentage;
        $holiday->accumulative = $request->accumulative;
        $holiday->is_active = $request->is_active;
        $holiday->save();

        return response()->json([
            "content" => $holiday,
        ]);
    }

    // search

    public function search(Request $request)
    {
        $holidays = Holiday::query();

        if ($request->has("search")) {
            $holidays = $holidays->where("name", "like", "%{$request->search}%");
        }

        $holidays = $holidays->paginate(15);

        return response()->json([
            "content" => $holidays,
        ]);
    }

    // update

    public function update(Request $request, $id)
    {
        $request->validate([
            "name" => "required|string",
            "start_date" => "required|date",
            "end_date" => "required|date",
            "discount_percentage" => "required|numeric",
        ]);

        $holiday = Holiday::findOrFail($id);



        $holiday->name = $request->name;
        $holiday->start_date = $request->start_date;
        $holiday->end_date = $request->end_date;
        $holiday->discount_percentage = $request->discount_percentage;
        $holiday->accumulative = $request->accumulative;
        $holiday->is_active = $request->is_active;
        $holiday->save();

        return response()->json([
            "content" => $holiday,
        ]);
    }
}
