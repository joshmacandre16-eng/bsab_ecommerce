import { Head, router } from '@inertiajs/react';
import ShopLayout from '@/components/shop/ShopLayout';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
    sub?: string;
}

const SUBS = [
    { key: '', label: 'All Tools', icon: '🔧' },
    { key: 'field', label: 'Field Tools', icon: '⛏️' },
    { key: 'garden', label: 'Garden Tools', icon: '🌿' },
    { key: 'soil', label: 'Soil Testers', icon: '🧪' },
    { key: 'measuring', label: 'Measuring Tools', icon: '📏' },
];

export default function Tools({ products, categories, brands, filters, sub = '' }: Props) {
    return (
        <>
            <Head title="Tools — AgriShop" />
            <ShopLayout activeNav="Tools">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#78350f] to-[#d97706] text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-amber-200 text-sm uppercase tracking-wider mb-1">Agricultural Equipment</p>
                        <h1 className="text-3xl font-bold mb-2">Tools & Equipment</h1>
                        <p className="text-amber-100">Professional-grade tools for farming, gardening, and soil analysis.</p>
                    </div>
                </div>

                {/* Sub-category tabs */}
                <div className="bg-white border-b border-gray-200 sticky top-[65px] z-40">
                    <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
                        {SUBS.map(s => (
                            <button key={s.key}
                                onClick={() => router.get(route('shop.tools'), s.key ? { sub: s.key } : {}, { preserveState: false })}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${sub === s.key ? 'bg-[#d97706] text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#d97706]'}`}>
                                <span>{s.icon}</span> {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <ShopGrid
                    products={products}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="shop.tools"
                    title={SUBS.find(s => s.key === sub)?.label ?? 'Tools & Equipment'}
                    extraParams={sub ? { sub } : {}}
                />
            </ShopLayout>
        </>
    );
}
