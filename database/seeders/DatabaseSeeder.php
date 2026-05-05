<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([RolePermissionSeeder::class]);

        // Create admin account
        $admin = User::firstOrCreate(
            ['email' => 'admin@bsab.com'],
            [
                'name'     => 'Admin',
                'password' => bcrypt('password'),
                'is_active'=> true,
            ]
        );
        $admin->syncRoles(['admin']);

        // Sample users
        User::factory(10)->create()->each(function ($user) {
            $user->update(['is_active' => true]);
            $user->assignRole(rand(0, 10) > 7 ? 'seller' : 'customer');
        });
    }
}
