<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Dashboards\CustomerDashboardController;
use App\Http\Controllers\Dashboards\SellerDashboardController;
use App\Http\Controllers\Dashboards\AdminDashboardController;
use App\Http\Controllers\Dashboards\RiderDashboardController;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Admin/super_admin always go to admin dashboard
        if ($user->hasRole('admin') || $user->hasRole('super_admin')) {
            return app(AdminDashboardController::class)->index();
        }

        if ($user->hasRole('rider')) {
            return app(RiderDashboardController::class)->index();
        }

        // For users with both customer+seller roles, use session active_role
        $activeRole = session('active_role');

        if ($activeRole === 'seller' && ($user->hasRole('seller') || $user->hasRole('vendor'))) {
            return redirect()->route('seller.dashboard');
        }

        if ($activeRole === 'customer' && $user->hasRole('customer')) {
            return app(CustomerDashboardController::class)->index();
        }

        // Fallback: no session set, use primary role
        if ($user->hasRole('seller') || $user->hasRole('vendor')) {
            return redirect()->route('seller.dashboard');
        }

        if ($user->hasRole('customer')) {
            return app(CustomerDashboardController::class)->index();
        }

        $query = Product::with(['category', 'brand', 'images'])->where('status', 'active');

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

        return Inertia::render('dashboard', compact('products', 'categories', 'brands', 'filters'));
    }
}
