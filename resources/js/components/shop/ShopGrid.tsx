import { Link, router } from '@inertiajs/react';
import { Package, Star, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export interface Product {
    id: number;
    name: string;
    price: string;
    compare_at_price?: string;
    stock_quantity: number;
    status: string;
    sku?: string;
    weight?: string;
    weight_unit?: string;
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    images?: { image_path: string; url: string; is_primary: boolean }[];
}

export interface Category { id: number; name: string; }
export interface Brand { id: number; name: string; }

export interface PaginatedProducts {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number; current_page: number; last_page: number };
}

export interface Filters {
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
}

function ProductCard({ product }: { product: Product }) {
    const img = product.images?.find(i => i.is_primary) ?? product.images?.[0];
    const price = parseFloat(product.price);
    const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
    const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group border border-gray-100 flex flex-col">
            <div className="relative h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
                {img ? (
                    <img src={img.url} alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <Package className="h-16 w-16 text-gray-200" />
                )}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        -{discount}%
                    </span>
                )}
                {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col flex-1">
                <p className="text-xs text-[#2d6a2d] font-medium mb-0.5">{product.category?.name}</p>
                <Link href={route('customer.products.show', product.id)}
                    className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#2d6a2d] transition-colors mb-1 flex-1">
                    {product.name}
                </Link>
                {product.brand && <p className="text-xs text-gray-400 mb-1">🏷️ {product.brand.name}</p>}
                <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-base text-gray-900">₱{price.toFixed(2)}</span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-xs text-gray-400 line-through">₱{comparePrice.toFixed(2)}</span>
                    )}
                </div>
                <div className="flex gap-1.5">
                    <button disabled={product.stock_quantity === 0}
                        className="flex-1 border border-[#2d6a2d] text-[#2d6a2d] text-xs py-1.5 rounded-lg hover:bg-[#e8f5e9] transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                        <ShoppingCart className="h-3 w-3" /> Add to Cart
                    </button>
                    <Link href={route('customer.products.show', product.id)}
                        className="flex-1 bg-[#f59e0b] text-white text-xs py-1.5 rounded-lg hover:bg-[#d97706] transition-colors font-medium text-center">
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

interface ShopGridProps {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
    routeName: string;
    title: string;
    subtitle?: string;
    extraParams?: Record<string, string>;
}

export default function ShopGrid({ products, categories, brands, filters, routeName, title, subtitle, extraParams }: ShopGridProps) {
    const safeFilters = (filters && typeof filters === 'object' && !Array.isArray(filters)) ? filters : {};
    const safeExtra = (extraParams && typeof extraParams === 'object') ? extraParams : {};
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeBrands = Array.isArray(brands) ? brands : [];
    const [showFilter, setShowFilter] = useState(false);
    const [search, setSearch] = useState(safeFilters.search ?? '');
    const [selectedCategory, setSelectedCategory] = useState(safeFilters.category ?? '');
    const [selectedBrand, setSelectedBrand] = useState(safeFilters.brand ?? '');
    const [sort, setSort] = useState(safeFilters.sort ?? 'newest');

    const productData = Array.isArray(products?.data) ? products.data : [];
    const productLinks = Array.isArray(products?.links) ? products.links : [];
    const productTotal = products?.meta?.total ?? productData.length;

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = { ...safeExtra, search, sort, ...overrides };
        if (selectedCategory) params.category = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        (Object.keys(params) as string[]).forEach(k => { if (!params[k]) delete params[k]; });
        router.get(route(routeName), params, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSelectedCategory(''); setSelectedBrand(''); setSort('newest'); setSearch('');
        router.get(route(routeName), safeExtra, { preserveState: false });
    };

    const hasFilters = selectedCategory || selectedBrand || safeFilters.search || sort !== 'newest';

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="text-sm text-[#2d6a2d] font-medium mt-0.5">{subtitle}</p>}
                    <p className="text-sm text-gray-500 mt-0.5">{productTotal} products found</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <form onSubmit={e => { e.preventDefault(); applyFilters(); }} className="flex">
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] w-40" />
                        <button type="submit" className="bg-[#2d6a2d] text-white px-3 rounded-r-lg hover:bg-[#245724] transition-colors text-sm">Go</button>
                    </form>
                    {hasFilters && (
                        <button onClick={clearFilters}
                            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            <X className="h-3.5 w-3.5" /> Clear
                        </button>
                    )}
                    <button onClick={() => setShowFilter(v => !v)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${showFilter ? 'bg-[#2d6a2d] text-white border-[#2d6a2d]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#2d6a2d] hover:text-[#2d6a2d]'}`}>
                        <SlidersHorizontal className="h-4 w-4" /> Filter
                    </button>
                    <select value={sort} onChange={e => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] bg-white">
                        <option value="newest">Newest</option>
                        <option value="price_low">Price: Low–High</option>
                        <option value="price_high">Price: High–Low</option>
                        <option value="name_asc">Name: A–Z</option>
                        <option value="name_desc">Name: Z–A</option>
                    </select>
                </div>
            </div>

            {showFilter && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="cat" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="accent-[#2d6a2d]" />
                                <span className="text-sm text-gray-700">All</span>
                            </label>
                            {safeCategories.map(c => (
                                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="cat" checked={selectedCategory === String(c.id)} onChange={() => setSelectedCategory(String(c.id))} className="accent-[#2d6a2d]" />
                                    <span className="text-sm text-gray-700">{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="brand" checked={selectedBrand === ''} onChange={() => setSelectedBrand('')} className="accent-[#2d6a2d]" />
                                <span className="text-sm text-gray-700">All</span>
                            </label>
                            {safeBrands.map(b => (
                                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="brand" checked={selectedBrand === String(b.id)} onChange={() => setSelectedBrand(String(b.id))} className="accent-[#2d6a2d]" />
                                    <span className="text-sm text-gray-700">{b.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button onClick={() => applyFilters()}
                            className="w-full bg-[#2d6a2d] text-white py-2.5 rounded-lg hover:bg-[#245724] transition-colors font-semibold text-sm">
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {safeFilters.search && (
                        <span className="bg-[#e8f5e9] text-[#2d6a2d] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                            "{safeFilters.search}" <button onClick={() => { setSearch(''); applyFilters({ search: '' }); }}><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {selectedCategory && (
                        <span className="bg-[#e8f5e9] text-[#2d6a2d] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                            {safeCategories.find(c => String(c.id) === selectedCategory)?.name}
                            <button onClick={() => { setSelectedCategory(''); applyFilters({ category: '' }); }}><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {selectedBrand && (
                        <span className="bg-[#e8f5e9] text-[#2d6a2d] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                            {safeBrands.find(b => String(b.id) === selectedBrand)?.name}
                            <button onClick={() => { setSelectedBrand(''); applyFilters({ brand: '' }); }}><X className="h-3 w-3" /></button>
                        </span>
                    )}
                </div>
            )}

            {productData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productData.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Package className="mx-auto h-16 w-16 text-gray-200 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                    <p className="text-sm text-gray-400 mb-4">Try adjusting your search or filters.</p>
                    <button onClick={clearFilters} className="bg-[#2d6a2d] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#245724] transition-colors">
                        Clear Filters
                    </button>
                </div>
            )}

            {productLinks.length > 0 && productData.length > 0 && (
                <div className="mt-8 flex items-center justify-center gap-1 flex-wrap">
                    {productLinks.map((link, i) => (
                        link.url ? (
                            <Link key={i} href={link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${link.active ? 'bg-[#2d6a2d] text-white border-[#2d6a2d]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#2d6a2d] hover:text-[#2d6a2d]'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-300 bg-white"
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
