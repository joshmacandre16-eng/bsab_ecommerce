<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    private function buildQuery(Request $request, array $extraWhere = [])
    {
        $query = Product::with(['category', 'brand', 'images'])->where('status', 'active');

        foreach ($extraWhere as $col => $val) {
            $query->where($col, $val);
        }

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

        return $query;
    }

    private function shared(Request $request)
    {
        return [
            'categories' => Category::select('id', 'name')->get(),
            'brands'     => Brand::select('id', 'name')->get(),
            'filters'    => array_merge(['search' => '', 'category' => '', 'brand' => '', 'sort' => ''], $request->only(['search', 'category', 'brand', 'sort'])),
        ];
    }

    public function allProducts(Request $request)
    {
        $products = $this->buildQuery($request)->paginate(12)->withQueryString();
        return Inertia::render('Shop/AllProducts', array_merge($this->shared($request), compact('products')));
    }

    public function apparel(Request $request)
    {
        // Filter by sub-category keyword in product name if sub param given
        $query = $this->buildQuery($request);
        if ($sub = $request->get('sub')) {
            $keywords = ['polo' => 'polo', 'tshirt' => 't-shirt', 'gown' => 'gown', 'accessories' => ['cap', 'accessory']];
            $kw = $keywords[$sub] ?? $sub;
            if (is_array($kw)) {
                $query->where(function ($q) use ($kw) {
                    foreach ($kw as $k) $q->orWhere('name', 'like', "%{$k}%");
                });
            } else {
                $query->where('name', 'like', "%{$kw}%");
            }
        }
        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Apparel', array_merge($this->shared($request), compact('products'), ['sub' => $request->get('sub', '')]));
    }

    public function studyGuides(Request $request)
    {
        $products = $this->buildQuery($request)->paginate(12)->withQueryString();
        return Inertia::render('Shop/StudyGuides', array_merge($this->shared($request), compact('products')));
    }

    public function tools(Request $request)
    {
        $query = $this->buildQuery($request);
        if ($sub = $request->get('sub')) {
            $keywords = ['field' => 'field', 'garden' => 'garden', 'soil' => 'soil', 'measuring' => 'measur'];
            $kw = $keywords[$sub] ?? $sub;
            $query->where('name', 'like', "%{$kw}%");
        }
        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Tools', array_merge($this->shared($request), compact('products'), ['sub' => $request->get('sub', '')]));
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
        $activeCategory = $request->get('category') ? (int) $request->get('category') : null;

        $query = $this->buildQuery($request);
        if ($activeCategory) $query->where('category_id', $activeCategory);

        $products = $query->paginate(12)->withQueryString();
        return Inertia::render('Shop/Categories', array_merge(
            $this->shared($request),
            compact('products', 'allCategories', 'activeCategory')
        ));
    }
}
