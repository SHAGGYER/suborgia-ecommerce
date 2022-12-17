<?php

namespace App\Console\Commands;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Console\Command;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class PopulateOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:populate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Order::truncate();
        OrderItem::truncate();

        for ($j = 0; $j < 200; $j++) {
            $faker = Faker::create();

            // generate an order
            DB::table("orders")->insert([
                "subtotal" => $faker->randomFloat(2, 0, 1000),
                "tax" => $faker->randomFloat(2, 0, 1000),
                "total" => $faker->randomFloat(2, 0, 1000),
                "name" => $faker->name,
                "email" => $faker->email,
                "address" => $faker->address,
                "city" => $faker->city,
                "zip" => $faker->postcode,
                "country" => $faker->country,
                "discount" => $faker->randomFloat(2, 0, 1000),
                "status" => $faker->randomElement(["pending", "shipped", "cancelled", "returned"]),
                "created_at" => $faker->dateTimeBetween("-1 week", "now"),
                "updated_at" => $faker->dateTimeBetween("-1 week", "now"),
            ]);

            $order = Order::latest()->first();


            // generate 3 cart items

            $cart = new Cart();
            $cart->save();

            for ($i = 0; $i < 3; $i++) {
                $cartItem = new CartItem();
                $cartItem->cart_id = $cart->id;

                // get a random product
                $product = Product::inRandomOrder()->first();
                $cartItem->product_id = $product->id;
                $cartItem->quantity = $faker->numberBetween(1, 5);
                $cartItem->price = $product->price;
                $cartItem->total = $cartItem->quantity * $cartItem->price;
                $cartItem->save();
            }

            foreach ($cart->items as $cartItem) {
                $orderItem = new OrderItem();
                $orderItem->product_id = $cartItem->product->id;
                $orderItem->quantity = $cartItem->quantity;
                $orderItem->price = $cartItem->price;
                $orderItem->total = $cartItem->total;
                $orderItem->order_id = $order->id;
                $orderItem->save();
            }
        }

        $cart->items->each(function ($item) {
            $item->delete();
        });
        $cart->delete();



        return Command::SUCCESS;
    }
}
