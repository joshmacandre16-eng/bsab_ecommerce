<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_discount',
        'usage_limit',
        'used_count',
        'claim_limit',
        'claimed_count',
        'valid_from',
        'valid_to',
        'applicable_products',
        'active',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function userVouchers()
    {
        return $this->hasMany(UserVoucher::class);
    }

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'valid_from'           => 'datetime',
        'valid_to'             => 'datetime',
        'active'               => 'boolean',
        'applicable_products'  => 'array',
    ];
}

