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
            ->whereHas('riderProfile', fn($q) => $q->where('status', 'approved'))
            ->latest()
            ->paginate(20);

        $pending = User::role('rider')
            ->with('riderProfile')
            ->whereHas('riderProfile', fn($q) => $q->where('status', 'pending'))
            ->latest()
            ->get();

        $counts = [
            'total'     => User::role('rider')->count(),
            'pending'   => $pending->count(),
            'active'    => User::role('rider')->where('is_active', true)->count(),
            'inactive'  => User::role('rider')->where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Riders/Index', compact('riders', 'counts', 'pending'));
    }
}
