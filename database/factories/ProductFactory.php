<?php

namespace Database\Factories;

use App\Models\{Brand, Category, Product, User};
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'vendor_id' => User::factory(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }
}

