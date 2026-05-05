<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use App\Models\Brand;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductManagementController extends Controller
{
    public function index()
    {
        $products = Product::where('vendor_id', auth()->id())
            ->with(['category:id,name', 'brand:id,name', 'images' => fn($q) => $q->where('is_primary', true)->select('id', 'product_id', 'image_path')])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total'    => Product::where('vendor_id', auth()->id())->count(),
            'active'   => Product::where('vendor_id', auth()->id())->where('status', 'active')->count(),
            'inactive' => Product::where('vendor_id', auth()->id())->where('status', 'inactive')->count(),
            'lowStock' => Product::where('vendor_id', auth()->id())
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')->count(),
        ];

        return Inertia::render('Seller/Products/Index', compact('products', 'stats'));
    }

    public function create()
    {
        return Inertia::render('Seller/Products/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
        ]);
    }

    public function deleteImage(Product $product, ProductImage $image)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);
        abort_if($image->product_id !== $product->id, 404);

        $image->delete();

        if ($image->is_primary) {
            $product->images()->first()?->update(['is_primary' => true]);
        }

        return back()->with('success', 'Image deleted.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'required|string',
            'price'               => 'required|numeric|min:0',
            'compare_at_price'    => 'nullable|numeric|min:0',
            'cost_per_item'       => 'nullable|numeric|min:0',
            'sku'                 => 'nullable|string|max:100|unique:products,sku',
            'stock_quantity'      => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
            'category_id'         => 'required|exists:categories,id',
            'brand_id'            => 'nullable|exists:brands,id',
            'status'              => 'required|in:active,inactive',
            'images'              => 'nullable|array|max:8',
            'images.*'            => 'image|mimes:jpeg,png,webp,gif|max:2048',
        ]);

        $validated['vendor_id'] = auth()->id();
        $validated['slug']      = Str::slug($validated['name']) . '-' . Str::random(5);

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        InventoryLog::create([
            'product_id'      => $product->id,
            'quantity_change' => $validated['stock_quantity'],
            'reason'          => 'initial_stock',
            'reference_id'    => null,
        ]);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);
        $product->load(['category', 'brand', 'orderItems', 'images']);

        return Inertia::render('Seller/Products/Show', compact('product'));
    }

    public function edit(Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);
        $product->load('images');

        return Inertia::render('Seller/Products/Edit', [
            'product'    => $product,
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'required|string',
            'price'               => 'required|numeric|min:0',
            'compare_at_price'    => 'nullable|numeric|min:0',
            'cost_per_item'       => 'nullable|numeric|min:0',
            'sku'                 => 'nullable|string|max:100|unique:products,sku,' . $product->id,
            'stock_quantity'      => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
            'category_id'         => 'required|exists:categories,id',
            'brand_id'            => 'nullable|exists:brands,id',
            'status'              => 'required|in:active,inactive',
            'images'              => 'nullable|array|max:8',
            'images.*'            => 'image|mimes:jpeg,png,webp,gif|max:2048',
        ]);

        $oldStock = $product->stock_quantity;
        $product->update($validated);

        if ($request->hasFile('images')) {
            $hasExisting = $product->images()->exists();
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => !$hasExisting && $index === 0,
                ]);
            }
        }

        if ((int)$oldStock !== (int)$validated['stock_quantity']) {
            InventoryLog::create([
                'product_id'      => $product->id,
                'quantity_change' => $validated['stock_quantity'] - $oldStock,
                'reason'          => 'adjustment',
                'reference_id'    => null,
            ]);
        }

        return redirect()->route('seller.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        abort_if($product->vendor_id !== auth()->id(), 403);

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted.');
    }
}
