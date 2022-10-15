<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserPrivilege extends Model
{
    use HasFactory,softDeletes;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'read' => 'boolean', 'create' => 'boolean', 'update' => 'boolean', 'delete' => 'boolean'
    ];
}
