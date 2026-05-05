<?php

namespace Database\Factories;

use App\Models\{InventoryLog, Product};
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryLogFactory extends Factory
{
    protected $model = InventoryLog::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'quantity_change' => $this->faker->numberBetween(-10, 50),
            'reason' => $this->faker->randomElement(['sale', 'return', 'restock', 'adjustment']),
            'reference_id' => 'REF-' . $this->faker->unique()->numerify('###'),
        ];
    }
}

