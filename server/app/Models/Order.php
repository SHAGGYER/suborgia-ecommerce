<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'subtotal',
        'tax',
        'total',
        'name',
        'email',
        'address',
        'city',
        'zip',
        'country',
        'discount',
        "created_at",
        "updated_at"
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
