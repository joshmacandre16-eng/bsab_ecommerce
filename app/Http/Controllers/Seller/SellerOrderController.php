<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SellerOrderController extends Controller
{
    private function sellerOrderQuery()
    {
        $sellerId = auth()->id();
        return Order::where(function ($q) use ($sellerId) {
            $q->where('vendor_id', $sellerId)
              ->orWhereHas('items.product', fn($p) => $p->where('vendor_id', $sellerId));
        });
    }

    public function index(Request $request)
    {
        $orders = $this->sellerOrderQuery()
            ->with(['user:id,name,email', 'items.product:id,name,price', 'items.product.images'])
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $base = fn() => $this->sellerOrderQuery();
        $statusCounts = [
            'all'       => $base()->count(),
            'pending'   => $base()->where('status', 'pending')->count(),
            'confirmed' => $base()->where('status', 'confirmed')->count(),
            'shipped'   => $base()->where('status', 'shipped')->count(),
            'delivered' => $base()->where('status', 'delivered')->count(),
            'cancelled' => $base()->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Seller/Orders/Index', compact('orders', 'statusCounts'));
    }

    public function show(Order $order)
    {
        $sellerId = auth()->id();
        $hasAccess = $order->vendor_id === $sellerId
            || $order->items()->whereHas('product', fn($p) => $p->where('vendor_id', $sellerId))->exists();
        abort_if(!$hasAccess, 403);
        $order->load(['customer', 'items.product.images', 'address', 'rider.riderProfile']);

        return Inertia::render('Seller/Orders/Show', [
            'order' => array_merge($order->toArray(), [
                'customer'         => $order->customer ? ['name' => $order->customer->name, 'email' => $order->customer->email] : null,
                'shipping_address' => $order->address,
                'shipping_cost'    => $order->shipping,
                'payment_status'   => $order->payment_collected ? 'paid' : 'pending',
                'rider'            => $order->rider ? [
                    'name'         => $order->rider->name,
                    'phone'        => $order->rider->phone,
                    'rider_profile' => $order->rider->riderProfile ? [
                        'vehicle_type'   => $order->rider->riderProfile->vehicle_type,
                        'license_number' => $order->rider->riderProfile->license_number,
                    ] : null,
                ] : null,
            ]),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $sellerId = auth()->id();
        $hasAccess = $order->vendor_id === $sellerId
            || $order->items()->whereHas('product', fn($p) => $p->where('vendor_id', $sellerId))->exists();
        abort_if(!$hasAccess, 403);

        $request->validate([
            'status' => 'required|in:confirmed,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated.');
    }

    public function analytics()
    {
        $paid = ['paid', 'shipped', 'delivered'];
        $sellerId = auth()->id();

        $monthlySales = collect(range(5, 0))->map(function ($i) use ($paid, $sellerId) {
            $date = Carbon::now()->subMonths($i);
            $base = fn() => $this->sellerOrderQuery()
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month);
            return [
                'month'  => $date->format('M Y'),
                'sales'  => (float) $base()->whereIn('status', $paid)->sum('total'),
                'orders' => $base()->count(),
            ];
        });

        return Inertia::render('Seller/Analytics', compact('monthlySales'));
    }

    public function payouts()
    {
        $sellerId = auth()->id();
        $seller   = auth()->user()->sellerProfile;

        $pendingCOD = Order::where('vendor_id', $sellerId)
            ->where('payment_method', 'cod')
            ->where('seller_credited', false)
            ->whereNotIn('status', ['cancelled', 'returned'])
            ->sum('total');

        $recentCredited = Order::where('vendor_id', $sellerId)
            ->where('seller_credited', true)
            ->latest('delivered_at')
            ->take(5)
            ->get(['id', 'order_number', 'total', 'delivered_at', 'payment_method']);

        return Inertia::render('Seller/Payouts', compact('seller', 'pendingCOD', 'recentCredited'));
    }
}
