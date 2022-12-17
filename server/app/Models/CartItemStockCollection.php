<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItemStockCollection extends Model
{
    use HasFactory;

    public function stockCollection()
    {
        return $this->belongsTo(StockCollection::class, "stock_collection_id");
    }

    public function cartItem()
    {
        return $this->belongsTo(CartItem::class, "cart_item_id");
    }
}
