import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/layouts/SellerLayout';

interface Product {
    id: number; name: string; sku?: string; stock_quantity: number;
    low_stock_threshold: number; status: string; category?: { name: string };
    images?: { image_path: string }[];
}
interface Props {
    products: { data: Product[]; links: any[]; meta: any };
}

const M = { fontFamily: "'JetBrains Mono', monospace" };
const S = { fontFamily: "'Inter', sans-serif" };

function StockModal({ product, onClose }: { product: Product; onClose: () => void }) {
    const { data, setData, patch, processing, errors } = useForm({
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        reason: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('seller.inventory.stock', product.id), { onSuccess: onClose });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="card" style={{ width: '100%', maxWidth: 400, padding: 28 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>Update Stock</div>
                <div style={{ fontSize: 12, color: '#6b7e68', marginBottom: 20 }}>{product.name}</div>
                <form onSubmit={submit}>
                    {[
                        { label: 'Stock Quantity', key: 'stock_quantity' as const },
                        { label: 'Low Stock Threshold', key: 'low_stock_threshold' as const },
                    ].map(({ label, key }) => (
                        <div key={key} className="form-group">
                            <label className="form-label">{label}</label>
                            <input type="number" min={0} value={data[key]}
                                onChange={e => setData(key, parseInt(e.target.value) || 0)}
                                className="form-input" />
                            {errors[key] && <div className="form-error">{errors[key]}</div>}
                        </div>
                    ))}
                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <input type="text" value={data.reason} onChange={e => setData('reason', e.target.value)}
                            placeholder="e.g. restock, correction" className="form-input" />
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={processing} className="btn btn-primary" style={{ opacity: processing ? 0.6 : 1 }}>
                            {processing ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function InventoryIndex({ products }: Props) {
    const [editing, setEditing] = useState<Product | null>(null);
    const [search, setSearch] = useState('');

    const applyFilter = (filter: string) => {
        router.get(route('seller.inventory.index'), filter ? { filter } : {}, { preserveScroll: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('seller.inventory.index'), search ? { search } : {}, { preserveScroll: true, replace: true });
    };

    return (
        <SellerLayout breadcrumb="Inventory">
            <Head title="Inventory" />
            {editing && <StockModal product={editing} onClose={() => setEditing(null)} />}

            <div className="pg-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div className="pg-title">Inventory</div>
                    <div className="pg-subtitle">Track and manage stock levels</div>
                </div>
                <Link href={route('seller.products.create')} className="btn btn-primary">+ Add Product</Link>
            </div>

            {/* Filters */}
            <div className="filter-bar" style={{ marginBottom: 20, borderRadius: 10, border: '1px solid #d4ddd2' }}>
                {[
                    { key: '', label: 'All' },
                    { key: 'low_stock', label: '⚠ Low Stock' },
                    { key: 'out_of_stock', label: '✕ Out of Stock' },
                ].map(({ key, label }) => (
                    <button key={key} onClick={() => applyFilter(key)} className="btn btn-secondary btn-sm">{label}</button>
                ))}
                <form onSubmit={handleSearch} style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                        className="form-input" style={{ width: 200 }} />
                    <button type="submit" className="btn btn-primary btn-sm">Search</button>
                </form>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table className="ap-table" style={{ minWidth: 600 }}>
                        <thead>
                            <tr>
                                {['Product', 'SKU', 'Category', 'Stock', 'Threshold', 'Status', 'Actions'].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((p) => {
                                const isLow = p.stock_quantity <= p.low_stock_threshold;
                                const isOut = p.stock_quantity === 0;
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 36, height: 36, flexShrink: 0, background: '#f4f8f3', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {p.images?.[0]?.image_path ? (
                                                        <img src={`/storage/${p.images[0].image_path}`} alt={p.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span style={{ fontSize: 16, color: '#6b7e68' }}>⊞</span>
                                                    )}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#6b7e68', fontSize: 12 }}>{p.sku ?? '—'}</td>
                                        <td style={{ color: '#6b7e68' }}>{p.category?.name ?? '—'}</td>
                                        <td>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: isOut ? '#b91c1c' : isLow ? '#d97706' : '#1a2e1a' }}>
                                                {isOut ? '✕ ' : isLow ? '⚠ ' : ''}{p.stock_quantity}
                                            </span>
                                        </td>
                                        <td style={{ color: '#6b7e68', fontSize: 12 }}>{p.low_stock_threshold}</td>
                                        <td>
                                            <span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{p.status}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => setEditing(p)} className="btn btn-secondary btn-sm">Update Stock</button>
                                                <Link href={route('seller.inventory.logs', p.id)} className="btn btn-secondary btn-sm">Logs</Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {products.data.length === 0 && (
                    <div className="empty-state"><div className="empty-state-text">No products found.</div></div>
                )}
                {products.meta?.last_page > 1 && (
                    <div className="pagination">
                        <span className="pagination-info">{products.meta?.from}–{products.meta?.to} of {products.meta?.total}</span>
                        <div className="pagination-links">
                            {products.links.map((link: any, i: number) =>
                                link.url ? (
                                    <Link key={i} href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
