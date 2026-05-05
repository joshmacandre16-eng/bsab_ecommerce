<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SellerProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiderController extends Controller
{
    private function riderOrders(array $statuses)
    {
        return Order::where(function ($q) {
                $q->where('rider_id', auth()->id())
                  ->orWhereNull('rider_id');
            })
            ->whereIn('status', $statuses)
            ->with(['customer', 'address', 'items.product.category'])
            ->latest()
            ->get();
    }

    public function dashboard()
    {
        $user = auth()->user();
        $mine = fn() => Order::where('rider_id', $user->id);
        $today = fn() => Order::where('rider_id', $user->id)->whereDate('updated_at', today());

        $stats = [
            'totalDeliveries'  => $mine()->where('status', 'delivered')->count(),
            'completedToday'   => $today()->where('status', 'delivered')->count(),
            'pendingPickups'   => Order::whereIn('status', ['shipped', 'pending'])->whereNull('rider_id')->count(),
            'activeDeliveries' => $mine()->where('status', 'shipped')->count(),
            'totalEarnings'    => (float) $mine()->where('status', 'delivered')->sum('rider_fee'),
            'todayEarnings'    => (float) $today()->where('status', 'delivered')->sum('rider_fee'),
            'rating'           => 4.8,
            'successRate'      => $this->calcSuccessRate($user->id),
        ];

        $recentDeliveries = Order::where('rider_id', $user->id)
            ->with('customer')
            ->latest()->take(5)->get()
            ->map(fn($o) => array_merge($o->toArray(), [
                'customer_name' => $o->customer?->name ?? 'N/A',
            ]));

        $pendingOrders = Order::whereIn('status', ['shipped', 'pending'])
            ->whereNull('rider_id')
            ->with('customer')
            ->latest()->take(4)->get()
            ->map(fn($o) => array_merge($o->toArray(), [
                'customer_name' => $o->customer?->name ?? 'N/A',
            ]));

        return Inertia::render('Rider/Dashboard', compact('stats', 'recentDeliveries', 'pendingOrders'));
    }

    public function pickup()
    {
        $orders = Order::whereIn('status', ['shipped', 'pending'])
            ->whereNull('rider_id')
            ->with(['customer', 'address', 'items.product'])
            ->latest()->get();
        return Inertia::render('Rider/OrderPickup', compact('orders'));
    }

    public function confirmPickup(Order $order)
    {
        $order->update(['status' => 'shipped', 'rider_id' => auth()->id()]);
        return redirect()->route('rider.pickup')->with('success', 'Order marked as picked up.');
    }

    public function handling()
    {
        $activeOrders = $this->riderOrders(['shipped']);
        return Inertia::render('Rider/OrderHandling', compact('activeOrders'));
    }

    public function updateHandling(Order $order, Request $request)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $request->validate(['status' => 'required|in:shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Status updated.');
    }

    public function navigation()
    {
        $activeDeliveries = $this->riderOrders(['shipped']);
        return Inertia::render('Rider/NavigationDelivery', compact('activeDeliveries'));
    }

    public function markDelivered(Order $order)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $order->update(['status' => 'delivered', 'delivered_at' => now()]);

        // COD: if payment already collected by rider, release funds to seller
        if ($order->payment_method === 'cod' && $order->payment_collected && $order->vendor_id) {
            $this->creditSeller($order);
        }

        return back()->with('success', 'Order marked as delivered.');
    }

    public function appInteraction()
    {
        $orders = Order::where(function ($q) {
                $q->where('rider_id', auth()->id())->orWhereNull('rider_id');
            })
            ->whereNotIn('status', ['cancelled', 'returned'])
            ->with('customer')
            ->latest()->get();
        return Inertia::render('Rider/AppInteraction', compact('orders'));
    }

    public function updateStatus(Order $order, Request $request)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Status updated.');
    }

    public function communication()
    {
        $activeOrders = $this->riderOrders(['picked_up', 'on_the_way']);
        return Inertia::render('Rider/CustomerCommunication', compact('activeOrders'));
    }

    public function payment()
    {
        $user = auth()->user();

        $codOrders = Order::where('rider_id', $user->id)
            ->where('payment_method', 'cod')
            ->whereIn('status', ['shipped', 'delivered'])
            ->with(['customer', 'seller.sellerProfile'])
            ->latest()->get();

        $transferredOrders = Order::where('rider_id', $user->id)
            ->where('payment_method', 'cod')
            ->where('payment_collected', true)
            ->where('seller_credited', true)
            ->with(['customer', 'seller.sellerProfile'])
            ->latest()->take(10)->get();

        $summary = [
            'totalCOD'          => (float) $codOrders->sum('total'),
            'collectedToday'    => (float) Order::where('rider_id', $user->id)
                ->where('payment_method', 'cod')
                ->where('payment_collected', true)
                ->whereDate('updated_at', today())
                ->sum('total'),
            'pendingCollection' => (float) Order::where('rider_id', $user->id)
                ->where('payment_method', 'cod')
                ->where('payment_collected', false)
                ->whereIn('status', ['shipped', 'delivered'])
                ->sum('total'),
            'transferredTotal'  => (float) Order::where('rider_id', $user->id)
                ->where('seller_credited', true)
                ->sum('total'),
        ];

        return Inertia::render('Rider/PaymentHandling', compact('codOrders', 'summary', 'transferredOrders'));
    }

    public function collectPayment(Order $order)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $order->update(['payment_collected' => true]);

        // If already delivered, credit seller immediately
        if ($order->status === 'delivered' && $order->vendor_id) {
            $this->creditSeller($order);
        }

        return back()->with('success', 'Payment marked as collected.');
    }

    private function creditSeller(Order $order): void
    {
        $profile = SellerProfile::firstOrCreate(
            ['user_id' => $order->vendor_id],
            ['store_name' => 'Store', 'commission_rate' => 0.10, 'balance' => 0]
        );

        // Only credit once — check via a seller_credited flag on the order
        if ($order->seller_credited) return;

        $commission = (float) $order->total * (float) $profile->commission_rate;
        $payout     = (float) $order->total - $commission;

        $profile->increment('balance', $payout);
        $order->update(['seller_credited' => true]);
    }

    public function proof()
    {
        $user = auth()->user();
        $deliveredOrders = Order::where('rider_id', $user->id)
            ->where('status', 'delivered')
            ->with('customer')
            ->latest()->get();

        $pendingProof = Order::where('rider_id', $user->id)
            ->where('status', 'delivered')
            ->whereNull('proof_photo')
            ->with('customer')
            ->latest()->get();

        return Inertia::render('Rider/ProofOfDelivery', compact('deliveredOrders', 'pendingProof'));
    }

    public function uploadProof(Order $order, Request $request)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $request->validate(['photo' => 'required|image|max:5120']);
        $path = $request->file('photo')->store('proofs', 'public');
        $order->update(['proof_photo' => $path]);
        return back()->with('success', 'Proof uploaded.');
    }

    public function timeManagement()
    {
        $user = auth()->user();
        $deliveries = Order::where(function ($q) use ($user) {
                $q->where('rider_id', $user->id)->orWhereNull('rider_id');
            })
            ->whereDate('created_at', today())
            ->with('customer')
            ->latest()->get()
            ->map(function ($o) {
                $sla = 60;
                $actual = $o->delivered_at
                    ? (int) $o->created_at->diffInMinutes($o->delivered_at)
                    : null;
                return array_merge($o->toArray(), [
                    'sla_minutes'    => $sla,
                    'actual_minutes' => $actual,
                    'on_time'        => $actual !== null && $actual <= $sla,
                ]);
            });

        $delivered = $deliveries->where('status', 'delivered');
        $stats = [
            'onTimeRate'          => $delivered->count() > 0
                ? round($delivered->where('on_time', true)->count() / $delivered->count() * 100)
                : 0,
            'avgDeliveryMinutes'  => $delivered->count() > 0
                ? (int) $delivered->avg('actual_minutes')
                : 0,
            'totalToday'          => $deliveries->count(),
            'lateDeliveries'      => $delivered->where('on_time', false)->count(),
        ];

        return Inertia::render('Rider/TimeManagement', compact('deliveries', 'stats'));
    }

    public function vehicle()
    {
        $lastChecklist = auth()->user()->rider_checklist ?? [];
        return Inertia::render('Rider/VehicleMaintenance', compact('lastChecklist'));
    }

    public function saveChecklist(Request $request)
    {
        $request->validate(['checklist' => 'required|array']);
        auth()->user()->update(['rider_checklist' => $request->checklist]);
        return back()->with('success', 'Checklist saved.');
    }

    public function compliance()
    {
        $violations = [];
        return Inertia::render('Rider/ComplianceSafety', compact('violations'));
    }

    public function returns()
    {
        $user = auth()->user();
        $returnOrders = Order::where(function ($q) use ($user) {
                $q->where('rider_id', $user->id)->orWhereNull('rider_id');
            })
            ->where('status', 'returned')
            ->with('customer')
            ->latest()->get();

        $failedDeliveries = Order::where(function ($q) use ($user) {
                $q->where('rider_id', $user->id)->orWhereNull('rider_id');
            })
            ->where('status', 'failed')
            ->with('customer')
            ->latest()->get();

        return Inertia::render('Rider/ReturnHandling', compact('returnOrders', 'failedDeliveries'));
    }

    public function submitReturn(Order $order, Request $request)
    {
        abort_unless($order->rider_id === auth()->id(), 403);
        $request->validate(['reason' => 'required|string']);
        $order->update(['status' => 'returned', 'return_reason' => $request->reason]);
        return back()->with('success', 'Return submitted.');
    }

    public function performance()
    {
        $user = auth()->user();
        $allOrders = Order::where('rider_id', $user->id);

        $stats = [
            'totalDeliveries'      => (clone $allOrders)->count(),
            'successfulDeliveries' => (clone $allOrders)->where('status', 'delivered')->count(),
            'failedDeliveries'     => (clone $allOrders)->where('status', 'failed')->count(),
            'returnedOrders'       => (clone $allOrders)->where('status', 'returned')->count(),
            'onTimeRate'           => 85,
            'successRate'          => $this->calcSuccessRate($user->id),
            'avgRating'            => 4.8,
            'totalEarnings'        => (float) (clone $allOrders)->where('status', 'delivered')->sum('rider_fee'),
            'thisWeekEarnings'     => (float) (clone $allOrders)->where('status', 'delivered')->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])->sum('rider_fee'),
            'thisMonthEarnings'    => (float) (clone $allOrders)->where('status', 'delivered')->whereMonth('updated_at', now()->month)->sum('rider_fee'),
        ];

        $weeklyData = collect(range(6, 0))->map(function ($daysAgo) use ($user) {
            $date = now()->subDays($daysAgo);
            return [
                'day'        => $date->format('D'),
                'deliveries' => Order::where('rider_id', $user->id)->where('status', 'delivered')->whereDate('updated_at', $date)->count(),
                'earnings'   => (float) Order::where('rider_id', $user->id)->where('status', 'delivered')->whereDate('updated_at', $date)->sum('rider_fee'),
            ];
        })->values()->toArray();

        $recentFeedback = [];
        $shifts = [];

        return Inertia::render('Rider/Performance', compact('stats', 'weeklyData', 'recentFeedback', 'shifts'));
    }

    private function calcSuccessRate(int $userId): int
    {
        $total = Order::where('rider_id', $userId)->count();
        if ($total === 0) return 100;
        $success = Order::where('rider_id', $userId)->where('status', 'delivered')->count();
        return (int) round(($success / $total) * 100);
    }
}
