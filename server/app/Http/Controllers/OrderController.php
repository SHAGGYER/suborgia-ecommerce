<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function getOrder(Request $request, $id)
    {
        $order = Order::with("items.product", "items.properties.fields")->where("uuid", $id)->first();

        return response()->json(["content" => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        $order->status = $request->status;
        $order->save();

        if ($request->has("sendMail")) {
            Mail::to($order->email)->send(new \App\Mail\OrderUpdated($order));
        }

        return response()->json(["content" => $order]);
    }

    public function search(Request $request)
    {
        $orders = Order::with("items.product", "items.properties.fields");
        $orders = $this->handleAdditionalQuery($request, $orders);
        $orders = $this->handleOrderByQuery($request, $orders);
        $orders = $orders->paginate(15);

        return response()->json(["content" => $orders]);
    }

    public static function createImpl(array $orderData, Cart $cart): Order
    {
        $order = new Order();
        $order->status = "pending";
        $order->uuid = Str::random(10);
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

        foreach ($cart->items as $cartItem) {
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
