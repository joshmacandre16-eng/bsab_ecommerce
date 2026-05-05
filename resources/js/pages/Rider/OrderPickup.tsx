import { Head, router } from '@inertiajs/react';
import { CheckCircle, Clock, Hash, MapPin, Package } from 'lucide-react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string; total: number;
    payment_method: string; created_at: string;
    customer: { name: string; phone?: string };
    address?: { address_line1: string; city: string; barangay?: string };
    items: { id: number; quantity: number; product: { name: string } }[];
}

export default function OrderPickup({ orders }: { orders: Order[] }) {
    const confirm = (id: number) =>
        router.patch(route('rider.pickup.confirm', id), {}, { preserveScroll: true });

    return (
        <RiderLayout title="Order Pickup">
            <Head title="Order Pickup" />

            <div className="pg-header">
                <div className="pg-title">Order Pickup</div>
                <div className="pg-subtitle">Verify and confirm orders before heading out.</div>
            </div>

            {/* Checklist guide */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">Pickup Checklist</span></div>
                <div className="card-body">
                    <div className="grid-3">
                        {[
                            { step: '1', text: 'Go to the assigned merchant, warehouse, or restaurant' },
                            { step: '2', text: 'Verify order details — items, quantity, and order ID' },
                            { step: '3', text: 'Ensure items are complete and properly packed' },
                        ].map((s) => (
                            <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, border: '1px solid #d4ddd2', padding: 14, background: '#f4f8f3', borderRadius: 8 }}>
                                <div style={{ width: 24, height: 24, background: '#2d5a27', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                                <p style={{ fontSize: 13, color: '#4a6741' }}>{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Orders for Pickup ({orders.length})</span>
                    <span className="badge badge-yellow">Pending</span>
                </div>
                <div className="card-body">
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No orders assigned for pickup</div>
                        </div>
                    ) : orders.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <Hash className="h-4 w-4" style={{ color: '#6b7e68' }} />
                                        <span style={{ fontWeight: 600, fontSize: 14 }}>{order.order_number}</span>
                                        <span className="badge badge-yellow">{order.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7e68' }}>
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                            </div>
                            <div className="ap-order-body">
                                <div className="grid-2" style={{ marginBottom: 14 }}>
                                    <div style={{ border: '1px solid #d4ddd2', padding: 12, borderRadius: 8 }}>
                                        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 6 }}>Customer</div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{order.customer?.name}</div>
                                        {order.customer?.phone && <div style={{ fontSize: 12, color: '#6b7e68', marginTop: 2 }}>{order.customer.phone}</div>}
                                    </div>
                                    <div style={{ border: '1px solid #d4ddd2', padding: 12, borderRadius: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 6 }}>
                                            <MapPin className="h-3 w-3" /> Delivery Address
                                        </div>
                                        <div style={{ fontSize: 13, color: '#4a6741' }}>{order.address?.address_line1}, {order.address?.city}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 8 }}>Items ({order.items?.length})</div>
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4a6741', marginBottom: 4 }}>
                                        <CheckCircle className="h-3.5 w-3.5" style={{ color: '#d4ddd2' }} />
                                        <span>{item.product?.name}</span>
                                        <span style={{ color: '#6b7e68', fontSize: 11 }}>× {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="ap-order-foot">
                                <span style={{ fontSize: 12, color: '#6b7e68' }}>
                                    Payment: <strong>{order.payment_method?.toUpperCase()}</strong>
                                </span>
                                <button onClick={() => confirm(order.id)} className="btn btn-primary">
                                    <CheckCircle className="h-4 w-4" /> Confirm Pickup
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
