<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlashSaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $flashSales = FlashSale::with('creator')->latest()->paginate(20);

        return Inertia::render('Admin/FlashSales/Index', [
            'flashSales' => $flashSales,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/FlashSales/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'applicable_products' => 'nullable|array',
            'applicable_products.*' => 'exists:products,id',
            'active' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['applicable_products'] = $request->applicable_products ?: null;

        FlashSale::create($validated);

        return redirect()->route('admin.flash-sales.index')->with('success', 'Flash sale created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FlashSale $flashSale)
    {
        $flashSale->load('creator');
        $products = $flashSale->getApplicableProducts();

        return Inertia::render('Admin/FlashSales/Show', [
            'flashSale' => array_merge($flashSale->toArray(), ['products' => $products]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FlashSale $flashSale)
    {
        $products = Product::select('id', 'name')->get();

        return Inertia::render('Admin/FlashSales/Edit', [
            'flashSale' => $flashSale,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FlashSale $flashSale)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'applicable_products' => 'nullable|array',
            'applicable_products.*' => 'exists:products,id',
            'active' => 'boolean',
        ]);

        $validated['applicable_products'] = $request->applicable_products ?: null;

        $flashSale->update($validated);

        return redirect()->route('admin.flash-sales.index')->with('success', 'Flash sale updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FlashSale $flashSale)
    {
        $flashSale->delete();

        return redirect()->route('admin.flash-sales.index')->with('success', 'Flash sale deleted successfully.');
    }
}
