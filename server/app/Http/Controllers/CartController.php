<?php

namespace App\Http\Controllers;

use App\Mail\OrderCreated;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CartItemProperty;
use App\Models\CartItemStockCollection;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\PropertyField;
use App\Models\StockCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Stripe\StripeClient;

class CartController extends Controller
{
    public function verifyCoupon(Request $request)
    {
        $coupon = Coupon::whereCode($request->code)->first();

        if (!$coupon) {
            return response()->json([
                'error' => "Invalid coupon code"
            ], 400);
        }

        return [
            "content" => [
                'coupon' => $coupon,
            ]
        ];
    }

    public function create(Request $request)
    {
        $cart = null;

        if ($request->cartId) {
            $cart = Cart::find($request->cartId);
            if (!$cart) {
                $cart = new Cart();
                $cart->save();
            }
        } else {
            $cart = new Cart();
            $cart->save();
        }

        $cartItem = new CartItem();
        $cartItem->cart_id = $cart->id;
        $cartItem->product_id = $request->item["productId"];
        $cartItem->quantity = $request->item["quantity"];
        $cartItem->price = $request->item["price"];
        $cartItem->total = $request->item["quantity"] * $request->item["price"];
        $cartItem->save();

        if (isset($request->item["stockCollectionId"])) {
            $cartItemStockCollection = new CartItemStockCollection();
            $cartItemStockCollection->cart_item_id = $cartItem->id;
            $cartItemStockCollection->stock_collection_id = $request->item["stockCollectionId"];
            $cartItemStockCollection->quantity = $request->item["quantity"];
            $cartItemStockCollection->save();
        }

        if (isset($request->item["properties"]) && count($request->item["properties"]) > 0) {
            foreach ($request->item["properties"] as $property => $value) {
                $cartItemProperty = new CartItemProperty();
                $cartItemProperty->cart_item_id = $cartItem->id;
                $cartItemProperty->property_id = $property;
                $cartItemProperty->value = $value;
                $cartItemProperty->save();
            }
        }

        return [
            "content" => [
                'cartId' => $cart->id,
                'items' => $cart->items,
            ]
        ];
    }

    public function getCart(Request $request, $id)
    {
        $cart = Cart::with("items.product.images", "items.properties.property.fields")->whereId($id)->first();

        $outOfStockProducts = $this->checkStock($cart);

        return [
            "content" => [
                'cart' => $cart,
                "stock" => $outOfStockProducts,
            ]
        ];
    }

    public function removeCartItem(Request $request, $id)
    {
        $cartItem = CartItem::find($id);

        foreach ($cartItem->properties as $property) {
            $property->delete();
        }

        $cartItem->delete();
        $outOfStockProducts = $this->checkStock($cartItem->cart);


        return [
            "content" => [
                'cartId' => $cartItem->cart_id,
                'items' => Cart::with("items.product.images", "items.properties.property")->whereId($cartItem->cart_id)->first()->items,
                "stock" => $outOfStockProducts,
            ]
        ];
    }

    private function checkStock($cart)
    {
        if (!$cart) {
            return [];
        }

        $outOfStockProductIds = [];
        $outOfStockProductNames = [];
        $possibleOutOfStockCartItems = [];
        $possibleOutOfStockFields = [];

        foreach ($cart->items as $item) {
            if ($item->product->stock <= 0) {
                $outOfStockProductIds[] = $item->product->id;
                $outOfStockProductNames[] = $item->product->name;
            }

            if (isset($possibleOutOfStockCartItems[$item->product->id])) {
                $possibleOutOfStockCartItems[$item->product->id] += $item->quantity;
            } else {
                $possibleOutOfStockCartItems[$item->product->id] = $item->quantity;
            }

            foreach ($item->properties as $property) {
                foreach ($property->property->fields as $field) {
                    if ($property->value == $field->name) {
                        if (isset($possibleOutOfStockFields[$field->id])) {
                            $possibleOutOfStockFields[$field->id] += $item->quantity;
                        } else {
                            $possibleOutOfStockFields[$field->id] = $item->quantity;
                        }
                    }
                }
            }
        }

        foreach ($possibleOutOfStockCartItems as $productId => $quantity) {
            $stockCollection = StockCollection::where("product_id", $productId)->first();
            if ($stockCollection && $stockCollection->stock < $quantity) {
                $outOfStockProductIds[] = $stockCollection->product->id;
                $outOfStockProductNames[] = $stockCollection->product->name;
            }
        }

        foreach ($possibleOutOfStockFields as $fieldId => $quantity) {
            $field = PropertyField::find($fieldId);
            if (
                $field->stock !==
                null && $field->stock < $quantity
            ) {
                $outOfStockProductIds[] = $field->property->product->id;
                $outOfStockProductNames[] = $field->property->product->name;
            }
        }

        return [
            "ids" => $outOfStockProductIds,
            "names" => $outOfStockProductNames,
        ];
    }

    public function updateCart(Request $request, $id)
    {


        foreach ($request->items as $item) {
            $cartItem = CartItem::find($item['id']);

            $cartItemStockCollection = CartItemStockCollection::where("cart_item_id", $item['id'])->first();
            if (
                !empty($cartItemStockCollection)
                && $cartItemStockCollection->stockCollection->stock < $item['quantity']
            ) {
                return response()->json([
                    'error' => "The following product is out of stock: " . $cartItem->product->name
                ], 400);
            }

            if ($item["quantity"] <= 0) {
                $cartItem->delete();
                continue;
            }

            $cartItem->quantity = $item['quantity'];
            $cartItem->total = $item['quantity'] * $item['price'];
            $cartItem->save();
        }

        $cart = Cart::find($id);

        $stock = $this->checkStock($cart);
        if (count($stock["ids"]) > 0) {
            return [
                "content" => [
                    'cartId' => $cart->id,
                    "stock" => $stock,
                    'items' => Cart::with("items.product.images", "items.properties.property")->whereId($id)->first()->items,
                ]
            ];
        }


        return [
            "content" => [
                'cartId' => $cart->id,
                "stock" => $stock,
                'items' => Cart::with("items.product.images", "items.properties.property")->whereId($id)->first()->items,
            ]
        ];
    }

    public function pay(Request $request)
    {
        $stripe = new StripeClient(
            env('STRIPE_SECRET')
        );

        $cart = Cart::find($request->cartId);
        if (!$cart) {
            return response()->json([
                'error' => "Cart not found. Contact support."
            ], 400);
        }

        $stock = $this->checkStock($cart);
        if (count($stock["ids"]) > 0) {
            return response()->json([
                'error' => "The following products are out of stock: " . implode(", ", $stock["names"])
            ], 400);
        }

        foreach ($cart->items as $item) {
            if ($item->cartItemStockCollection) {
                $item->cartItemStockCollection->stockCollection->decrement('stock', $item->quantity);
                $item->cartItemStockCollection->delete();
            }

            // Decrement stock for product property fields

            foreach ($item->properties as $property) {
                foreach ($property->property->fields as $field) {
                    if ($field->stock !== null) {
                        $field->decrement('stock', $item->quantity);
                    }
                }
            }

            $item->delete();
        }

        try {
            $stripe->charges->create([
                'amount' => $request->orderData["total"] * 100,
                'currency' => "usd",
                'source' => $request->source["id"],
            ]);

            $order = OrderController::createImpl($request->orderData, $cart);
            $order = Order::with("items.product")->whereId($order->id)->first();
            Mail::to($request->orderData["email"])->send(new OrderCreated($order));




            $cart->delete();

            foreach ($order->items as $item) {
                $item->product->stock -= $item->quantity;
                $item->product->save();
            }

            return [
                "content" => [
                    'order' => $order,
                ]
            ];
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
