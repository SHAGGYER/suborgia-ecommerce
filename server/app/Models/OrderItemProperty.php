<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItemProperty extends Model
{
    use HasFactory;

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
