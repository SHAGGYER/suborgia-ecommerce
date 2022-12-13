<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{


    public function getCart(Request $request, $id)
    {
        $cart = Cart::with("items.product")->whereId($id)->first();

        return [
            "content" => [
                'cart' => $cart,
            ]
        ];
    }

    public function create(Request $request)
    {
        $cart = null;

        if ($request->cartId) {
            $cart = Cart::find($request->cartId);
        } else {
            $cart = new Cart();
            $cart->save();
        }

        $cartItem = CartItem::where([
            'cart_id' => $cart->id,
            'product_id' => $request->item['productId'],
        ])->first();

        if ($cartItem) {
            $cartItem->quantity = $cartItem->quantity + $request->item["quantity"];
            $cartItem->total = $request->item["quantity"] * $request->item["price"] + $cartItem->total;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $request->item['productId'],
                'quantity' => $request->item['quantity'],
                'price' => $request->item['price'],
                'total' => $request->item['quantity'] * $request->item['price'],
            ]);
        }

        return [
            "content" => [
                'cartId' => $cart->id,
                'items' => $cart->items,
            ]
        ];
    }

    public function removeCartItem(Request $request, $id)
    {
        $cartItem = CartItem::find($id);
        $cartItem->delete();

        return [
            "content" => [
                'cartId' => $cartItem->cart_id,
                'items' => Cart::with("items.product")->whereId($cartItem->cart_id)->first()->items,
            ]
        ];
    }

    public function updateCart(Request $request, $id)
    {
        $cart = Cart::find($id);

        foreach ($request->items as $item) {
            $cartItem = CartItem::find($item['id']);
            $cartItem->quantity = $item['quantity'];
            $cartItem->total = $item['quantity'] * $item['price'];
            $cartItem->save();
        }

        return [
            "content" => [
                'cartId' => $cart->id,
                'items' => Cart::with("items.product")->whereId($id)->first()->items,
            ]
        ];
    }
}
