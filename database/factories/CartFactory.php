<?php

namespace Database\Factories;

use App\Models\{Cart, User};
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'coupon_code' => null,
            'subtotal' => 0.00,
            'tax' => 0.00,
            'shipping' => 0.00,
            'total' => 0.00,
        ];
    }
}
