import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface Monthly { month: string; orders: number; revenue: number }
interface TopSeller { id: number; name: string; store_name?: string; total_revenue: number; total_orders: number }
interface TopProduct { id: number; name: string; sold: number; revenue: number }

export default function AdminReportsIndex({ monthly, topSellers, topProducts, summary }: {
    monthly: Monthly[];
    topSellers: TopSeller[];
    topProducts: TopProduct[];
    summary: { total_revenue: number; total_orders: number; total_customers: number; total_sellers: number };
}) {
    const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);
    const maxOrders  = Math.max(...monthly.map(m => m.orders), 1);

    return (
        <AdminLayout breadcrumb="Reports">
            <Head title="Reports & Analytics" />

            <div className="pg-header">
                <div className="pg-title">Reports & Analytics</div>
                <div className="pg-subtitle">Platform performance overview</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Revenue',  value: `₱${Number(summary.total_revenue).toFixed(2)}`, icon: '💰' },
                    { label: 'Total Orders',   value: summary.total_orders,                           icon: '🛒' },
                    { label: 'Customers',      value: summary.total_customers,                        icon: '👥' },
                    { label: 'Sellers',        value: summary.total_sellers,                          icon: '🏪' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Revenue chart */}
                <div className="card">
                    <div className="card-header"><span className="card-title">Monthly Revenue (12 months)</span></div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 130 }}>
                            {monthly.map(m => (
                                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 9, color: '#9ca3af', writingMode: 'horizontal-tb' }}>
                                        {m.revenue > 999 ? `₱${(m.revenue/1000).toFixed(1)}k` : `₱${m.revenue.toFixed(0)}`}
                                    </span>
                                    <div style={{ width: '100%', background: '#2563eb', borderRadius: '4px 4px 0 0', height: `${Math.max((m.revenue / maxRevenue) * 100, 3)}px`, transition: 'height .3s' }} />
                                    <span style={{ fontSize: 9, color: '#9ca3af' }}>{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders chart */}
                <div className="card">
                    <div className="card-header"><span className="card-title">Monthly Orders (12 months)</span></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {monthly.map(m => (
                            <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 11, color: '#9ca3af', width: 28, flexShrink: 0, fontFamily: 'monospace' }}>{m.month}</span>
                                <div style={{ flex: 1, height: 8, background: '#f1f3f7', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: '#7c3aed', borderRadius: 4, width: `${Math.max((m.orders / maxOrders) * 100, 2)}%`, transition: 'width .3s' }} />
                                </div>
                                <span style={{ fontSize: 11, color: '#6b7280', width: 28, textAlign: 'right', flexShrink: 0 }}>{m.orders}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid-2">
                {/* Top sellers */}
                <div className="card">
                    <div className="card-header"><span className="card-title">Top Sellers</span></div>
                    {topSellers.length === 0
                        ? <div className="empty-state"><div className="empty-state-text">No data yet</div></div>
                        : topSellers.map((s, i) => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.store_name ?? s.name}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.total_orders} orders</div>
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 13 }}>₱{Number(s.total_revenue).toFixed(2)}</span>
                            </div>
                        ))
                    }
                </div>

                {/* Top products */}
                <div className="card">
                    <div className="card-header"><span className="card-title">Top Products</span></div>
                    {topProducts.length === 0
                        ? <div className="empty-state"><div className="empty-state-text">No data yet</div></div>
                        : topProducts.map((p, i) => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f0f1f3' }}>
                                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.sold} sold</div>
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 13 }}>₱{Number(p.revenue).toFixed(2)}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </AdminLayout>
    );
}
