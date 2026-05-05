import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, ChevronRight, Clock, Eye, Package, ShoppingCart, Truck, X } from 'lucide-react';
import { useState } from 'react';
import SellerLayout from '@/layouts/SellerLayout';

interface Product { id: number; name: string; price: string | number; images?: { url: string; is_primary: boolean }[] }
interface OrderItem { id: number; product: Product; quantity: number; unit_price: string | number }
interface OrderUser { id: number; name: string; email: string }
interface Order {
    id: number; order_number: string; status: string; payment_status?: string;
    total: string | number; user?: OrderUser; items: OrderItem[]; created_at: string;
}
interface PaginationLink { url: string | null; label: string; active: boolean }
interface Props {
    orders: { data: Order[]; links: PaginationLink[]; meta: { total: number; from: number; to: number; current_page: number; last_page: number } };
    statusCounts: Record<string, number>;
    filters?: { status?: string };
}

const STATUS_DOT: Record<string, string> = {
    pending: '#f59e0b', confirmed: '#3b82f6', processing: '#3b82f6',
    shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444', paid: '#6366f1',
};

const NEXT_STATUS: Record<string, { label: string; value: string }> = {
    pending:   { label: 'Confirm Order',   value: 'confirmed' },
    confirmed: { label: 'Mark as Shipped', value: 'shipped' },
    shipped:   { label: 'Mark Delivered',  value: 'delivered' },
};

const FILTER_TABS = [
    { key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' }, { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }, { key: 'cancelled', label: 'Cancelled' },
];

export default function VendorOrdersIndex({ orders, statusCounts, filters = {} }: Props) {
    const [advancing, setAdvancing] = useState<number | null>(null);
    const activeFilter = filters.status ?? 'all';

    const applyFilter = (status: string) => {
        router.get(route('seller.orders.index'), status === 'all' ? {} : { status }, { preserveScroll: true, replace: true });
    };

    const advanceStatus = (order: Order, next: string) => {
        setAdvancing(order.id);
        router.patch(route('seller.orders.status', order.id), { status: next }, { onFinish: () => setAdvancing(null) });
    };

    const totalRevenue = orders.data.reduce((s, o) => s + Number(o.total), 0);

    return (
        <SellerLayout breadcrumb="Orders">
            <Head title="Orders" />

            <div className="pg-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div className="pg-title">Orders</div>
                    <div className="pg-subtitle">Manage and fulfil customer orders</div>
                </div>
                <Link href={route('seller.products.index')} className="btn btn-secondary">
                    <Package className="h-4 w-4" /> My Products
                </Link>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                {[
                    { label: 'Total Orders', value: statusCounts.all ?? orders.meta?.total ?? 0, icon: <ShoppingCart className="h-5 w-5" /> },
                    { label: 'Pending',      value: statusCounts.pending ?? 0,             icon: <Clock className="h-5 w-5" /> },
                    { label: 'Shipped',      value: statusCounts.shipped ?? 0,             icon: <Truck className="h-5 w-5" /> },
                    { label: 'Revenue',      value: `₱${totalRevenue.toFixed(2)}`,         icon: <span style={{ fontSize: 14, fontWeight: 700 }}>₱</span> },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#e8f5e4' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {FILTER_TABS.map((tab) => {
                    const count = tab.key === 'all' ? (statusCounts.all ?? orders.meta?.total ?? 0) : (statusCounts[tab.key] ?? 0);
                    const active = activeFilter === tab.key;
                    return (
                        <button key={tab.key} onClick={() => applyFilter(tab.key)}
                            className={active ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}>
                            {tab.label} <span style={{ opacity: 0.7 }}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Orders */}
            {orders.data.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon"><ShoppingCart className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                        <div className="empty-state-title">No orders found</div>
                        <div className="empty-state-text">
                            {activeFilter === 'all' ? "You haven't received any orders yet." : `No ${activeFilter} orders.`}
                        </div>
                        {activeFilter !== 'all' && (
                            <button onClick={() => applyFilter('all')} className="btn btn-secondary" style={{ marginTop: 12 }}>View all orders</button>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.data.map((order) => {
                        const next = NEXT_STATUS[order.status];
                        const isAdvancing = advancing === order.id;
                        const dot = STATUS_DOT[order.status] ?? '#6b7e68';

                        return (
                            <div key={order.id} className="card">
                                <div className="card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                            <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                                {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '3px 9px', borderRadius: 20, border: `1px solid ${dot}44`, background: `${dot}18`, color: dot, fontWeight: 600 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                            {order.user && <div style={{ fontSize: 11, color: '#6b7e68' }}>{order.user.name}</div>}
                                        </div>
                                        <Link href={route('seller.orders.show', order.id)} className="btn btn-secondary btn-sm">
                                            <Eye className="h-3.5 w-3.5" /> View <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {order.items.slice(0, 4).map((item) => {
                                        const img = item.product?.images?.find(i => i.is_primary) ?? item.product?.images?.[0];
                                        return (
                                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #d4ddd2', padding: '6px 10px', background: '#f4f8f3', borderRadius: 6 }}>
                                            <div style={{ width: 28, height: 28, background: '#fff', border: '1px solid #d4ddd2', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                                {img ? (
                                                    <img src={img.url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Package className="h-3.5 w-3.5" style={{ color: '#6b7e68' }} />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 12, fontWeight: 500, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.name ?? 'Product'}</div>
                                                <div style={{ fontSize: 11, color: '#6b7e68' }}>{item.quantity} × ₱{Number(item.unit_price).toFixed(2)}</div>
                                            </div>
                                        </div>
                                        );
                                    })}
                                    {order.items.length > 4 && (
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px dashed #d4ddd2', padding: '6px 10px', fontSize: 12, color: '#6b7e68', borderRadius: 6 }}>
                                            +{order.items.length - 4} more
                                        </div>
                                    )}
                                </div>

                                {(next || order.status === 'pending') && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid #e8f0e6', background: '#f4f8f3', flexWrap: 'wrap', gap: 8 }}>
                                        <span style={{ fontSize: 11, color: '#6b7e68' }}>
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}{order.user?.email ? ` · ${order.user.email}` : ''}
                                        </span>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {order.status === 'pending' && (
                                                <button onClick={() => advanceStatus(order, 'cancelled')} disabled={isAdvancing} className="btn btn-danger btn-sm">
                                                    <X className="h-3.5 w-3.5" /> Cancel
                                                </button>
                                            )}
                                            {next && (
                                                <button onClick={() => advanceStatus(order, next.value)} disabled={isAdvancing} className="btn btn-primary btn-sm">
                                                    {next.value === 'confirmed' && <CheckCircle className="h-3.5 w-3.5" />}
                                                    {next.value === 'shipped'   && <Truck className="h-3.5 w-3.5" />}
                                                    {next.value === 'delivered' && <CheckCircle className="h-3.5 w-3.5" />}
                                                    {isAdvancing ? 'Updating…' : next.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {(orders.meta?.last_page ?? 1) > 1 && (
                <div className="pagination" style={{ marginTop: 20 }}>
                    <span className="pagination-info">Showing {orders.meta?.from}–{orders.meta?.to} of {orders.meta?.total} orders</span>
                    <div className="pagination-links">
                        {orders.links.map((link, i) =>
                            link.url ? (
                                <Link key={i} href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        )}
                    </div>
                </div>
            )}
        </SellerLayout>
    );
}
