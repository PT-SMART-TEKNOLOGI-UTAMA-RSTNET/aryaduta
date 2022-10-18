<?php

namespace App\Models\Room;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'price_min' => 'double', 'price' => 'double', 'maintenance' => 'boolean', 'cleaning' => 'boolean'
    ];
}
