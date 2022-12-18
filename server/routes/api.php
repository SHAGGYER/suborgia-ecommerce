<?php

use App\Events\Message;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannersController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
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

Route::get("/message", function () {
    Message::dispatch("Hello world");
    return true;
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix("auth")->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get("init", "init");
        Route::post("login", "login");
        Route::post("register", "register");
        Route::post("/admin/login", "adminLogin");
        Route::get("/verify-password-reset-code", "verifyPasswordResetCode");
        Route::post("/reset-password", "resetPassword");
        Route::post("/forgot-password", "forgotPassword");
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
        Route::post("/pay", "pay");
        Route::post("/verify-coupon", "verifyCoupon");
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("categories")->group(function () {
        Route::controller(CategoriesController::class)->group(function () {
            Route::get("/", "getCategories");
            Route::post("/", "create");
            Route::delete("/{id}", "delete");
            Route::put("/{id}", "update");
        });
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("users")->group(function () {
        Route::controller(UsersController::class)->group(function () {
            Route::get("/", "search");
            Route::post("/", "create");
            Route::post("/{id}", "update");
            Route::delete("/{id}", "delete");
            Route::post("/password-reset/{id}", "sendPasswordResetToken");
        });
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("brands")->group(function () {
        Route::controller(BrandsController::class)->group(function () {
            Route::get("/", "search");
            Route::post("/", "create");
            Route::put("/{id}", "update");
            Route::delete("/{id}", "delete");
        });
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("products")->group(function () {
        Route::controller(ProductsController::class)->group(function () {
            Route::post("/review", "createReview");
            Route::get("/", "search");
            Route::get("/{id}", "getProduct");
            Route::post("/", "create");
            Route::delete("/{id}", "deleteProduct");
            Route::get("/stock-collections/{id}", "getStockCollections");
            Route::post("/stock-collections/{id}", "updateStockCollection");
            Route::post("/stock-collections", "createStockCollection");
            Route::post("/{id}", "update");

            // todo: update, delete banners
        });
    });
});

Route::prefix("banners")->group(function () {
    Route::controller(BannersController::class)->group(function () {
        Route::post("/", "createBanner");
        Route::get("/random", "getRandomBanners");
        Route::get("/", "search");
        Route::post("/delete", "deleteBannersWithIds");
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("coupons")->group(function () {
        Route::controller(CouponController::class)->group(function () {
            Route::get("/", "search");
            Route::post("/", "create");
            Route::delete("/{id}", "delete");
            Route::put("/{id}", "update");
        });
    });
});

Route::middleware("auth:sanctum")->group(function () {
    Route::prefix("analytics")->group(function () {
        Route::controller(AnalyticsController::class)->group(function () {
            Route::get("/", "getAnalytics");
        });
    });
});

Route::prefix("reviews")->group(function () {
    Route::controller(ReviewsController::class)->group(function () {
        Route::post("/", "create");
        Route::get("/", "search");
    });
});

Route::prefix("orders")->group(function () {
    Route::controller(OrderController::class)->group(function () {
        Route::get("/{id}", "getOrder");
        Route::get("/", "search");

        Route::put("/{id}", "update");
        Route::post("/delete", "deleteOrders");
    });
});
