<?php

namespace Database\Factories;

use App\Models\{Order, Shipment};
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    public function definition(): array
    {
        return [
            'order_id' => \App\Models\Order::factory(),
            'tracking_number' => $this->faker->regexify('[A-Z]{2}[0-9]{9}[A-Z]{2}'),
            'carrier' => $this->faker->randomElement(['USPS', 'UPS', 'FedEx', 'DHL']),
            'status' => $this->faker->randomElement(['pending', 'shipped', 'delivered']),
            'shipped_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
