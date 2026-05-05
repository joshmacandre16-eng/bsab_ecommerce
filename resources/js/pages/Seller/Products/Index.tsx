import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Edit, Eye, Package, Plus, Trash2 } from 'lucide-react';
import SellerLayout from '@/layouts/SellerLayout';

interface Product {
    id: number; name: string; price: number; stock_quantity: number;
    low_stock_threshold: number; status: string;
    category?: { name: string }; created_at: string;
    images?: { image_path: string }[];
}
interface Stats { total: number; active: number; inactive: number; lowStock: number }
interface Props { products: { data: Product[]; links: any[]; meta: any }; stats: Stats }

export default function SellerProductsIndex({ products, stats }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Delete this product?')) router.delete(route('seller.products.destroy', id));
    };

    return (
        <SellerLayout breadcrumb="Products">
            <Head title="My Products" />

            <div className="pg-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div className="pg-title">My Products</div>
                    <div className="pg-subtitle">Manage your product listings</div>
                </div>
                <Link href={route('seller.products.create')} className="btn btn-primary">
                    <Plus className="h-4 w-4" /> Add Product
                </Link>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                {[
                    { label: 'Total',     value: stats.total },
                    { label: 'Active',    value: stats.active },
                    { label: 'Inactive',  value: stats.inactive },
                    { label: 'Low Stock', value: stats.lowStock },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-wrap">
                    <table className="ap-table" style={{ minWidth: 540 }}>
                        <thead>
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, background: '#f4f8f3', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                                {product.images?.[0]?.image_path ? (
                                                    <img src={`/storage/${product.images[0].image_path}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Package className="h-4 w-4" style={{ color: '#6b7e68' }} />
                                                )}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: '#6b7e68' }}>{product.category?.name ?? '—'}</td>
                                    <td style={{ fontWeight: 600 }}>₱{Number(product.price).toFixed(2)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {product.stock_quantity <= product.low_stock_threshold && <AlertTriangle className="h-4 w-4" style={{ color: '#b91c1c' }} />}
                                            <span style={{ fontSize: 13, color: product.stock_quantity <= product.low_stock_threshold ? '#b91c1c' : '#1a2e1a', fontWeight: product.stock_quantity <= product.low_stock_threshold ? 700 : 400 }}>
                                                {product.stock_quantity}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${product.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{product.status}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Link href={route('seller.products.show', product.id)} style={{ color: '#6b7e68' }}><Eye className="h-4 w-4" /></Link>
                                            <Link href={route('seller.products.edit', product.id)} style={{ color: '#6b7e68' }}><Edit className="h-4 w-4" /></Link>
                                            <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', padding: 0 }}><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.data.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                        <div className="empty-state-title">No products yet</div>
                        <div className="empty-state-text">Get started by adding your first product.</div>
                        <Link href={route('seller.products.create')} className="btn btn-primary" style={{ marginTop: 16 }}>
                            <Plus className="h-4 w-4" /> Add Product
                        </Link>
                    </div>
                )}

                {products.links && products.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {products.meta?.from}–{products.meta?.to} of {products.meta?.total}</span>
                        <div className="pagination-links">
                            {products.links.map((link, i) =>
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
