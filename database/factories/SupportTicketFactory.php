<?php

namespace Database\Factories;

use App\Models\{SupportTicket, User, Order};
use Illuminate\Database\Eloquent\Factories\Factory;

class SupportTicketFactory extends Factory
{
    protected $model = SupportTicket::class;

    public function definition(): array
    {
        return [
            'customer_id' => User::factory()->createQuietly(['role' => 'customer'])
                ->assignRole('customer'),
            'order_id' => Order::factory(),
            'subject' => $this->faker->sentence(4),
            'message' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['open', 'in_progress', 'resolved', 'closed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'assigned_to' => User::factory()->createQuietly(['role' => 'support_agent'])
                ->assignRole('support_agent'),
        ];
    }
}

