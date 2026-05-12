import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent?: { name: string };
    products_count: number;
    image?: string;
    created_at: string;
}

export default function CategoriesIndex({ categories }: { categories: { data: Category[]; links: any[]; meta: any } }) {
    const [search, setSearch] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    const total = categories.meta?.total ?? categories.data.length;
    const parentCount = categories.data.filter(c => !c.parent).length;
    const subCount = categories.data.filter(c => c.parent).length;
    const filtered = categories.data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout breadcrumb="Categories">
            <Head title="Category Management" />

            <div className="pg-header">
                <div>
                    <div className="pg-title">Category Management</div>
                    <div className="pg-subtitle">Organize your products with categories</div>
                </div>
                <Link href={route('admin.categories.create')} className="btn btn-primary btn-sm">
                    + Add Category
                </Link>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Categories',  value: total,       icon: '🗂' },
                    { label: 'Parent Categories', value: parentCount, icon: '📁' },
                    { label: 'Sub Categories',    value: subCount,    icon: '📂' },
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
                    <span className="card-title">All Categories</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="Search categories..."
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
                            <tr>{['Category', 'Slug', 'Parent', 'Products', 'Created', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {filtered.map(category => (
                                <tr key={category.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#f1f3f7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {category.image
                                                    ? <img src={`/storage/${category.image}`} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <span style={{ fontSize: 18 }}>📁</span>
                                                }
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{category.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{category.slug}</td>
                                    <td>
                                        {category.parent
                                            ? <span className="badge badge-blue">{category.parent.name}</span>
                                            : <span style={{ fontSize: 12, color: '#9ca3af' }}>—</span>
                                        }
                                    </td>
                                    <td>
                                        <span className={`badge ${category.products_count > 0 ? 'badge-green' : 'badge-gray'}`}>
                                            {category.products_count} products
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <Link href={route('admin.categories.edit', category.id)} className="btn btn-secondary btn-sm">Edit</Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                disabled={category.products_count > 0}
                                                className="btn btn-danger btn-sm"
                                                style={{ opacity: category.products_count > 0 ? 0.4 : 1, cursor: category.products_count > 0 ? 'not-allowed' : 'pointer' }}
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
                            <div className="empty-state-icon">📁</div>
                            <div className="empty-state-title">No categories found</div>
                        </div>
                    )}
                </div>

                {categories.links && categories.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {categories.meta?.from}–{categories.meta?.to} of {categories.meta?.total}</span>
                        <div className="pagination-links">
                            {categories.links.map((l: any, i: number) => l.url
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
