<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class ReturnManagementController extends Controller
{
    private array $returnStatuses = ['return_requested', 'return_approved', 'return_rejected', 'refunded'];

    public function index()
    {
        $orders = Order::with(['user:id,name,email', 'seller:id,name'])
            ->whereIn('status', $this->returnStatuses)
            ->latest()
            ->paginate(20);

        $counts = [
            'total'     => Order::whereIn('status', $this->returnStatuses)->count(),
            'requested' => Order::where('status', 'return_requested')->count(),
            'approved'  => Order::where('status', 'return_approved')->count(),
            'refunded'  => Order::where('status', 'refunded')->count(),
        ];

        return Inertia::render('Admin/Returns/Index', compact('orders', 'counts'));
    }
}
