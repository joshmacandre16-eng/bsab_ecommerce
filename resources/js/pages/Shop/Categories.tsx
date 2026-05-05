import { Head, router } from '@inertiajs/react';
import { Package } from 'lucide-react';
import ShopLayout from '@/components/shop/ShopLayout';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

interface CategoryWithCount extends Category {
    products_count: number;
}

interface Props {
    products: PaginatedProducts;
    categories: CategoryWithCount[];
    brands: Brand[];
    filters: Filters;
    allCategories: CategoryWithCount[];
    activeCategory?: number | null;
}

const CAT_ICONS: Record<string, string> = {
    default: '🌿', seeds: '🌱', tools: '🔧', books: '📗', uniforms: '👕',
    fertilizers: '🧪', apparel: '👚', equipment: '⚙️', supplies: '📦',
};

function getCatIcon(name: string) {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(CAT_ICONS)) {
        if (lower.includes(key)) return icon;
    }
    return CAT_ICONS.default;
}

export default function Categories({ products, categories, brands, filters, allCategories, activeCategory }: Props) {
    return (
        <>
            <Head title="Categories — AgriShop" />
            <ShopLayout activeNav="Categories">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#1a4d1a] to-[#2d6a2d] text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-green-200 text-sm uppercase tracking-wider mb-1">Browse by Category</p>
                        <h1 className="text-3xl font-bold mb-2">All Categories</h1>
                        <p className="text-green-100">Find exactly what you need from our organized product categories.</p>
                    </div>
                </div>

                {/* Category Grid */}
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">Browse Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        <button
                            onClick={() => router.get(route('shop.categories'), {}, { preserveState: false })}
                            className={`rounded-xl p-5 border-2 text-left transition-all hover:shadow-md ${!activeCategory ? 'border-[#2d6a2d] bg-[#e8f5e9]' : 'border-gray-100 bg-white hover:border-[#2d6a2d]'}`}>
                            <span className="text-3xl">🛒</span>
                            <p className="font-semibold text-gray-800 mt-2 text-sm">All Products</p>
                            <p className="text-xs text-gray-500">{products.meta?.total ?? 0} products</p>
                        </button>
                        {allCategories.map(cat => (
                            <button key={cat.id}
                                onClick={() => router.get(route('shop.categories'), { category: cat.id }, { preserveState: false })}
                                className={`rounded-xl p-5 border-2 text-left transition-all hover:shadow-md ${activeCategory === cat.id ? 'border-[#2d6a2d] bg-[#e8f5e9]' : 'border-gray-100 bg-white hover:border-[#2d6a2d]'}`}>
                                <span className="text-3xl">{getCatIcon(cat.name)}</span>
                                <p className="font-semibold text-gray-800 mt-2 text-sm">{cat.name}</p>
                                <p className="text-xs text-gray-500">{cat.products_count} products</p>
                            </button>
                        ))}
                    </div>
                </div>

                <ShopGrid
                    products={products}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="shop.categories"
                    title={activeCategory ? (allCategories.find(c => c.id === activeCategory)?.name ?? 'Products') : 'All Products'}
                    subtitle={activeCategory ? 'Filtered by category' : 'Showing all products'}
                    extraParams={activeCategory ? { category: String(activeCategory) } : {}}
                />
            </ShopLayout>
        </>
    );
}
