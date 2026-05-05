import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface Log { id: number; quantity_change: number; reason: string; created_at: string }
interface Product { id: number; name: string; stock_quantity: number }
interface Props {
    product: Product;
    logs: { data: Log[]; links: any[]; meta: any };
}

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

export default function InventoryLogs({ product, logs }: Props) {
    return (
        <SellerLayout breadcrumb="Inventory Logs">
            <Head title={`Logs — ${product.name}`} />

            <div style={{ marginBottom: 24 }}>
                <Link href={route('seller.inventory.index')} style={{ ...M, fontSize: 12, color: '#b0afa8', textDecoration: 'none' }}>← Inventory</Link>
                <div style={{ ...S, fontSize: 24, letterSpacing: '-0.5px', marginTop: 8 }}>{product.name}</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Current stock: {product.stock_quantity}</div>
            </div>

            <div style={{ border: '1px solid #e8e8e4' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr>
                            {['Date', 'Change', 'Reason'].map(h => (
                                <th key={h} style={{ textAlign: 'left', ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', padding: '10px 16px', borderBottom: '1px solid #e8e8e4', fontWeight: 400 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.data.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #e8e8e4' }}>
                                <td style={{ padding: '12px 16px', ...M, fontSize: 12, color: '#6e6d67' }}>
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ ...M, fontSize: 13, fontWeight: 700, color: log.quantity_change >= 0 ? '#22c55e' : '#ef4444' }}>
                                        {log.quantity_change >= 0 ? '+' : ''}{log.quantity_change}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#6e6d67', textTransform: 'capitalize' }}>
                                    {log.reason?.replace(/_/g, ' ') ?? '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.data.length === 0 && (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>No logs yet.</div>
                )}
            </div>
        </SellerLayout>
    );
}
