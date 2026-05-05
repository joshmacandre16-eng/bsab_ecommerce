<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->regexify('[A-Z]{6}[0-9]{4}'),
            'type' => $this->faker->randomElement(['fixed', 'percentage']),
            'value' => $this->faker->randomFloat(2, 5, 50),
            'min_order_amount' => $this->faker->randomFloat(2, 10, 100),
            'usage_limit' => $this->faker->numberBetween(50, 500),
            'used_count' => 0,
            'valid_from' => now(),
            'valid_to' => now()->addYear(),
            'active' => true,
        ];
    }
}
