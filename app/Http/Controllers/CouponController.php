<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::latest()->paginate(20);

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/Coupons/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'claim_limit' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'applicable_products' => 'nullable|array',
            'applicable_products.*' => 'exists:products,id',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['applicable_products'] = $request->applicable_products ?: null;

        Coupon::create($validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Voucher created successfully.');
    }

    public function edit(Coupon $coupon)
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon,
            'products' => $products,
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'claim_limit' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after:valid_from',
            'applicable_products' => 'nullable|array',
            'applicable_products.*' => 'exists:products,id',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        $validated['applicable_products'] = $request->applicable_products ?: null;

        $coupon->update($validated);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Voucher updated successfully.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Voucher deleted successfully.');
    }
}