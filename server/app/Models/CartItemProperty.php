<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItemProperty extends Model
{
    use HasFactory;

    public function cartItem()
    {
        return $this->belongsTo(CartItem::class);
    }

    public function property()
    {
        return $this->belongsTo(ProductProperty::class);
    }
}
