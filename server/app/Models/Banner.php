<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        "product_id",
        "file_path"
    ];

    public function product()
    {
        return $this->belongsTo("App\Models\Product");
    }
}
