import { Head, router } from '@inertiajs/react';
import { CheckCircle, Package, Smartphone } from 'lucide-react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string; total: number;
    customer: { name: string }; created_at: string;
}

const STATUS_FLOW = [
    { key: 'pending',    label: 'Pending',    next: 'picked_up',  action: 'Confirm Pickup' },
    { key: 'picked_up',  label: 'Picked Up',  next: 'on_the_way', action: 'Start Delivery' },
    { key: 'on_the_way', label: 'On the Way', next: 'delivered',  action: 'Mark Delivered' },
    { key: 'delivered',  label: 'Delivered',  next: null,         action: null },
];

export default function AppInteraction({ orders }: { orders: Order[] }) {
    const updateStatus = (id: number, status: string) =>
        router.patch(route('rider.app-interaction.update', id), { status }, { preserveScroll: true });

    return (
        <RiderLayout title="App / System Interaction">
            <Head title="App / System Interaction" />

            <div className="pg-header">
                <div className="pg-title">App Interaction</div>
                <div className="pg-subtitle">Manage delivery status updates through the system.</div>
            </div>

            {/* Status Flow */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Smartphone className="h-4 w-4" /> Delivery Status Flow
                    </span>
                </div>
                <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                    {STATUS_FLOW.map((s, i) => (
                        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="badge badge-green">{s.label}</span>
                            {i < STATUS_FLOW.length - 1 && <span style={{ color: '#6b7e68', fontSize: 16 }}>→</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* How-to */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">How to Use</span></div>
                <div className="card-body">
                    <div className="grid-3">
                        {[
                            { icon: '✅', title: 'Accept Requests',  desc: 'New delivery requests appear on your dashboard. Tap "Confirm Pickup" to accept.' },
                            { icon: '🔄', title: 'Update Status',    desc: 'Keep the system updated at every step: Picked Up → On the Way → Delivered.' },
                            { icon: '💬', title: 'Communicate',      desc: 'Use the platform chat or call feature to contact customers or support.' },
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

            {/* Orders */}
            <div className="card">
                <div className="card-header"><span className="card-title">Manage Order Status</span></div>
                <div className="card-body">
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No orders to manage</div>
                        </div>
                    ) : orders.map((order) => {
                        const current = STATUS_FLOW.find((s) => s.key === order.status);
                        return (
                            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e8f0e6', flexWrap: 'wrap', gap: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 12, color: '#6b7e68' }}>
                                        {order.customer?.name} · {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span className="badge badge-blue">{current?.label ?? order.status}</span>
                                    {current?.next && current.action ? (
                                        <button onClick={() => updateStatus(order.id, current.next!)} className="btn btn-primary btn-sm">
                                            <CheckCircle className="h-3.5 w-3.5" /> {current.action}
                                        </button>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                                            <CheckCircle className="h-4 w-4" /> Complete
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </RiderLayout>
    );
}
