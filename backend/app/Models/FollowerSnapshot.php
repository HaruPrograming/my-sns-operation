<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FollowerSnapshot extends Model
{
    protected $fillable = ['user_id', 'followers_count', 'recorded_at'];

    protected $casts = ['recorded_at' => 'datetime'];
}
