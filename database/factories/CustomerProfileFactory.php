<?php

namespace Database\Factories;

use App\Models\{CustomerProfile, User};
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerProfileFactory extends Factory
{
    protected $model = CustomerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->date(),
            'preferences' => $this->faker->sentence(),
        ];
    }
}
