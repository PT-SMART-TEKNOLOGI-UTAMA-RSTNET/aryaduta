<?php

namespace App\Models\Room;

use App\Models\User;
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

    public function createdBy(){
        return $this->belongsTo(User::class,'created_by','id');
    }

    public function updatedBy(){
        return $this->belongsTo(User::class,'updated_by','id');
    }
}
