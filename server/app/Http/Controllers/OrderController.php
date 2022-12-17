<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function update(Request $request, Order $order)
    {
        $order->status = $request->status;
        $order->save();

        return response()->json(["content" => $order]);
    }

    public function search(Request $request)
    {
        $orders = Order::with("items.products", "items.properties.fields")->paginate(15);

        return response()->json(["content" => $orders]);
    }

    public static function createImpl(array $orderData, Collection $cartItems): Order
    {
        $order = new Order();
        $order->subtotal = $orderData["subtotal"];
        $order->tax = $orderData["tax"];
        $order->total = $orderData["total"];
        $order->name = $orderData["name"];
        $order->email = $orderData["email"];
        $order->address = $orderData["address"];
        $order->city = $orderData["city"];
        $order->zip = $orderData["zip"];
        $order->country = $orderData["country"];
        $order->discount = $orderData["discount"] ?? null;
        $order->save();

        foreach ($cartItems as $cartItem) {
            $orderItem = new OrderItem();
            $orderItem->product_id = $cartItem->product->id;
            $orderItem->quantity = $cartItem->quantity;
            $orderItem->price = $cartItem->price;
            $orderItem->total = $cartItem->total;
            $orderItem->order_id = $order->id;
            $orderItem->save();
        }

        return $order;
    }
}
