<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function handleAdditionalQuery(Request $request, $query)
    {
        if ($request->has("additional_query")) {
            $additionalQuery = json_decode($request->input("additional_query"), true);

            foreach ($additionalQuery as $index => $data) {
                if (isset($data["operator"]) && $data["operator"] == "like") {
                    $data["value"] = "%" . $data["value"] . "%";
                }

                $query = $query->where($data["key"], isset($data["operator"]) ? $data["operator"] : "=", $data["value"]);
            }
        }

        return $query;
    }

    public function handleOrderByQuery(Request $request, $query)
    {
        if ($request->has("order_by")) {
            $query = $query->orderBy($request->input("order_by"), $request->input("order_direction", "asc"));
        }

        return $query;
    }
}
