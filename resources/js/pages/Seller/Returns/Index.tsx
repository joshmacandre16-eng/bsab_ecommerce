import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/layouts/SellerLayout';

interface OrderItem { id: number; product?: { name: string }; quantity: number }
interface Order {
    id: number; order_number: string; status: string; total: number;
    user?: { name: string; email: string }; items: OrderItem[]; created_at: string;
    notes?: string;
}
interface Props {
    orders: { data: Order[]; links: any[]; meta: any };
}

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

const STATUS_COLOR: Record<string, string> = {
    return_requested: '#f59e0b',
    returned: '#8b5cf6',
    refunded: '#22c55e',
    return_rejected: '#ef4444',
};

export default function ReturnsIndex({ orders }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const processReturn = (orderId: number, action: 'approve' | 'reject') => {
        if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this return?`)) return;
        setProcessing(orderId);
        router.patch(route('seller.returns.process', orderId), { action }, {
            onFinish: () => setProcessing(null),
        });
    };

    const filterByStatus = (status: string) => {
        router.get(route('seller.returns.index'), status ? { status } : {}, { preserveScroll: true, replace: true });
    };

    return (
        <SellerLayout breadcrumb="Returns">
            <Head title="Returns & Refunds" />

            <div style={{ marginBottom: 24 }}>
                <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Returns & Refunds</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Manage return requests from customers</div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                    { key: '', label: 'All' },
                    { key: 'return_requested', label: 'Requested' },
                    { key: 'returned', label: 'Returned' },
                    { key: 'refunded', label: 'Refunded' },
                    { key: 'return_rejected', label: 'Rejected' },
                ].map(({ key, label }) => (
                    <button key={key} onClick={() => filterByStatus(key)}
                        style={{ padding: '6px 14px', border: '1px solid #e8e8e4', background: '#fff', fontSize: 12, ...M, cursor: 'pointer' }}>
                        {label}
                    </button>
                ))}
            </div>

            {orders.data.length === 0 ? (
                <div style={{ border: '2px dashed #e8e8e4', padding: '80px 0', textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>
                    No return requests found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.data.map((order) => {
                        const dot = STATUS_COLOR[order.status] ?? '#b0afa8';
                        const isProcessing = processing === order.id;
                        const canProcess = order.status === 'return_requested';

                        return (
                            <div key={order.id} style={{ border: '1px solid #e8e8e4' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e8e8e4', flexWrap: 'wrap', gap: 10 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                        <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 2 }}>
                                            {order.user?.name} · {order.user?.email}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <span style={{ ...M, fontSize: 10, textTransform: 'uppercase', padding: '3px 8px', border: `1px solid ${dot}33`, background: `${dot}11`, color: dot }}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                        <div style={{ ...M, fontSize: 13 }}>₱{Number(order.total).toFixed(2)}</div>
                                        <Link href={route('seller.orders.show', order.id)}
                                            style={{ ...M, fontSize: 11, color: '#6e6d67', textDecoration: 'none', padding: '5px 10px', border: '1px solid #e8e8e4' }}>
                                            View Order
                                        </Link>
                                    </div>
                                </div>

                                <div style={{ padding: '12px 18px' }}>
                                    <div style={{ fontSize: 13, color: '#6e6d67', marginBottom: 8 }}>
                                        {order.items.map(i => `${i.product?.name ?? 'Product'} ×${i.quantity}`).join(', ')}
                                    </div>
                                    {order.notes && (
                                        <div style={{ ...M, fontSize: 12, color: '#6e6d67', background: '#f5f5f3', padding: '8px 12px', borderLeft: '3px solid #e8e8e4' }}>
                                            "{order.notes}"
                                        </div>
                                    )}
                                </div>

                                {canProcess && (
                                    <div style={{ display: 'flex', gap: 10, padding: '10px 18px', borderTop: '1px solid #e8e8e4', background: '#f5f5f3' }}>
                                        <button onClick={() => processReturn(order.id, 'approve')} disabled={isProcessing}
                                            style={{ padding: '7px 16px', background: '#0d0d0d', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}>
                                            ✓ Approve Refund
                                        </button>
                                        <button onClick={() => processReturn(order.id, 'reject')} disabled={isProcessing}
                                            style={{ padding: '7px 16px', background: '#fdf5f5', color: '#a32d2d', border: '1px solid #e8c8c8', fontSize: 12, cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}>
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {orders.meta?.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 20 }}>
                    {orders.links.map((link: any, i: number) =>
                        link.url ? (
                            <a key={i} href={link.url}
                                style={{ padding: '5px 10px', border: '1px solid #e8e8e4', fontSize: 12, ...M, background: link.active ? '#0d0d0d' : '#fff', color: link.active ? '#fff' : '#6e6d67', textDecoration: 'none', marginLeft: -1 }}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} style={{ padding: '5px 10px', border: '1px solid #e8e8e4', fontSize: 12, ...M, color: '#e8e8e4', marginLeft: -1 }}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    )}
                </div>
            )}
        </SellerLayout>
    );
}
