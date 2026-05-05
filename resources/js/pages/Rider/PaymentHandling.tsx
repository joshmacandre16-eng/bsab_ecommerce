import { Head, router } from '@inertiajs/react';
import { AlertTriangle, ArrowRight, CheckCircle, Package, Wallet } from 'lucide-react';
import RiderLayout from './Layout';

interface SellerProfile { store_name?: string }
interface Seller { name: string; seller_profile?: SellerProfile }
interface Order {
    id: number; order_number: string; status: string; total: number;
    payment_method: string; payment_collected: boolean; seller_credited: boolean;
    customer: { name: string }; seller?: Seller; delivered_at?: string;
}

export default function PaymentHandling({ codOrders, transferredOrders, summary }: {
    codOrders: Order[];
    transferredOrders: Order[];
    summary: { totalCOD: number; collectedToday: number; pendingCollection: number; transferredTotal: number };
}) {
    const markCollected = (id: number) =>
        router.patch(route('rider.payment.collect', id), {}, { preserveScroll: true });

    const pending  = codOrders.filter((o) => !o.payment_collected);
    const collected = codOrders.filter((o) => o.payment_collected && !o.seller_credited);

    return (
        <RiderLayout title="Payment Handling">
            <Head title="Payment Handling" />

            <div className="pg-header">
                <div className="pg-title">Payment Handling</div>
                <div className="pg-subtitle">Collect COD payments and remit to sellers upon delivery.</div>
            </div>

            {/* Summary */}
            <div className="stat-grid">
                {[
                    { label: 'Total COD',              value: `₱${summary.totalCOD.toFixed(2)}` },
                    { label: 'Collected Today',        value: `₱${summary.collectedToday.toFixed(2)}` },
                    { label: 'Pending Collection',     value: `₱${summary.pendingCollection.toFixed(2)}` },
                    { label: 'Transferred to Sellers', value: `₱${summary.transferredTotal.toFixed(2)}` },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Flow diagram */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">COD Payment Flow</span></div>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {[
                        { icon: '🛵', label: 'Rider Delivers' },
                        { icon: '💵', label: 'Collect Cash from Buyer' },
                        { icon: '✅', label: 'Mark Collected' },
                        { icon: '📦', label: 'Mark Delivered' },
                        { icon: '🏦', label: 'Platform Credits Seller' },
                    ].map((step, i, arr) => (
                        <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ textAlign: 'center', minWidth: 90 }}>
                                <div style={{ fontSize: 24, marginBottom: 4 }}>{step.icon}</div>
                                <div style={{ fontSize: 10, color: '#6b7e68', lineHeight: 1.4 }}>{step.label}</div>
                            </div>
                            {i < arr.length - 1 && <ArrowRight className="h-4 w-4" style={{ color: '#6b7e68', flexShrink: 0 }} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="ap-warn">
                <AlertTriangle className="h-5 w-5" />
                <div className="ap-warn-text">
                    <strong>Important:</strong> Cash collected from buyers is held by the platform and automatically transferred to the seller once you mark the order as delivered. Never keep collected cash beyond your shift.
                </div>
            </div>

            {/* Pending collection */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Wallet className="h-4 w-4" /> Pending Collection ({pending.length})
                    </span>
                </div>
                <div className="card-body">
                    {pending.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No pending collections</div>
                        </div>
                    ) : pending.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                    {order.seller && (
                                        <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                            Seller: {order.seller.seller_profile?.store_name ?? order.seller.name}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                    <button onClick={() => markCollected(order.id)} className="btn btn-primary btn-sm" style={{ marginTop: 6 }}>
                                        Mark Collected
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Collected — awaiting delivery confirmation */}
            {collected.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle className="h-4 w-4" /> Collected — Awaiting Delivery Confirmation ({collected.length})
                        </span>
                    </div>
                    <div className="card-body">
                        {collected.map((order) => (
                            <div key={order.id} className="ap-order-card">
                                <div className="ap-order-head">
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                        <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                        {order.seller && (
                                            <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                                Seller: {order.seller.seller_profile?.store_name ?? order.seller.name}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                        <div style={{ fontSize: 11, color: '#d97706', marginTop: 4 }}>⏳ Pending delivery mark</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transferred to sellers */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowRight className="h-4 w-4" /> Transferred to Sellers ({transferredOrders.length})
                    </span>
                </div>
                <div className="card-body">
                    {transferredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No transfers yet</div>
                        </div>
                    ) : transferredOrders.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                    {order.seller && (
                                        <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                            → {order.seller.seller_profile?.store_name ?? order.seller.name}
                                        </div>
                                    )}
                                    {order.delivered_at && (
                                        <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                            {new Date(order.delivered_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>₱{Number(order.total).toFixed(2)}</div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', marginTop: 4 }}>
                                        <CheckCircle className="h-3 w-3" /> Transferred
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
