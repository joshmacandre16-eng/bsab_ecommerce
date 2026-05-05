<?php

namespace App\Http\Controllers;

use App\Models\{Cart, CartItem, Order, OrderItem, Product};
use App\Models\UserVoucher;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'shipment', 'paymentTransaction'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', compact('orders'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_id'     => 'required|exists:addresses,id',
            'payment_method' => 'nullable|string',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Cart is empty.');
        }

        $order = null;
        DB::transaction(function () use ($cart, $request, $user, &$order) {
            $order = Order::create([
                'user_id'        => $user->id,
                'order_number'   => 'ORD-' . strtoupper(uniqid()),
                'address_id'     => $request->address_id,
                'subtotal'       => $cart->subtotal,
                'tax'            => $cart->tax ?? 0,
                'shipping'       => $cart->shipping ?? 0,
                'total'          => $cart->total,
                'status'         => 'pending',
                'payment_method' => $request->payment_method ?? 'cod',
            ]);

            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id'    => $order->id,
                    'product_id'  => $cartItem->product_id,
                    'quantity'    => $cartItem->quantity,
                    'unit_price'  => $cartItem->unit_price,
                    'total_price' => $cartItem->quantity * $cartItem->unit_price,
                ]);
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            // Mark voucher as used (one-time use)
            if ($cart->coupon_code) {
                $coupon = Coupon::where('code', $cart->coupon_code)->first();
                if ($coupon) {
                    UserVoucher::where('user_id', $user->id)
                        ->where('coupon_id', $coupon->id)
                        ->update(['is_used' => true]);
                    $coupon->increment('used_count');
                }
            }

            $cart->items()->delete();
            $cart->update(['subtotal' => 0, 'tax' => 0, 'shipping' => 0, 'discount' => 0, 'total' => 0, 'coupon_code' => null]);
        });

        return redirect()->route('customer.orders.show', $order)->with('success', 'Order placed successfully!');
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403);
        }

        $order->load(['items.product', 'shipment', 'paymentTransaction', 'shippingAddress', 'billingAddress']);

        return Inertia::render('Orders/Show', compact('order'));
    }
}
?>

