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
    { key: '', label: 'All Apparel', icon: '👕' },
    { key: 'polo', label: 'Polo Shirts', icon: '🟢' },
    { key: 'tshirt', label: 'T-Shirts', icon: '👚' },
    { key: 'gown', label: 'Lab Gowns', icon: '🥼' },
    { key: 'accessories', label: 'Caps & Accessories', icon: '🧢' },
];

export default function Apparel({ products, categories, brands, filters, sub = '' }: Props) {
    return (
        <>
            <Head title="BSAB Apparel — AgriShop" />
            <ShopLayout activeNav="BSAB Apparel">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-[#1a4d1a] to-[#2d6a2d] text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-green-200 text-sm uppercase tracking-wider mb-1">Official CPSU-BSAB</p>
                        <h1 className="text-3xl font-bold mb-2">BSAB Apparel</h1>
                        <p className="text-green-100">Official uniforms, shirts, gowns and accessories for BSAB students.</p>
                    </div>
                </div>

                {/* Sub-category tabs */}
                <div className="bg-white border-b border-gray-200 sticky top-[65px] z-40">
                    <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
                        {SUBS.map(s => (
                            <button key={s.key}
                                onClick={() => router.get(route('shop.apparel'), s.key ? { sub: s.key } : {}, { preserveState: false })}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${sub === s.key ? 'bg-[#2d6a2d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#e8f5e9] hover:text-[#2d6a2d]'}`}>
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
                    routeName="shop.apparel"
                    title={SUBS.find(s => s.key === sub)?.label ?? 'BSAB Apparel'}
                    extraParams={sub ? { sub } : {}}
                />
            </ShopLayout>
        </>
    );
}
