<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class RiderManagementController extends Controller
{
    public function index()
    {
        $riders = User::role('rider')
            ->with('riderProfile')
            ->latest()
            ->paginate(20);

        $counts = [
            'total'     => User::role('rider')->count(),
            'active'    => User::role('rider')->where('is_active', true)->count(),
            'available' => User::role('rider')->whereHas('riderProfile')->count(),
            'inactive'  => User::role('rider')->where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Riders/Index', compact('riders', 'counts'));
    }
}
