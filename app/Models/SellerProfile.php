<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    use HasFactory;

    protected $table = 'vendor_profiles';

    protected $fillable = [
        'user_id',
        'store_name',
        'store_description',
        'store_logo',
        'commission_rate',
        'balance',
        'payout_details',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'balance' => 'decimal:2',
        'payout_details' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
