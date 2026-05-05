import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Stats {
    todaySales: number;
    weekSales: number;
    monthSales: number;
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    totalCustomers: number;
    totalSellers: number;
    totalRiders: number;
    lowStock: number;
    failedPayments: number;
    newUsersToday: number;
    todayLogs: number;
}
interface ProductImage {
    url: string;
    is_primary: boolean;
}
interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    status: string;
    sku?: string;
    category?: { name: string };
    brand?: { name: string };
    images?: ProductImage[];
}
interface RoleBreakdown {
    role: string;
    count: number;
}
interface RevenueMonth {
    month: string;
    revenue: number;
}
interface RecentLog {
    id: number;
    action: string;
    ip_address: string | null;
    created_at: string;
    user: { name: string } | null;
}

const STATUS_BADGE: Record<string, string> = {
    pending: 'badge-yellow',
    confirmed: 'badge-blue',
    paid: 'badge-purple',
    shipped: 'badge-purple',
    delivered: 'badge-green',
    cancelled: 'badge-red',
};

function ProductCard({ product }: { product: Product }) {
    const [img, setImg] = useState(0);
    const images = product.images ?? [];
    const pi = images.findIndex((i) => i.is_primary);
    const sorted = pi > 0 ? [images[pi], ...images.filter((_, i) => i !== pi)] : images;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', background: '#f9fafb', aspectRatio: '4/3', overflow: 'hidden' }}>
                {sorted.length > 0 ? (
                    <img src={sorted[img]?.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: 0.2 }}>
                        📦
                    </div>
                )}
                <span
                    className={`badge ${product.status === 'active' ? 'badge-green' : 'badge-gray'}`}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                >
                    {product.status}
                </span>
                {product.stock_quantity === 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span className="badge badge-red">Out of Stock</span>
                    </div>
                )}
            </div>
            {sorted.length > 1 && (
                <div style={{ display: 'flex', gap: 6, padding: '8px 12px 0', overflowX: 'auto' }}>
                    {sorted.map((im, i) => (
                        <button
                            key={i}
                            onClick={() => setImg(i)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                overflow: 'hidden',
                                border: `2px solid ${i === img ? '#2d5a27' : '#e5e7eb'}`,
                                flexShrink: 0,
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            <img src={im.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>
            )}
            <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', fontSize: 11, color: '#6b7280' }}>
                    {product.category && <span>📁 {product.category.name}</span>}
                    {product.brand && <span>🏷 {product.brand.name}</span>}
                    {product.sku && <span style={{ color: '#9ca3af' }}>SKU: {product.sku}</span>}
                </div>
                <div
                    style={{
                        marginTop: 'auto',
                        paddingTop: 10,
                        borderTop: '1px solid #f0f1f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span style={{ fontSize: 16, fontWeight: 700 }}>₱{Number(product.price).toFixed(2)}</span>
                    <Link href={route('admin.products.edit', product.id)} className="btn btn-secondary btn-sm">
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard({
    stats,
    recentOrders,
    topProducts,
    salesChart,
    allProducts,
    revenueChart,
    roleBreakdown,
    recentLogs,
}: {
    stats: Stats;
    recentOrders: any[];
    topProducts: any[];
    salesChart: any[];
    allProducts: Product[];
    revenueChart: RevenueMonth[];
    roleBreakdown: RoleBreakdown[];
    recentLogs: RecentLog[];
}) {
    const maxSales = Math.max(...salesChart.map((d) => d.sales), 1);
    const maxRevenue = Math.max(...revenueChart.map((m) => m.revenue), 1);

    return (
        <AdminLayout breadcrumb="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="pg-header">
                <div className="pg-title">Dashboard</div>
                <div className="pg-subtitle">Full platform control — system overview</div>
            </div>

            {/* Primary stats */}
            <div className="stat-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: "Today's Sales", value: `₱${stats.todaySales.toFixed(2)}`, icon: '💰', bg: '#dcfce7' },
                    { label: 'This Week', value: `₱${stats.weekSales.toFixed(2)}`, icon: '📅', bg: '#dbeafe' },
                    { label: 'This Month', value: `₱${stats.monthSales.toFixed(2)}`, icon: '📆', bg: '#f3e8ff' },
                    { label: 'Total Revenue', value: `₱${stats.totalRevenue.toFixed(2)}`, icon: '💎', bg: '#fef9c3' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', bg: '#ffedd5' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', bg: '#fee2e2' },
                    { label: 'Customers', value: stats.totalCustomers, icon: '👥', bg: '#dcfce7' },
                    { label: 'Sellers', value: stats.totalSellers, icon: '🏪', bg: '#dbeafe' },
                    { label: 'Riders', value: stats.totalRiders, icon: '🛵', bg: '#f3e8ff' },
                    { label: 'Low Stock', value: stats.lowStock, icon: '⚠️', bg: '#fee2e2' },
                    { label: 'Failed Payments', value: stats.failedPayments, icon: '❌', bg: '#fee2e2' },
                    { label: 'New Users Today', value: stats.newUsersToday, icon: '🆕', bg: '#dcfce7' },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg }}>
                            {s.icon}
                        </div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Role breakdown */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <span className="card-title">User Role Breakdown</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                    {roleBreakdown.map((r, i) => (
                        <div
                            key={r.role}
                            style={{ padding: '20px', borderRight: i < roleBreakdown.length - 1 ? '1px solid #f0f1f3' : 'none', textAlign: 'center' }}
                        >
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-1px' }}>{r.count}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{r.role}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <span className="card-title">Quick Actions</span>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {[
                            { label: '👥 Users', href: route('admin.users.index') },
                            { label: '🛵 Riders', href: route('admin.riders.index') },
                            { label: '🛒 Orders', href: route('admin.orders.index') },
                            { label: '📦 Products', href: route('admin.products.index') },
                            { label: '🗂 Categories', href: route('admin.categories.index') },
                            { label: '🏷 Brands', href: route('admin.brands.index') },
                            { label: '💳 Payments', href: route('admin.payments.index') },
                            { label: '↩ Returns', href: route('admin.returns.index') },
                            { label: '📊 Reports', href: route('admin.reports.index') },
                            { label: '📋 Activity', href: route('admin.activity.index') },
                            { label: '⚙️ Settings', href: route('admin.settings.index') },
                        ].map((a) => (
                            <Link key={a.label} href={a.href} className="btn btn-secondary">
                                {a.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* 7-day sales chart */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Sales — Last 7 Days</span>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                            {salesChart.map((day, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 10, color: '#9ca3af' }}>
                                        ₱{day.sales > 999 ? (day.sales / 1000).toFixed(1) + 'k' : day.sales.toFixed(0)}
                                    </span>
                                    <div
                                        style={{
                                            width: '100%',
                                            background: '#2d5a27',
                                            borderRadius: '4px 4px 0 0',
                                            height: `${Math.max((day.sales / maxSales) * 100, 4)}px`,
                                            transition: 'height .3s',
                                        }}
                                    />
                                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{day.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 12-month revenue chart */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Revenue — Last 12 Months</span>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
                            {revenueChart.map((m, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 9, color: '#9ca3af' }}>
                                        {m.revenue > 999 ? `₱${(m.revenue / 1000).toFixed(1)}k` : `₱${m.revenue.toFixed(0)}`}
                                    </span>
                                    <div
                                        style={{
                                            width: '100%',
                                            background: '#4a7c42',
                                            borderRadius: '4px 4px 0 0',
                                            height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}px`,
                                            transition: 'height .3s',
                                        }}
                                    />
                                    <span style={{ fontSize: 9, color: '#9ca3af' }}>{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Top products */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Top Products</span>
                    </div>
                    {topProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-text">No sales data yet</div>
                        </div>
                    ) : (
                        topProducts.map((p, i) => (
                            <div
                                key={p.id}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f0f1f3' }}
                            >
                                <span
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: '#e8f5e4',
                                        color: '#2d5a27',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        {p.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.order_items_count} sold</div>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700 }}>₱{Number(p.price).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent activity logs */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Recent Activity</span>
                        <Link href={route('admin.activity.index')} className="btn btn-secondary btn-sm">
                            View all →
                        </Link>
                    </div>
                    {recentLogs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-text">No activity yet</div>
                        </div>
                    ) : (
                        recentLogs.map((log) => (
                            <div
                                key={log.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 20px',
                                    borderBottom: '1px solid #f0f1f3',
                                    gap: 12,
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <div
                                        style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        {log.action}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                                        {log.user?.name ?? 'System'} · {log.ip_address}
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>{new Date(log.created_at).toLocaleTimeString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent orders */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <span className="card-title">Recent Orders</span>
                    <Link href={route('admin.orders.index')} className="btn btn-secondary btn-sm">
                        View all →
                    </Link>
                </div>
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                {['Order', 'Customer', 'Status', 'Total', 'Date', ''].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ fontWeight: 600 }}>#{order.order_number}</td>
                                    <td style={{ color: '#6b7280' }}>{order.user?.name ?? '—'}</td>
                                    <td>
                                        <span className={`badge ${STATUS_BADGE[order.status] ?? 'badge-gray'}`}>{order.status}</span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₱{Number(order.total).toFixed(2)}</td>
                                    <td style={{ color: '#9ca3af', fontSize: 12 }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <Link href={route('admin.orders.show', order.id)} className="btn btn-secondary btn-sm">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-text">No orders yet</div>
                        </div>
                    )}
                </div>
            </div>

            {/* All products */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Products ({allProducts.length})</span>
                    <Link href={route('admin.products.create')} className="btn btn-primary btn-sm">
                        + Add Product
                    </Link>
                </div>
                <div className="card-body">
                    {allProducts.length > 0 ? (
                        <div className="grid-4">
                            {allProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <div className="empty-state-title">No products yet</div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
