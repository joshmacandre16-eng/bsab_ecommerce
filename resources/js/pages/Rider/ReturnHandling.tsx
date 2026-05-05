import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Package, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import RiderLayout from './Layout';

interface ReturnOrder {
    id: number; order_number: string; status: string; total: number;
    reason?: string; customer: { name: string }; created_at: string;
}

const RETURN_REASONS = [
    'Customer not available', 'Wrong address', 'Customer refused delivery',
    'Order damaged', 'Order cancelled by customer', 'Other',
];

export default function ReturnHandling({ returnOrders, failedDeliveries }: {
    returnOrders: ReturnOrder[]; failedDeliveries: ReturnOrder[];
}) {
    const [selectedReason, setSelectedReason] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState<number | null>(null);

    const submitReturn = (id: number) => {
        if (!selectedReason[id]) return;
        setSubmitting(id);
        router.patch(route('rider.returns.submit', id), { reason: selectedReason[id] }, {
            preserveScroll: true, onFinish: () => setSubmitting(null),
        });
    };

    return (
        <RiderLayout title="Return Handling">
            <Head title="Return Handling" />

            <div className="pg-header">
                <div className="pg-title">Return Handling</div>
                <div className="pg-subtitle">Log and process failed deliveries and returns.</div>
            </div>

            {/* Guide */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">Return Guidelines</span></div>
                <div className="card-body">
                    <div className="grid-3">
                        {[
                            { icon: '📦', title: 'Keep Items Safe',  desc: 'Secure returned items properly. Do not open or tamper with packages.' },
                            { icon: '📝', title: 'Log the Reason',   desc: 'Always record the reason for return before heading back.' },
                            { icon: '🏪', title: 'Return to Origin', desc: 'Bring items back to the merchant, warehouse, or designated return point.' },
                        ].map((t) => (
                            <div key={t.title} style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #d4ddd2', padding: 14, background: '#f4f8f3', borderRadius: 8 }}>
                                <span style={{ fontSize: 20 }}>{t.icon}</span>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a2e1a' }}>{t.title}</div>
                                <div style={{ fontSize: 12, color: '#6b7e68' }}>{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="ap-warn">
                <AlertTriangle className="h-5 w-5" />
                <div className="ap-warn-text">
                    <strong>Important:</strong> All failed deliveries must be reported within 30 minutes. Unreported returns may affect your performance score.
                </div>
            </div>

            {/* Failed Deliveries */}
            {failedDeliveries.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AlertTriangle className="h-4 w-4" style={{ color: '#b91c1c' }} /> Failed Deliveries — Action Required ({failedDeliveries.length})
                        </span>
                    </div>
                    <div className="card-body">
                        {failedDeliveries.map((order) => (
                            <div key={order.id} className="ap-order-card">
                                <div className="ap-order-head">
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                        <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                </div>
                                <div className="ap-order-foot">
                                    <select value={selectedReason[order.id] ?? ''} onChange={(e) => setSelectedReason((p) => ({ ...p, [order.id]: e.target.value }))}
                                        className="form-input" style={{ flex: 1 }}>
                                        <option value="">Select return reason…</option>
                                        {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <button onClick={() => submitReturn(order.id)}
                                        disabled={!selectedReason[order.id] || submitting === order.id}
                                        className="btn btn-danger"
                                        style={{ opacity: (!selectedReason[order.id] || submitting === order.id) ? 0.5 : 1 }}>
                                        {submitting === order.id ? 'Submitting…' : 'Submit Return'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Return History */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RotateCcw className="h-4 w-4" /> Return History ({returnOrders.length})
                    </span>
                </div>
                <div className="card-body">
                    {returnOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No return history</div>
                        </div>
                    ) : returnOrders.map((order) => (
                        <div key={order.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e8f0e6', gap: 12 }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                {order.reason && <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>Reason: {order.reason}</div>}
                                <div style={{ fontSize: 11, color: '#6b7e68' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                                    <CheckCircle className="h-3 w-3" /> Returned
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
