<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\SellerProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerDashboardController extends Controller
{
    public function dashboard()
    {
        $sellerId = auth()->id();
        $paid = ['paid', 'shipped', 'delivered'];

        $stats = [
            'total_products'  => Product::where('vendor_id', $sellerId)->count(),
            'total_orders'    => Order::where('vendor_id', $sellerId)->count(),
            'pending_orders'  => Order::where('vendor_id', $sellerId)->where('status', 'pending')->count(),
            'total_revenue'   => (float) Order::where('vendor_id', $sellerId)->whereIn('status', $paid)->sum('total'),
            'low_stock'       => Product::where('vendor_id', $sellerId)->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count(),
            'avg_rating'      => (float) Review::whereHas('product', fn($q) => $q->where('vendor_id', $sellerId))->avg('rating'),
        ];

        $recentOrders = Order::where('vendor_id', $sellerId)
            ->with(['user:id,name', 'items'])
            ->latest()->limit(5)->get();

        $monthlySales = collect(range(5, 0))->map(function ($i) use ($paid, $sellerId) {
            $date = Carbon::now()->subMonths($i);
            return [
                'month'  => $date->format('M'),
                'sales'  => (float) Order::where('vendor_id', $sellerId)
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->whereIn('status', $paid)->sum('total'),
            ];
        });

        return Inertia::render('Seller/Dashboard', compact('stats', 'recentOrders', 'monthlySales'));
    }

    // ─── Inventory ────────────────────────────────────────────────────────────
    public function inventory(Request $request)
    {
        $products = Product::where('vendor_id', auth()->id())
            ->with([
                'category:id,name',
                'images' => fn($q) => $q->where('is_primary', true)->select('id', 'product_id', 'image_path'),
            ])
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%$s%"))
            ->when($request->filter === 'low_stock', fn($q) => $q->whereColumn('stock_quantity', '<=', 'low_stock_threshold'))
            ->when($request->filter === 'out_of_stock', fn($q) => $q->where('stock_quantity', 0))
            ->latest()->paginate(20)->withQueryString();

        return Inertia::render('Seller/Inventory/Index', compact('products'));
    }

    public function updateStock(Request $request, Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);

        $request->validate([
            'stock_quantity'      => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'reason'              => 'nullable|string|max:255',
        ]);

        $old = $product->stock_quantity;
        $product->update($request->only('stock_quantity', 'low_stock_threshold'));

        InventoryLog::create([
            'product_id'      => $product->id,
            'quantity_change' => $request->stock_quantity - $old,
            'reason'          => $request->reason ?? 'manual_adjustment',
            'reference_id'    => null,
        ]);

        return back()->with('success', 'Stock updated.');
    }

    public function inventoryLogs(Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);

        $logs = InventoryLog::where('product_id', $product->id)->latest()->paginate(20);

        return Inertia::render('Seller/Inventory/Logs', compact('product', 'logs'));
    }

    // ─── Reviews ──────────────────────────────────────────────────────────────
    public function reviews(Request $request)
    {
        $reviews = Review::whereHas('product', fn($q) => $q->where('vendor_id', auth()->id()))
            ->with(['product:id,name', 'user:id,name'])
            ->when($request->rating, fn($q, $r) => $q->where('rating', $r))
            ->latest()->paginate(15)->withQueryString();

        $stats = [
            'avg'   => (float) Review::whereHas('product', fn($q) => $q->where('vendor_id', auth()->id()))->avg('rating'),
            'total' => Review::whereHas('product', fn($q) => $q->where('vendor_id', auth()->id()))->count(),
        ];

        return Inertia::render('Seller/Reviews/Index', compact('reviews', 'stats'));
    }

    // ─── Promotions (Coupons) ─────────────────────────────────────────────────
    public function promotions()
    {
        $coupons = Coupon::where('vendor_id', auth()->id())->latest()->paginate(15);
        return Inertia::render('Seller/Promotions/Index', compact('coupons'));
    }

    public function createPromotion()
    {
        $products = Product::where('vendor_id', auth()->id())->select('id', 'name')->get();
        return Inertia::render('Seller/Promotions/Create', compact('products'));
    }

    public function storePromotion(Request $request)
    {
        $validated = $request->validate([
            'code'       => 'required|string|max:50|unique:coupons,code',
            'type'       => 'required|in:percentage,fixed',
            'value'      => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_to'   => 'required|date|after:valid_from',
            'usage_limit'=> 'nullable|integer|min:1',
            'active'     => 'boolean',
        ]);

        $validated['vendor_id'] = auth()->id();
        Coupon::create($validated);

        return redirect()->route('seller.promotions.index')->with('success', 'Promotion created.');
    }

    public function editPromotion(Coupon $coupon)
    {
        abort_if($coupon->vendor_id !== auth()->id(), 403);
        $products = Product::where('vendor_id', auth()->id())->select('id', 'name')->get();
        return Inertia::render('Seller/Promotions/Edit', compact('coupon', 'products'));
    }

    public function updatePromotion(Request $request, Coupon $coupon)
    {
        abort_if($coupon->vendor_id !== auth()->id(), 403);

        $validated = $request->validate([
            'code'       => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type'       => 'required|in:percentage,fixed',
            'value'      => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_to'   => 'required|date|after:valid_from',
            'usage_limit'=> 'nullable|integer|min:1',
            'active'     => 'boolean',
        ]);

        $coupon->update($validated);

        return redirect()->route('seller.promotions.index')->with('success', 'Promotion updated.');
    }

    public function togglePromotion(Coupon $coupon)
    {
        abort_if($coupon->vendor_id !== auth()->id(), 403);
        $coupon->update(['active' => !$coupon->active]);
        return back();
    }

    public function destroyPromotion(Coupon $coupon)
    {
        abort_if($coupon->vendor_id !== auth()->id(), 403);
        $coupon->delete();
        return back()->with('success', 'Promotion deleted.');
    }

    // ─── Profile ──────────────────────────────────────────────────────────────
    public function profile()
    {
        $profile = SellerProfile::firstOrCreate(
            ['user_id' => auth()->id()],
            ['store_name' => auth()->user()->name . "'s Store"]
        );

        return Inertia::render('Seller/Profile/Index', compact('profile'));
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'store_name'        => 'required|string|max:255',
            'store_description' => 'nullable|string|max:1000',
        ]);

        SellerProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );

        return back()->with('success', 'Profile updated.');
    }

    // ─── Returns ──────────────────────────────────────────────────────────────
    public function returns(Request $request)
    {
        $orders = Order::where('vendor_id', auth()->id())
            ->whereIn('status', ['return_requested', 'returned', 'refunded'])
            ->with(['user:id,name,email', 'items.product:id,name'])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render('Seller/Returns/Index', compact('orders'));
    }

    public function processReturn(Request $request, Order $order)
    {
        abort_if($order->vendor_id !== auth()->id(), 403);

        $request->validate(['action' => 'required|in:approve,reject']);

        $order->update([
            'status' => $request->action === 'approve' ? 'refunded' : 'return_rejected',
        ]);

        return back()->with('success', 'Return ' . $request->action . 'd.');
    }

    // ─── Performance ──────────────────────────────────────────────────────────
    public function performance()
    {
        $sellerId = auth()->id();
        $paid = ['paid', 'shipped', 'delivered'];

        $monthly = collect(range(5, 0))->map(function ($i) use ($paid, $sellerId) {
            $date = Carbon::now()->subMonths($i);
            return [
                'month'   => $date->format('M Y'),
                'revenue' => (float) Order::where('vendor_id', $sellerId)
                    ->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)
                    ->whereIn('status', $paid)->sum('total'),
                'orders'  => Order::where('vendor_id', $sellerId)
                    ->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->count(),
            ];
        });

        $topProducts = Product::where('vendor_id', $sellerId)
            ->withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->limit(5)->get(['id', 'name', 'price', 'stock_quantity']);

        $ratings = Review::whereHas('product', fn($q) => $q->where('vendor_id', $sellerId))
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')->get()->keyBy('rating');

        return Inertia::render('Seller/Performance/Index', compact('monthly', 'topProducts', 'ratings'));
    }
}
