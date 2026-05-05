<?php

namespace App\Http\Controllers;

use App\Models\{Cart, CartItem, Product};
use App\Models\Address;
use App\Models\UserVoucher;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('items.product.images')->firstWhere('user_id', Auth::id()) ?? new Cart(['user_id' => Auth::id()]);
        if ($cart->exists) {
            $cart->load('items.product.images');
        }
        $addresses = Address::where('user_id', Auth::id())->get();

        $claimedVouchers = UserVoucher::with('coupon')
            ->where('user_id', Auth::id())
            ->where('is_used', false)
            ->get()
            ->filter(fn($uv) => $uv->coupon &&
                $uv->coupon->active &&
                (!$uv->coupon->valid_to || now()->lte($uv->coupon->valid_to))
            )
            ->map(fn($uv) => [
                'id'               => $uv->coupon->id,
                'code'             => $uv->coupon->code,
                'type'             => $uv->coupon->type,
                'value'            => $uv->coupon->value,
                'min_order_amount' => $uv->coupon->min_order_amount,
            ])
            ->values();

        // If the cart has a coupon_code but that voucher is now used, clear it
        if ($cart->exists && $cart->coupon_code) {
            $voucherStillValid = $claimedVouchers->contains('code', $cart->coupon_code);
            if (!$voucherStillValid) {
                $cart->update(['coupon_code' => null, 'discount' => 0]);
                $this->updateCartTotals($cart);
                $cart->refresh();
            }
        }

        return Inertia::render('Cart/Index', compact('cart', 'addresses', 'claimedVouchers') + [
            'gcash' => [
                'qr_image' => Setting::get('gcash_qr_image', ''),
                'number'   => Setting::get('gcash_number', ''),
                'name'     => Setting::get('gcash_name', ''),
            ],
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($request->product_id);
        if ($product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Insufficient stock.');
        }

        $cart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
            ['coupon_code' => null, 'subtotal' => 0, 'total' => 0]
        );

        $cartItem = CartItem::firstOrNew([
            'cart_id'    => $cart->id,
            'product_id' => $product->id,
        ]);
        $newQty = ($cartItem->quantity ?? 0) + $request->quantity;
        if ($product->stock_quantity < $newQty) {
            return back()->with('error', 'Insufficient stock.');
        }
        $cartItem->quantity   = $newQty;
        $cartItem->unit_price = $product->price;
        $cartItem->save();

        $this->updateCartTotals($cart);

        return back()->with('success', 'Product added to cart.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|exists:cart_items,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cartItem = CartItem::findOrFail($request->cart_item_id);
        $product = $cartItem->product;
        if ($product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Insufficient stock.');
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $this->updateCartTotals($cartItem->cart);

        return back()->with('success', 'Cart updated.');
    }

    public function remove($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);
        $cart = $cartItem->cart;
        $cartItem->delete();
        $this->updateCartTotals($cart);

        return back()->with('success', 'Product removed from cart.');
    }

    public function applyCoupon(Request $request)
    {
        $request->validate(['coupon_code' => 'nullable|string']);

        $cart = Cart::where('user_id', Auth::id())->firstOrFail();

        if (empty($request->coupon_code)) {
            $cart->update(['coupon_code' => null]);
            $this->updateCartTotals($cart);
            return back()->with('success', 'Voucher removed.');
        }

        $coupon = \App\Models\Coupon::where('code', $request->coupon_code)->where('active', true)->first();

        if (!$coupon) {
            return back()->with('error', 'Invalid or inactive voucher.');
        }

        $userVoucher = UserVoucher::where('user_id', Auth::id())
            ->where('coupon_id', $coupon->id)
            ->first();

        if (!$userVoucher) {
            return back()->with('error', 'You have not claimed this voucher.');
        }
        if ($userVoucher->is_used) {
            return back()->with('error', 'This voucher has already been used.');
        }
        if ($coupon->valid_to && now()->gt($coupon->valid_to)) {
            return back()->with('error', 'This voucher has expired.');
        }
        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return back()->with('error', 'Voucher usage limit reached.');
        }
        if ($coupon->min_order_amount && $cart->subtotal < $coupon->min_order_amount) {
            return back()->with('error', 'Order does not meet minimum amount for this voucher.');
        }

        $cart->update(['coupon_code' => $coupon->code]);
        $this->updateCartTotals($cart);

        return back()->with('success', 'Voucher applied successfully.');
    }

    private function updateCartTotals($cart)
    {
        $cart->load('items');
        $subtotal = $cart->items->sum(fn($item) => $item->quantity * $item->unit_price);
        $tax      = round($subtotal * 0.08, 2);
        $shipping = $subtotal > 0 ? 5.99 : 0;
        $discount = 0;

        if ($cart->coupon_code) {
            $coupon = \App\Models\Coupon::where('code', $cart->coupon_code)->where('active', true)->first();
            if ($coupon) {
                $discount = $coupon->type === 'percentage'
                    ? round($subtotal * ($coupon->value / 100), 2)
                    : min((float) $coupon->value, $subtotal);
                if ($coupon->max_discount) {
                    $discount = min($discount, (float) $coupon->max_discount);
                }
            }
        }

        $cart->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'shipping' => $shipping,
            'discount' => $discount,
            'total'    => max(0, $subtotal + $tax + $shipping - $discount),
        ]);
    }
}
