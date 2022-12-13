<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FilterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix("auth")->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get("init", "init");
        Route::post("login", "login");
    });
});

Route::prefix("filters")->group(function () {
    Route::controller(FilterController::class)->group(function () {
        Route::get("/", "getFilters");
        Route::get("categories", "getCategories");
        Route::get("products", "getProducts");
        Route::get("bestSellers", "getBestSellers");

        Route::prefix("products")->group(function () {
            Route::get("{id}", "getProduct");
        });
    });
});

Route::prefix("cart")->group(function () {
    Route::controller(CartController::class)->group(function () {
        Route::post("/", "create");
        Route::get("{id}", "getCart");
        Route::delete("/cart-items/{id}", "removeCartItem");
        Route::put("/{id}", "updateCart");
    });
});
