import { Head } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import ShopLayout from '@/components/shop/ShopLayout';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
}

function Countdown() {
    const [time, setTime] = useState(2 * 3600 + 45 * 60 + 18);
    useEffect(() => {
        const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, []);
    const pad = (n: number) => String(n).padStart(2, '0');
    const h = Math.floor(time / 3600), m = Math.floor((time % 3600) / 60), s = time % 60;
    return (
        <div className="flex items-center gap-2">
            {[pad(h), pad(m), pad(s)].map((v, i) => (
                <span key={i} className="flex items-center gap-1">
                    <span className="bg-white text-red-600 font-bold text-xl px-3 py-1.5 rounded-lg shadow min-w-[48px] text-center">{v}</span>
                    {i < 2 && <span className="text-white font-bold text-xl">:</span>}
                </span>
            ))}
        </div>
    );
}

export default function Deals({ products, categories, brands, filters }: Props) {
    return (
        <>
            <Head title="Deals — AgriShop" />
            <ShopLayout activeNav="Deals">
                {/* Hero */}
                <div className="bg-gradient-to-r from-red-700 to-red-500 text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-red-200 text-sm uppercase tracking-wider mb-1">Limited Time Offers</p>
                            <h1 className="text-3xl font-bold mb-2">⚡ Flash Deals</h1>
                            <p className="text-red-100">Exclusive discounts for CPSU-BSAB students. Don't miss out!</p>
                            <div className="mt-3 inline-block bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-bold">
                                15% OFF for CPSU Students!
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2 text-red-200 text-sm mb-2">
                                <Clock className="h-4 w-4" /> Sale ends in:
                            </div>
                            <Countdown />
                        </div>
                    </div>
                </div>

                {/* Deal stats */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex gap-6 overflow-x-auto">
                        {[
                            { label: 'Flash Sale', value: '⚡ Up to 50% off', color: 'text-red-500' },
                            { label: 'Student Discount', value: '🎓 15% for CPSU', color: 'text-blue-500' },
                            { label: 'Bundle Deals', value: '📦 Buy 2 Get 1', color: 'text-green-600' },
                            { label: 'Free Shipping', value: '🚚 Orders ₱500+', color: 'text-purple-500' },
                        ].map(d => (
                            <div key={d.label} className="text-center shrink-0">
                                <p className={`font-bold text-sm ${d.color}`}>{d.value}</p>
                                <p className="text-xs text-gray-500">{d.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <ShopGrid
                    products={products}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="shop.deals"
                    title="All Deals"
                    subtitle="Products with special discounts"
                />
            </ShopLayout>
        </>
    );
}
