import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

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
interface Filter { category?: string; brand?: string; search?: string; sort?: string }

const STATUS_BADGE: Record<string, string> = {
    active:   'badge-green',
    inactive: 'badge-red',
    draft:    'badge-yellow',
};

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
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = (extra: Partial<Filter>) => {
        const params = { ...filters, search, ...extra };
        Object.keys(params).forEach(k => !(params as any)[k] && delete (params as any)[k]);
        router.get(route('admin.products.index'), params, { preserveState: true, replace: true });
    };

    const handleSearch = (e: FormEvent) => { e.preventDefault(); applyFilter({}); };
    const clearFilter = (key: keyof Filter) => applyFilter({ [key]: '' });

    const handleDelete = (id: number) => {
        if (confirm('Delete this product?')) router.delete(route('admin.products.destroy', id));
    };

    const total = products.meta?.total ?? products.data.length;
    const active = products.data.filter(p => p.status === 'active').length;
    const outOfStock = products.data.filter(p => p.stock_quantity === 0).length;

    return (
        <AdminLayout breadcrumb="Products">
            <Head title="Products" />

            <div className="pg-header">
                <div>
                    <div className="pg-title">Products</div>
                    <div className="pg-subtitle">Manage your product catalog</div>
                </div>
                <Link href={route('admin.products.create')} className="btn btn-primary btn-sm">
                    + Add Product
                </Link>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Products', value: total,      icon: '📦' },
                    { label: 'Active',          value: active,     icon: '✅' },
                    { label: 'Out of Stock',    value: outOfStock, icon: '⛔' },
                    { label: 'Categories',      value: categories.length, icon: '🗂' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Products</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {/* Search */}
                        <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="form-input"
                                style={{ borderRadius: '6px 0 0 6px', borderRight: 'none', width: 180 }}
                            />
                            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '0 6px 6px 0' }}>
                                Search
                            </button>
                        </form>

                        <select
                            value={filters.category ?? ''}
                            onChange={e => applyFilter({ category: e.target.value })}
                            className="form-input"
                            style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                        </select>

                        {brands.length > 0 && (
                            <select
                                value={filters.brand ?? ''}
                                onChange={e => applyFilter({ brand: e.target.value })}
                                className="form-input"
                                style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}
                            >
                                <option value="">All Brands</option>
                                {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                            </select>
                        )}

                        <select
                            value={filters.sort ?? 'newest'}
                            onChange={e => applyFilter({ sort: e.target.value })}
                            className="form-input"
                            style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}
                        >
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low → High</option>
                            <option value="price_high">Price: High → Low</option>
                            <option value="name_asc">Name A–Z</option>
                            <option value="name_desc">Name Z–A</option>
                        </select>

                        {/* Active filter chips */}
                        {filters.search && (
                            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                "{filters.search}"
                                <button onClick={() => clearFilter('search')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                                    <X size={11} />
                                </button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                {categories.find(c => String(c.id) === filters.category)?.name}
                                <button onClick={() => clearFilter('category')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                                    <X size={11} />
                                </button>
                            </span>
                        )}
                        {filters.brand && (
                            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                {brands.find(b => String(b.id) === filters.brand)?.name}
                                <button onClick={() => clearFilter('brand')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                                    <X size={11} />
                                </button>
                            </span>
                        )}

                        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>{total} total</span>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Product', 'Category / Brand', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {products.data.map(product => {
                                const images = product.images ?? [];
                                const primary = images.find(i => i.is_primary) ?? images[0];
                                const price = Number(product.price);
                                const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;

                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#f1f3f7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {primary
                                                        ? <img src={primary.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <span style={{ fontSize: 18 }}>📦</span>
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                                                    {product.sku && <div style={{ fontSize: 12, color: '#9ca3af' }}>SKU: {product.sku}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 13 }}>{product.category?.name ?? '—'}</div>
                                            {product.brand && <div style={{ fontSize: 12, color: '#9ca3af' }}>{product.brand.name}</div>}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>₱{price.toFixed(2)}</div>
                                            {comparePrice && comparePrice > price && (
                                                <div style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>₱{comparePrice.toFixed(2)}</div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${product.stock_quantity === 0 ? 'badge-red' : product.stock_quantity < 10 ? 'badge-yellow' : 'badge-green'}`}>
                                                {product.stock_quantity === 0 ? 'Out of Stock' : `${product.stock_quantity} in stock`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${STATUS_BADGE[product.status] ?? 'badge-gray'}`}>
                                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <Link href={route('admin.products.edit', product.id)} className="btn btn-secondary btn-sm">Edit</Link>
                                                <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {products.data.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <div className="empty-state-title">No products found</div>
                            <button onClick={() => router.get(route('admin.products.index'))} className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {products.links && products.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {products.meta?.from}–{products.meta?.to} of {products.meta?.total}</span>
                        <div className="pagination-links">
                            {products.links.map((l: any, i: number) => l.url
                                ? <Link key={i} href={l.url} className={l.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: l.label }} />
                                : <span key={i} dangerouslySetInnerHTML={{ __html: l.label }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
