<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductImage;
use App\Http\Controllers\Admin\SettingsController;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function welcome(Request $request)
    {
        $products = Product::with(['category', 'brand', 'images'])
            ->where('status', 'active')
            ->latest()
            ->take(6)
            ->get();
        $categories = Category::select('id', 'name', 'image')->get();
        $settings = SettingsController::all();
        return Inertia::render('welcome', compact('products', 'categories', 'settings'));
    }

    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'active');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }
        if ($category = $request->get('category')) {
            $query->where('category_id', $category);
        }
        if ($brand = $request->get('brand')) {
            $query->where('brand_id', $brand);
        }
        match ($request->get('sort', 'newest')) {
            'price_low'  => $query->orderBy('price'),
            'price_high' => $query->orderByDesc('price'),
            'name_asc'   => $query->orderBy('name'),
            'name_desc'  => $query->orderByDesc('name'),
            default      => $query->latest(),
        };

        $products   = $query->paginate(12)->withQueryString();
        $categories = Category::select('id', 'name')->get();
        $brands     = Brand::select('id', 'name')->get();
        $filters    = $request->only(['search', 'category', 'brand', 'sort']);

        $view = Auth::user()?->hasRole('customer') ? 'Customer/Products/Index' : 'Shop/AllProducts';

        return Inertia::render($view, compact('products', 'categories', 'brands', 'filters'));
    }

    public function adminIndex(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($cat = $request->get('category')) {
            $query->where('category_id', $cat);
        }
        if ($brand = $request->get('brand')) {
            $query->where('brand_id', $brand);
        }
        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $products   = $query->latest()->paginate(20)->withQueryString();
        $categories = Category::select('id', 'name')->get();
        $brands     = Brand::select('id', 'name')->get();
        $filters    = $request->only(['category', 'brand', 'search']);

        return Inertia::render('Admin/Products/Index', compact('products', 'categories', 'brands', 'filters'));
    }

    public function adminShow(Product $product)
    {
        $product->load(['category', 'brand', 'seller', 'images', 'reviews.user']);
        return Inertia::render('Admin/Products/Show', compact('product'));
    }

    public function show(Product $product)
    {
        $product->load(['category', 'brand', 'seller', 'images', 'reviews.user']);

        $inWishlist = false;
        if ($user = auth()->user()) {
            $user->loadMissing('customerProfile');
            $wishlist = $user->customerProfile?->wishlist ?? [];
            $inWishlist = in_array($product->id, $wishlist);
        }
        $product->in_wishlist = $inWishlist;

        $view = Auth::user()?->hasRole('customer') ? 'Customer/Products/Show' : 'Products/Show';
        return Inertia::render($view, compact('product'));
    }

    public function create()
    {
        if (!Auth::user()?->hasAnyRole(['seller', 'admin', 'super_admin'])) {
            abort(403);
        }

        $categories = Category::select('id', 'name')->get();
        $brands     = Brand::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Create', compact('categories', 'brands'));
    }

    public function store(Request $request)
    {
        if (!Auth::user()?->hasAnyRole(['seller', 'admin', 'super_admin'])) {
            abort(403);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|unique:products',
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'weight'         => 'nullable|numeric|min:0',
            'weight_unit'    => 'nullable|string|in:kg,g,ton,lb,oz',
            'sku'            => 'nullable|string|max:255',
            'category_id'    => 'required|exists:categories,id',
            'brand_id'       => 'required|exists:brands,id',
            'status'         => 'required|in:active,inactive',
            'images.*'       => 'image|max:2048',
        ]);

        $validated['vendor_id'] = Auth::id();
        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        if (Auth::id() !== $product->vendor_id && !Auth::user()?->hasAnyRole(['admin', 'super_admin'])) {
            abort(403);
        }

        $product->load('images');
        $categories = Category::select('id', 'name')->get();
        $brands     = Brand::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Edit', compact('product', 'categories', 'brands'));
    }

    public function update(Request $request, Product $product)
    {
        if (Auth::id() !== $product->vendor_id && !Auth::user()?->hasAnyRole(['admin', 'super_admin'])) {
            abort(403);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|unique:products,slug,' . $product->id,
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'weight'         => 'nullable|numeric|min:0',
            'weight_unit'    => 'nullable|string|in:kg,g,ton,lb,oz',
            'sku'            => 'nullable|string|max:255',
            'category_id'    => 'required|exists:categories,id',
            'brand_id'       => 'required|exists:brands,id',
            'status'         => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 1 && $index === 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }

    public function destroyImage(Product $product, ProductImage $image)
    {
        if ($image->product_id !== $product->id) abort(404);
        $image->delete();
        return back();
    }

    public function destroy(Product $product)
    {
        if (Auth::id() !== $product->vendor_id && !Auth::user()?->hasRole('admin')) {
            abort(403);
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
    }
}
