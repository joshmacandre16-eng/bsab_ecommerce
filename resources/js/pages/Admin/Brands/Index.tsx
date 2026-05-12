import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Brand {
    id: number;
    name: string;
    logo?: string;
    products_count: number;
    created_at: string;
}

export default function BrandsIndex({ brands }: { brands: { data: Brand[]; links: any[]; meta: any } }) {
    const [search, setSearch] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this brand?')) {
            router.delete(route('admin.brands.destroy', id));
        }
    };

    const total = brands.meta?.total ?? brands.data.length;
    const active = brands.data.filter(b => b.products_count > 0).length;
    const empty  = brands.data.filter(b => b.products_count === 0).length;
    const filtered = brands.data.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout breadcrumb="Brands">
            <Head title="Brand Management" />

            <div className="pg-header">
                <div>
                    <div className="pg-title">Brand Management</div>
                    <div className="pg-subtitle">Manage product brands</div>
                </div>
                <Link href={route('admin.brands.create')} className="btn btn-primary btn-sm">
                    + Add Brand
                </Link>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Brands',  value: total,  icon: '🏷' },
                    { label: 'Active Brands', value: active, icon: '✅' },
                    { label: 'Empty Brands',  value: empty,  icon: '⛔' },
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
                    <span className="card-title">All Brands</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input"
                            style={{ width: 200 }}
                        />
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{total} total</span>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Brand', 'Products', 'Created', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {filtered.map(brand => (
                                <tr key={brand.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#f1f3f7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {brand.logo
                                                    ? <img src={`/storage/${brand.logo}`} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <span style={{ fontSize: 18 }}>🏷</span>
                                                }
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{brand.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${brand.products_count > 0 ? 'badge-green' : 'badge-gray'}`}>
                                            {brand.products_count} products
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>
                                        {new Date(brand.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <Link href={route('admin.brands.edit', brand.id)} className="btn btn-secondary btn-sm">Edit</Link>
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                disabled={brand.products_count > 0}
                                                className="btn btn-danger btn-sm"
                                                style={{ opacity: brand.products_count > 0 ? 0.4 : 1, cursor: brand.products_count > 0 ? 'not-allowed' : 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">🏷</div>
                            <div className="empty-state-title">No brands found</div>
                        </div>
                    )}
                </div>

                {brands.links && brands.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {brands.meta?.from}–{brands.meta?.to} of {brands.meta?.total}</span>
                        <div className="pagination-links">
                            {brands.links.map((l: any, i: number) => l.url
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
