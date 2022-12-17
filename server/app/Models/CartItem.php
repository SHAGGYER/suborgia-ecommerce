<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
        'total',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function properties()
    {
        return $this->hasMany(CartItemProperty::class);
    }

    public function cartItemStockCollection()
    {
        return $this->hasOne(CartItemStockCollection::class, "cart_item_id");
    }
}
