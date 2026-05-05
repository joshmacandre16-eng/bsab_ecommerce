<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RiderSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $riders = [
            [
                'user' => [
                    'name'     => 'Juan Dela Cruz',
                    'email'    => 'rider1@bsab.com',
                    'password' => bcrypt('password'),
                    'role'     => 'rider',
                ],
                'profile' => [
                    'vehicle_type'   => 'Motorcycle',
                    'license_number' => 'N01-23-456789',
                ],
            ],
            [
                'user' => [
                    'name'     => 'Pedro Santos',
                    'email'    => 'rider2@bsab.com',
                    'password' => bcrypt('password'),
                    'role'     => 'rider',
                ],
                'profile' => [
                    'vehicle_type'   => 'Bicycle',
                    'license_number' => 'N02-34-567890',
                ],
            ],
        ];

        foreach ($riders as $data) {
            $user = User::firstOrCreate(['email' => $data['user']['email']], $data['user']);
            $user->assignRole('rider');
            $user->riderProfile()->firstOrCreate([], $data['profile']);
        }
    }
}
