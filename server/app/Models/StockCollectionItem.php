<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockCollectionItem extends Model
{
    use HasFactory;

    public function field()
    {
        return $this->belongsTo(PropertyField::class, "field_id");
    }
}
