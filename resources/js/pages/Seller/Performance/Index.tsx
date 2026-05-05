import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface Monthly { month: string; revenue: number; orders: number }
interface TopProduct { id: number; name: string; price: number; stock_quantity: number; order_items_count: number }
interface RatingEntry { rating: number; count: number }
interface Props {
    monthly: Monthly[];
    topProducts: TopProduct[];
    ratings: Record<string, RatingEntry>;
}

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

export default function PerformanceIndex({ monthly, topProducts, ratings }: Props) {
    const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);
    const totalReviews = Object.values(ratings).reduce((s, r) => s + r.count, 0);
    const avgRating = totalReviews
        ? Object.values(ratings).reduce((s, r) => s + r.rating * r.count, 0) / totalReviews
        : 0;

    const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
    const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);

    return (
        <SellerLayout breadcrumb="Performance">
            <Head title="Performance" />

            <div style={{ marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Performance</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>6-month overview of your store</div>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: '6-Month Revenue', value: `₱${totalRevenue.toFixed(2)}` },
                    { label: 'Total Orders',    value: totalOrders },
                    { label: 'Avg Rating',      value: avgRating ? avgRating.toFixed(1) + ' ★' : '—' },
                ].map(({ label, value }) => (
                    <div key={label} style={{ border: '1px solid #e8e8e4', padding: 20 }}>
                        <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 8 }}>{label}</div>
                        <div style={{ ...S, fontSize: 26, letterSpacing: '-1px' }}>{value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Revenue Chart */}
                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 20 }}>Monthly Revenue</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
                        {monthly.map((m) => (
                            <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div style={{ ...M, fontSize: 9, color: '#b0afa8' }}>
                                    {m.revenue > 999 ? `₱${(m.revenue / 1000).toFixed(1)}k` : `₱${m.revenue.toFixed(0)}`}
                                </div>
                                <div style={{ width: '100%', background: '#0d0d0d', height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}px`, transition: 'height .3s' }} />
                                <div style={{ ...M, fontSize: 9, color: '#b0afa8', textAlign: 'center' }}>{m.month.split(' ')[0]}</div>
                                <div style={{ ...M, fontSize: 9, color: '#b0afa8' }}>{m.orders} ord</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 20 }}>Rating Breakdown</div>
                    {[5, 4, 3, 2, 1].map((r) => {
                        const count = ratings[r]?.count ?? 0;
                        const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <span style={{ ...M, fontSize: 12, width: 20, textAlign: 'right', color: '#f59e0b' }}>{'★'.repeat(r)}</span>
                                <div style={{ flex: 1, height: 8, background: '#f5f5f3', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: '#0d0d0d', transition: 'width .4s' }} />
                                </div>
                                <span style={{ ...M, fontSize: 11, color: '#b0afa8', width: 28, textAlign: 'right' }}>{count}</span>
                            </div>
                        );
                    })}
                    {totalReviews === 0 && <div style={{ fontSize: 13, color: '#b0afa8', textAlign: 'center', marginTop: 20 }}>No reviews yet</div>}
                </div>
            </div>

            {/* Top Products */}
            <div style={{ border: '1px solid #e8e8e4' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e8e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8' }}>Top Products by Sales</div>
                    <Link href={route('seller.products.index')} style={{ ...M, fontSize: 11, color: '#6e6d67', textDecoration: 'none' }}>View all →</Link>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr>
                            {['Product', 'Price', 'Stock', 'Units Sold'].map(h => (
                                <th key={h} style={{ textAlign: 'left', ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', padding: '10px 16px', borderBottom: '1px solid #e8e8e4', fontWeight: 400 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((p, i) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #e8e8e4' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ ...M, fontSize: 11, color: '#b0afa8', width: 20 }}>#{i + 1}</span>
                                        <Link href={route('seller.products.show', p.id)} style={{ fontWeight: 500, textDecoration: 'none', color: '#0d0d0d' }}>{p.name}</Link>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', ...M, fontSize: 12 }}>₱{Number(p.price).toFixed(2)}</td>
                                <td style={{ padding: '12px 16px', ...M, fontSize: 12, color: p.stock_quantity === 0 ? '#a32d2d' : '#6e6d67' }}>{p.stock_quantity}</td>
                                <td style={{ padding: '12px 16px', ...M, fontSize: 13, fontWeight: 700 }}>{p.order_items_count}</td>
                            </tr>
                        ))}
                        {topProducts.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>No sales data yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
