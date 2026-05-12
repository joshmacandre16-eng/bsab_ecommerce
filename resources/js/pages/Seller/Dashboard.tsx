import SellerLayout from '@/layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Clock, DollarSign, Package, ShoppingCart, Star } from 'lucide-react';

interface Stats {
    total_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    low_stock: number;
    avg_rating: number;
}
interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    user?: { name: string };
    created_at: string;
}
interface Monthly {
    month: string;
    sales: number;
}
interface Props {
    stats: Stats;
    recentOrders: Order[];
    monthlySales: Monthly[];
}

const S = { fontFamily: "'DM Serif Display', serif" };
const M = { fontFamily: "'DM Mono', monospace" };

const STATUS_COLOR: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#22c55e',
    cancelled: '#ef4444',
};

export default function SellerDashboard({ stats, recentOrders, monthlySales }: Props) {
    const maxSales = Math.max(...monthlySales.map((m) => m.sales), 1);

    const statCards = [
        {
            label: 'Products',
            value: stats.total_products,
            link: route('seller.products.index'),
            accent: 'blue',
            icon: <Package size={20} color="#1a2e1a" />,
        },
        {
            label: 'Total Orders',
            value: stats.total_orders,
            link: route('seller.orders.index'),
            accent: 'green',
            icon: <ShoppingCart size={20} color="#1a2e1a" />,
        },
        {
            label: 'Pending',
            value: stats.pending_orders,
            link: route('seller.orders.index') + '?status=pending',
            accent: 'amber',
            icon: <Clock size={20} color="#1a2e1a" />,
        },
        {
            label: 'Revenue',
            value: `₱${stats.total_revenue.toFixed(2)}`,
            link: route('seller.payouts'),
            accent: 'lime',
            icon: <DollarSign size={20} color="#1a2e1a" />,
        },
        {
            label: 'Low Stock',
            value: stats.low_stock,
            link: route('seller.inventory.index') + '?filter=low_stock',
            accent: 'red',
            icon: <AlertTriangle size={20} color="#1a2e1a" />,
        },
        {
            label: 'Avg Rating',
            value: stats.avg_rating ? stats.avg_rating.toFixed(1) + ' ★' : '—',
            link: route('seller.reviews.index'),
            accent: 'purple',
            icon: <Star size={20} color="#1a2e1a" />,
        },
    ];

    const accentColors: Record<string, { accent: string; ci: string }> = {
        green: { accent: 'accent-green', ci: 'ci-green' },
        teal: { accent: 'accent-teal', ci: 'ci-teal' },
        blue: { accent: 'accent-blue', ci: 'ci-blue' },
        purple: { accent: 'accent-purple', ci: 'ci-purple' },
        lime: { accent: 'accent-lime', ci: 'ci-lime' },
        amber: { accent: 'accent-amber', ci: 'ci-amber' },
        red: { accent: 'accent-red', ci: 'ci-red' },
    };

    return (
        <SellerLayout breadcrumb="Dashboard">
            <Head title="Seller Dashboard" />

            <style>{`
                .seller-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .seller-stat-card {
                    border: 1px solid #e8e8e4;
                    padding: 20px;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    transition: background .15s, transform .15s, box-shadow .15s;
                    border-radius: 16px;
                    background: #fff;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                }

                .seller-stat-card:hover {
                    background: #f5f5f3;
                    transform: translateY(-1px);
                }

                .card-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                    color: #1a2e1a;
                }

                .card-icon svg {
                    width: 20px;
                    height: 20px;
                }

                .ci-green { background: #e8f5ea; }
                .ci-green svg { color: #227a3d; }
                .ci-teal { background: #ddf5f0; }
                .ci-teal svg { color: #0d6c62; }
                .ci-blue { background: #e7f0fb; }
                .ci-blue svg { color: #1a5fa8; }
                .ci-purple { background: #f0eafd; }
                .ci-purple svg { color: #5c35a0; }
                .ci-lime { background: #eef5d7; }
                .ci-lime svg { color: #4d7a0e; }
                .ci-amber { background: #fbeece; }
                .ci-amber svg { color: #b56b10; }
                .ci-red { background: #fce4e4; }
                .ci-red svg { color: #b52c2c; }

                .card-label {
                    font-family: 'DM Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #b0afa8;
                    margin-bottom: 8px;
                }

                .card-value {
                    font-family: 'DM Serif Display', serif;
                    font-size: 26px;
                    letter-spacing: -1px;
                }
            `}</style>

            <div style={{ marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 28, letterSpacing: '-0.5px', marginBottom: 4 }}>Dashboard</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Welcome back — here's your store overview</div>
            </div>

            {/* Stat Cards */}
            <div className="seller-stats-grid">
                {statCards.map((s) => {
                    const colors = accentColors[s.accent];
                    return (
                        <Link key={s.label} href={s.link} className="seller-stat-card">
                            <div className={`card-icon ${colors.ci}`}>{s.icon}</div>
                            <div className="card-label">{s.label}</div>
                            <div className="card-value">{s.value}</div>
                        </Link>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Sales Chart */}
                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 20 }}>
                        Monthly Revenue
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                        {monthlySales.map((m) => (
                            <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div style={{ ...M, fontSize: 9, color: '#b0afa8' }}>
                                    ₱{m.sales > 999 ? (m.sales / 1000).toFixed(1) + 'k' : m.sales.toFixed(0)}
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        background: '#0d0d0d',
                                        height: `${Math.max((m.sales / maxSales) * 90, 4)}px`,
                                        transition: 'height .3s',
                                    }}
                                />
                                <div style={{ ...M, fontSize: 9, color: '#b0afa8' }}>{m.month}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div style={{ border: '1px solid #e8e8e4' }}>
                    <div
                        style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid #e8e8e4',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8' }}>Recent Orders</div>
                        <Link href={route('seller.orders.index')} style={{ ...M, fontSize: 11, color: '#6e6d67', textDecoration: 'none' }}>
                            View all →
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>No orders yet</div>
                    ) : (
                        recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={route('seller.orders.show', order.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 20px',
                                    borderBottom: '1px solid #e8e8e4',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f3')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                            >
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>#{order.order_number}</div>
                                    <div style={{ ...M, fontSize: 11, color: '#b0afa8' }}>{order.user?.name ?? '—'}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ ...M, fontSize: 12 }}>₱{Number(order.total).toFixed(2)}</div>
                                    <span style={{ ...M, fontSize: 10, color: STATUS_COLOR[order.status] ?? '#b0afa8', textTransform: 'uppercase' }}>
                                        {order.status}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {[
                    { label: '+ Add Product', href: route('seller.products.create') },
                    { label: '↩ View Returns', href: route('seller.returns.index') },
                    { label: '% Promotions', href: route('seller.promotions.index') },
                    { label: '↗ Performance', href: route('seller.performance.index') },
                ].map((l) => (
                    <Link
                        key={l.label}
                        href={l.href}
                        style={{ padding: '8px 16px', border: '1px solid #e8e8e4', fontSize: 13, color: '#6e6d67', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f3')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                        {l.label}
                    </Link>
                ))}
            </div>
        </SellerLayout>
    );
}
