<?php

namespace App\Http\Controllers\Dashboards;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\SettingsController;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\SellerApplication;
use App\Models\UserVoucher;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $user    = auth()->user();
        $profile = $user->customerProfile;
        $paid    = ['paid', 'shipped', 'delivered'];

        $stats = [
            'totalOrders'   => Order::where('user_id', $user->id)->count(),
            'pendingOrders' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
            'totalSpent'    => (float) Order::where('user_id', $user->id)->whereIn('status', $paid)->sum('total'),
            'loyaltyPoints' => $profile?->loyalty_points ?? 0,
        ];

        $recentOrders = Order::where('user_id', $user->id)
            ->with(['items.product.images'])
            ->latest()
            ->take(5)
            ->get();

        $isApprovedSeller = SellerApplication::where('user_id', $user->id)
            ->where('status', 'approved')
            ->exists();

        $claimedIds = UserVoucher::where('user_id', $user->id)->pluck('coupon_id');

        $availableVouchers = Coupon::where('active', true)
            ->where(fn($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', now()))
            ->where(fn($q) => $q->whereNull('valid_to')->orWhere('valid_to', '>=', now()))
            ->where(fn($q) => $q->whereNull('claim_limit')->orWhereColumn('claimed_count', '<', 'claim_limit'))
            ->whereNotIn('id', $claimedIds)
            ->get(['id', 'code', 'type', 'value', 'min_order_amount', 'valid_to', 'claim_limit', 'claimed_count']);

        return Inertia::render('Dashboards/customer', compact('stats', 'recentOrders', 'isApprovedSeller', 'availableVouchers') + ['settings' => SettingsController::all()]);
    }
}
