<?php

namespace App\Http\Controllers\Dashboards;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Carbon\Carbon;

class SellerDashboardController extends Controller
{
    public function index()
    {
        $user   = auth()->user();
        $seller = $user->sellerProfile;
        $paid   = ['paid', 'shipped', 'delivered'];

        $stats = [
            'todaySales'      => (float) Order::where('vendor_id', $user->id)
                ->whereDate('created_at', Carbon::today())
                ->whereIn('status', $paid)
                ->sum('total'),
            'monthSales'      => (float) Order::where('vendor_id', $user->id)
                ->where('created_at', '>=', Carbon::now()->startOfMonth())
                ->whereIn('status', $paid)
                ->sum('total'),
            'totalOrders'     => Order::where('vendor_id', $user->id)->count(),
            'pendingOrders'   => Order::where('vendor_id', $user->id)->where('status', 'pending')->count(),
            'totalProducts'   => Product::where('vendor_id', $user->id)->count(),
            'lowStock'        => Product::where('vendor_id', $user->id)
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                ->count(),
            'balance'         => (float) ($seller?->balance ?? 0),
        ];

        $recentOrders = Order::where('vendor_id', $user->id)
            ->with(['user:id,name,email', 'items.product:id,name,price'])
            ->latest()
            ->take(8)
            ->get();

        $lowStockProducts = Product::where('vendor_id', $user->id)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->select('id', 'name', 'sku', 'stock_quantity', 'low_stock_threshold')
            ->take(5)
            ->get();

        return Inertia::render('Dashboards/seller', compact('stats', 'recentOrders', 'lowStockProducts'));
    }
}
