<?php

namespace Database\Factories;

use App\Models\{User, SellerProfile};
use Illuminate\Database\Eloquent\Factories\Factory;

class SellerProfileFactory extends Factory
{
    protected $model = SellerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'store_name' => $this->faker->company(),
            'store_description' => $this->faker->paragraph(),
            'store_logo' => null,
            'commission_rate' => 0.10,
            'balance' => 0.00,
            'payout_details' => [],
        ];
    }
}
