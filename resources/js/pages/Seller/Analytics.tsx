import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface Monthly { month: string; sales: number; orders: number }
interface Props { monthlySales: Monthly[] }

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

export default function SellerAnalytics({ monthlySales }: Props) {
    const maxSales = Math.max(...monthlySales.map(m => m.sales), 1);
    const total = monthlySales.reduce((s, m) => s + m.sales, 0);

    return (
        <SellerLayout breadcrumb="Analytics">
            <Head title="Analytics" />

            <div style={{ marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Analytics</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Sales overview for the last 6 months</div>
            </div>

            <div style={{ border: '1px solid #e8e8e4', padding: 28, marginBottom: 24 }}>
                <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 4 }}>Total Revenue (6 months)</div>
                <div style={{ ...S, fontSize: 36, letterSpacing: '-1px', marginBottom: 24 }}>₱{total.toFixed(2)}</div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
                    {monthlySales.map((m) => (
                        <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ ...M, fontSize: 10, color: '#b0afa8' }}>
                                ₱{m.sales > 999 ? (m.sales / 1000).toFixed(1) + 'k' : m.sales.toFixed(0)}
                            </div>
                            <div style={{ width: '100%', background: '#0d0d0d', height: `${Math.max((m.sales / maxSales) * 120, 4)}px`, transition: 'height .3s' }} />
                            <div style={{ ...M, fontSize: 10, color: '#b0afa8' }}>{m.month}</div>
                            <div style={{ ...M, fontSize: 10, color: '#b0afa8' }}>{m.orders} orders</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                <Link href={route('seller.performance.index')}
                    style={{ padding: '9px 16px', border: '1px solid #e8e8e4', fontSize: 13, color: '#6e6d67', textDecoration: 'none' }}>
                    ↗ Full Performance Report
                </Link>
                <Link href={route('seller.payouts')}
                    style={{ padding: '9px 16px', border: '1px solid #e8e8e4', fontSize: 13, color: '#6e6d67', textDecoration: 'none' }}>
                    ₱ Payouts
                </Link>
            </div>
        </SellerLayout>
    );
}
