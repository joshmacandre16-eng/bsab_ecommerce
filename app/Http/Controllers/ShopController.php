<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    private function validateFilters(Request $request): array
    {
        return $request->validate([
            'search'   => 'nullable|string|max:255',
            'category' => 'nullable|integer|exists:categories,id',
            'brand'    => 'nullable|integer|exists:brands,id',
            'sort'     => 'nullable|in:price_low,price_high,name_asc,name_desc,newest',
        ]);
    }

    private function buildQuery(Request $request, array $extraWhere = [])
    {
        $input = $this->validateFilters($request);
        $query = Product::with(['category', 'brand', 'images'])->where('status', 'active');

        foreach ($extraWhere as $col => $val) {
            $query->where($col, $val);
        }

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

        return $query;
    }

    private function shared(Request $request): array
    {
        $input = $this->validateFilters($request);
        return [
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
            'filters'    => array_merge(['search' => '', 'category' => '', 'brand' => '', 'sort' => ''], array_filter($input)),
        ];
    }

    public function allProducts(Request $request)
    {
        $products = $this->buildQuery($request)->paginate(12)->withQueryString();
        return Inertia::render('Shop/AllProducts', array_merge($this->shared($request), compact('products')));
    }

    public function apparel(Request $request)
    {
        $query = $this->buildQuery($request);
        $allowedSubs = ['polo' => 'polo', 'tshirt' => 't-shirt', 'gown' => 'gown', 'accessories' => ['cap', 'accessory']];
        $sub = $request->validate(['sub' => 'nullable|in:polo,tshirt,gown,accessories'])['sub'] ?? null;
        if ($sub) {
            $kw = $allowedSubs[$sub];
            if (is_array($kw)) {
                $query->where(function ($q) use ($kw) {
                    foreach ($kw as $k) $q->orWhere('name', 'like', '%' . $k . '%');
                });
            } else {
                $query->where('name', 'like', '%' . $kw . '%');
            }
        }
        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Apparel', array_merge($this->shared($request), compact('products'), ['sub' => $sub ?? '']));
    }

    public function studyGuides(Request $request)
    {
        $products = $this->buildQuery($request)->paginate(12)->withQueryString();
        return Inertia::render('Shop/StudyGuides', array_merge($this->shared($request), compact('products')));
    }

    public function tools(Request $request)
    {
        $query = $this->buildQuery($request);
        $allowedSubs = ['field' => 'field', 'garden' => 'garden', 'soil' => 'soil', 'measuring' => 'measur'];
        $sub = $request->validate(['sub' => 'nullable|in:field,garden,soil,measuring'])['sub'] ?? null;
        if ($sub) {
            $query->where('name', 'like', '%' . $allowedSubs[$sub] . '%');
        }
        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Tools', array_merge($this->shared($request), compact('products'), ['sub' => $sub ?? '']));
    }

    public function deals(Request $request)
    {
        // Deals = products with compare_at_price > price
        $query = $this->buildQuery($request)->whereNotNull('compare_at_price')->whereColumn('compare_at_price', '>', 'price');
        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Deals', array_merge($this->shared($request), compact('products')));
    }

    public function categories(Request $request)
    {
        $allCategories = Category::withCount(['products' => fn($q) => $q->where('status', 'active')])->get();
        $activeCategory = $request->validate(['category' => 'nullable|integer|exists:categories,id'])['category'] ?? null;

        $query = $this->buildQuery($request);
        if ($activeCategory) $query->where('category_id', $activeCategory);

        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Categories', array_merge(
            $this->shared($request),
            compact('products', 'allCategories', 'activeCategory')
        ));
    }
}
