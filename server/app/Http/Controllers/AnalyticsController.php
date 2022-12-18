<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function getAnalytics(Request $request)
    {
        return [
            "sales" => $this->getSales($request),
            "products" => $this->mostBoughtProducts($request),
            "categories" => $this->mostBoughtCategories($request),
        ];
    }

    public function getSales(Request $request)
    {
        // get orders since last week
        $orders = Order::where('created_at', '>=', now()->subWeeks(4))->get();

        if (!$orders->count()) {
            return [
                'labels' => [],
                'values' => [],
                'trend' => 'up',
                "total" => "0"
            ];
        }
        // group orders by day
        $salesByWeek = $orders->groupBy(function ($order) {
            return $order->created_at->format('Y-m-d');
        })->map(function ($orders) {
            return number_format($orders->sum('total'), 0, '', '');
        });

        // sort by date
        $salesByWeek = $salesByWeek->sortKeys();


        // get trending up or down
        $trend = $salesByWeek->last() > $salesByWeek->first() ? 'up' : 'down';



        return [
            'values' => $salesByWeek->values(),
            'labels' => $salesByWeek->keys(),
            "total" => number_format($orders->sum('total'), 0, '.', ','),
            "trend" => $trend
        ];
    }

    public function mostBoughtProducts(Request $request)
    {
        $orders = Order::where('created_at', '>=', now()->subWeeks(4))->get();

        if (!$orders->count()) {
            return [
                'labels' => [],
                'values' => [],
                'trend' => 'up',
                "total" => "0"
            ];
        }

        // get order products
        $products = $orders->map(function ($order) {
            return $order->items->map(function ($item) {
                return [
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'total' => $item->total
                ];
            });
        })->flatten(1);

        // order products by quantity
        $products = $products->groupBy('name')->map(function ($products) {
            return [
                'name' => $products->first()['name'],
                'quantity' => $products->sum('quantity'),
                'total' => $products->sum('total')
            ];
        })->sortByDesc('quantity');

        // take 5

        $products = $products->take(5);

        // get trending up or down
        $trend = $products->last()['total'] > $products->first()['total'] ? 'up' : 'down';

        return [
            'labels' => $products->pluck('name'),
            'values' => $products->pluck('total'),
            'total' => number_format($products->sum('total'), 0, '.', ','),
            'trend' => $trend
        ];
    }

    public function mostBoughtCategories(Request $request)
    {
        // get most bought from categories

        $orders = Order::where('created_at', '>=', now()->subWeeks(4))->get();

        if (!$orders->count()) {
            return [
                'labels' => [],
                'values' => [],
                "total" => "0",
                'trend' => 'up'
            ];
        }

        // get order products
        $products = $orders->map(function ($order) {
            return $order->items->map(function ($item) {
                return [
                    'name' => $item->product->category->name ?? 'No Category',
                    'quantity' => $item->quantity,
                    'total' => $item->total
                ];
            });
        })->flatten(1);

        // take 5
        $products = $products->take(5);

        // get trending up or down
        $trend = $products->last()['total'] > $products->first()['total'] ? 'up' : 'down';

        return [
            'labels' => $products->pluck('name'),
            'values' => $products->pluck('total'),
            'total' => number_format($products->sum('total'), 0, '.', ','),
            'trend' => $trend
        ];
    }
}
