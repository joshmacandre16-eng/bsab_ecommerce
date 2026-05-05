<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportsController extends Controller
{
    private array $paid = ['paid', 'shipped', 'delivered'];

    public function index()
    {
        $monthly = collect(range(11, 0))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            return [
                'month'   => $date->format('M'),
                'orders'  => Order::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->count(),
                'revenue' => (float) Order::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->whereIn('status', $this->paid)->sum('total'),
            ];
        });

        $topSellers = User::role('seller')
            ->with('sellerProfile:user_id,store_name')
            ->withSum(['orders as total_revenue' => fn($q) => $q->whereIn('status', $this->paid)], 'total')
            ->withCount('orders as total_orders')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get(['id', 'name'])
            ->map(fn($u) => [
                'id'            => $u->id,
                'name'          => $u->name,
                'store_name'    => $u->sellerProfile?->store_name,
                'total_revenue' => (float) ($u->total_revenue ?? 0),
                'total_orders'  => $u->total_orders ?? 0,
            ]);

        $topProducts = Product::withSum(['orderItems as revenue' => fn($q) => $q], 'total_price')
            ->withCount('orderItems as sold')
            ->orderByDesc('sold')
            ->take(5)
            ->get(['id', 'name'])
            ->map(fn($p) => [
                'id'      => $p->id,
                'name'    => $p->name,
                'sold'    => $p->sold ?? 0,
                'revenue' => (float) ($p->revenue ?? 0),
            ]);

        $summary = [
            'total_revenue'   => (float) Order::whereIn('status', $this->paid)->sum('total'),
            'total_orders'    => Order::count(),
            'total_customers' => User::role('customer')->count(),
            'total_sellers'   => User::role('seller')->count(),
        ];

        return Inertia::render('Admin/Reports/Index', compact('monthly', 'topSellers', 'topProducts', 'summary'));
    }
}
