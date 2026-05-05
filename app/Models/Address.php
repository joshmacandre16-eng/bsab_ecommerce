<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'full_name', 'phone',
        'address_line1', 'address_line2', 'city', 'state',
        'postal_code', 'country', 'is_default', 'is_profile_address',
    ];

    protected $casts = [
        'is_default'         => 'boolean',
        'is_profile_address' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

