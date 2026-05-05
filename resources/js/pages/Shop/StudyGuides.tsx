import { Head } from '@inertiajs/react';
import ShopLayout from '@/components/shop/ShopLayout';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
}

export default function StudyGuides({ products, categories, brands, filters }: Props) {
    return (
        <>
            <Head title="Study Guides — AgriShop" />
            <ShopLayout activeNav="Study Guides">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2563eb] text-white py-10 px-4">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-blue-200 text-sm uppercase tracking-wider mb-1">Academic Resources</p>
                        <h1 className="text-3xl font-bold mb-2">Study Guides & Books</h1>
                        <p className="text-blue-100">Textbooks, reviewers, and reference materials for BSAB students.</p>
                    </div>
                </div>

                {/* Info cards */}
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                        {[
                            { icon: '📗', label: 'Textbooks', desc: 'Core curriculum books' },
                            { icon: '📋', label: 'Reviewers', desc: 'Exam preparation' },
                            { icon: '📊', label: 'References', desc: 'Research materials' },
                            { icon: '📓', label: 'Notebooks', desc: 'Study essentials' },
                        ].map(c => (
                            <div key={c.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <span className="text-3xl">{c.icon}</span>
                                <p className="font-semibold text-gray-800 text-sm mt-2">{c.label}</p>
                                <p className="text-xs text-gray-500">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <ShopGrid
                    products={products}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="shop.study-guides"
                    title="Study Guides & Books"
                    subtitle="Academic resources for BSAB students"
                />
            </ShopLayout>
        </>
    );
}
