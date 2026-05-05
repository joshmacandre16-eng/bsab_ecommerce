import StarRating from '@/components/StarRating';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ProductImage { url: string; is_primary: boolean }
interface Product {
    id: number;
    name: string;
    price: number;
    compare_at_price?: string;
    stock_quantity: number;
    status: string;
    sku?: string;
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    images?: ProductImage[];
    reviews_avg_rating?: number;
    reviews_count?: number;
}
interface Filter { category?: string; brand?: string; search?: string }

function ProductCard({ product, onDelete }: { product: Product; onDelete: (id: number) => void }) {
    const images = product.images ?? [];
    const primary = images.find(i => i.is_primary) ?? images[0];
    const price = Number(product.price);
    const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
    const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    const outOfStock = product.stock_quantity === 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Image */}
            <div className="relative block aspect-square overflow-hidden bg-gray-50">
                {primary
                    ? <img src={primary.url} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    : <div className="flex h-full items-center justify-center"><Package className="h-12 w-12 text-gray-200" /></div>
                }
                {discount > 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">-{discount}%</span>
                )}
                {product.status === 'active' && (
                    <span className="absolute top-2 right-2 rounded-full bg-[#2d6a2d] px-2 py-0.5 text-[10px] font-semibold text-white uppercase">Active</span>
                )}
                {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-3">
                {product.category && (
                    <p className="mb-0.5 truncate text-[11px] font-medium text-[#2d6a2d]">{product.category.name}</p>
                )}
                <p className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-800">{product.name}</p>
                <div className="mb-2">
                    <StarRating rating={product.reviews_avg_rating ?? 0} count={product.reviews_count} />
                </div>
                <div className="mb-3 flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-[#2d6a2d]">₱{price.toFixed(2)}</span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-xs text-gray-400 line-through">₱{comparePrice.toFixed(2)}</span>
                    )}
                </div>
                <div className="mt-auto flex gap-1.5">
                    <Link
                        href={route('admin.products.edit', product.id)}
                        className="flex-1 rounded-lg border border-[#2d6a2d] py-1.5 text-center text-xs font-semibold text-[#2d6a2d] transition-colors hover:bg-[#e8f5e9]"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="flex-1 rounded-lg bg-[#f59e0b] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#d97706]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminProductsIndex({
    products,
    categories,
    brands,
    filters,
}: {
    products: { data: Product[]; links: any[]; meta: any };
    categories: { id: number; name: string }[];
    brands: { id: number; name: string }[];
    filters: Filter;
}) {
    const applyFilter = (extra: Partial<Filter>) => {
        router.get(route('admin.products.index'), { ...filters, ...extra }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this product?')) router.delete(route('admin.products.destroy', id));
    };

    const activeCategory = filters.category ? Number(filters.category) : null;
    const activeBrand    = filters.brand    ? Number(filters.brand)    : null;

    return (
        <AdminLayout breadcrumb="Products">
            <Head title="Products" />

            {/* Header */}
            <div
                className="flex items-end justify-between flex-wrap gap-4 px-10 py-8"
                style={{ borderBottom: '1px solid #E2E0D8', background: '#F9F7F2' }}
            >
                <div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, color: '#1C1C1A' }}>
                        Products
                    </h1>
                    <p style={{ fontSize: 12, color: '#6B6B66', marginTop: 6, fontWeight: 300, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {products.meta?.total ?? products.data.length} total products
                    </p>
                </div>
                <Link
                    href={route('admin.products.create')}
                    className="inline-flex items-center gap-1.5 transition-colors"
                    style={{ background: '#1D6A3E', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#145530'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1D6A3E'}
                >
                    <Plus className="h-3.5 w-3.5" /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div
                className="flex items-center gap-2 flex-wrap px-10 py-4"
                style={{ borderBottom: '1px solid #E2E0D8', background: '#F9F7F2' }}
            >
                <button
                    onClick={() => applyFilter({ category: undefined, brand: undefined })}
                    style={{
                        padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: `1px solid ${!activeCategory && !activeBrand ? '#1D6A3E' : '#4A9E6F'}`,
                        background: !activeCategory && !activeBrand ? '#1D6A3E' : 'white',
                        color: !activeCategory && !activeBrand ? 'white' : '#1D6A3E',
                        cursor: 'pointer', letterSpacing: '0.03em', fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    All
                </button>

                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => applyFilter({ category: String(cat.id), brand: undefined })}
                        style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                            border: `1px solid ${activeCategory === cat.id ? '#1D6A3E' : '#4A9E6F'}`,
                            background: activeCategory === cat.id ? '#1D6A3E' : 'white',
                            color: activeCategory === cat.id ? 'white' : '#1D6A3E',
                            cursor: 'pointer', letterSpacing: '0.03em', fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {cat.name}
                    </button>
                ))}

                {brands.map(brand => (
                    <button
                        key={brand.id}
                        onClick={() => applyFilter({ brand: activeBrand === brand.id ? undefined : String(brand.id), category: undefined })}
                        style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                            border: `1px solid ${activeBrand === brand.id ? '#1D6A3E' : '#4A9E6F'}`,
                            background: activeBrand === brand.id ? '#1D6A3E' : 'white',
                            color: activeBrand === brand.id ? 'white' : '#1D6A3E',
                            cursor: 'pointer', letterSpacing: '0.03em', fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {brand.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="mx-auto max-w-7xl p-[5px]">
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                        {products.data.map(product => (
                            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
                        <Package className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                        <p className="font-medium text-gray-500">No products found.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {products.links && products.data.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1 px-4 pb-8">
                    {products.links.map((link, i) =>
                        link.url ? (
                            <Link key={i} href={link.url} className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${link.active ? 'border-[#2d6a2d] bg-[#2d6a2d] text-white' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
