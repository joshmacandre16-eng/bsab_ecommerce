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

        // For users with both customer+seller roles, use session active_role.
        // Default to customer when no active role is present so the first login lands on buyer view.
        $activeRole = session('active_role', null);

        if ($activeRole === 'seller' && ($user->hasRole('seller') || $user->hasRole('vendor'))) {
            return redirect()->route('seller.dashboard');
        }

        if ($user->hasRole('customer')) {
            if (!$activeRole) {
                session(['active_role' => 'customer']);
            }
            return app(CustomerDashboardController::class)->index();
        }

        // If the user is only a seller/vendor, send them to seller dashboard.
        if ($user->hasRole('seller') || $user->hasRole('vendor')) {
            return redirect()->route('seller.dashboard');
        }

        $input = $request->validate([
            'search'   => 'nullable|string|max:255',
            'category' => 'nullable|integer|exists:categories,id',
            'brand'    => 'nullable|integer|exists:brands,id',
            'sort'     => 'nullable|in:price_low,price_high,name_asc,name_desc,newest',
        ]);

        $query = Product::with(['category', 'brand', 'images'])->where('status', 'active');

        if (!empty($input['search'])) {
            $query->where('name', 'like', '%' . $input['search'] . '%');
        }
        if (!empty($input['category'])) {
            $query->where('category_id', $input['category']);
        }
        if (!empty($input['brand'])) {
            $query->where('brand_id', $input['brand']);
        }
        match ($input['sort'] ?? 'newest') {
            'price_low'  => $query->orderBy('price'),
            'price_high' => $query->orderByDesc('price'),
            'name_asc'   => $query->orderBy('name'),
            'name_desc'  => $query->orderByDesc('name'),
            default      => $query->latest(),
        };

        $products   = $query->paginate(12)->withQueryString();
        $categories = Category::select('id', 'name')->get();
        $brands     = Brand::select('id', 'name')->get();
        $filters    = array_merge(['search' => '', 'category' => '', 'brand' => '', 'sort' => ''], array_filter($input));

        return Inertia::render('dashboard', compact('products', 'categories', 'brands', 'filters'));
    }
}
