<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyField extends Model
{
    use HasFactory;

    public function property()
    {
        return $this->belongsTo(ProductProperty::class);
    }
}
