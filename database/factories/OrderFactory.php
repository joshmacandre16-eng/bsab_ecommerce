<?php

namespace Database\Factories;

use App\Models\{Order, User};
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = \App\Models\Order::class;

    public function definition(): array
    {
        return [
'user_id' => User::factory(),
            'vendor_id' => User::factory()->createQuietly(['role' => 'seller'])
                ->assignRole('seller'),
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'payment_status' => 'pending',
            'payment_method' => $this->faker->randomElement(['card', 'paypal', 'bank_transfer']),
            'payment_transaction_id' => null,
            'coupon_code' => null,
            'shipping_address_id' => null,
            'billing_address_id' => null,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
'subtotal' => $this->faker->randomFloat(2, 20, 500),
            'tax' => $this->faker->randomFloat(2, 2, 50),
            'shipping' => $this->faker->randomFloat(2, 5, 20),
            'discount_amount' => $this->faker->randomFloat(2, 0, 50),
            'total' => $this->faker->randomFloat(2, 30, 600),
            'notes' => $this->faker->sentence(),
        ];
    }
}
