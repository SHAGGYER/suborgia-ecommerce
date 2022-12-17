<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockCollection extends Model
{
    use HasFactory;

    public function items()
    {
        return $this->hasMany(StockCollectionItem::class, "collection_id", "id");
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
