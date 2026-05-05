import { Head, router } from '@inertiajs/react';
import { CheckCircle, Clock, MapPin, Navigation, Package } from 'lucide-react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string; total: number;
    payment_method: string; customer: { name: string; phone?: string };
    address?: { address_line1: string; barangay?: string; city: string; zip_code?: string };
    created_at: string;
}

export default function NavigationDelivery({ activeDeliveries }: { activeDeliveries: Order[] }) {
    const markDelivered = (id: number) =>
        router.patch(route('rider.navigation.deliver', id), {}, { preserveScroll: true });

    const openMaps = (address: string) =>
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');

    return (
        <RiderLayout title="Navigation & Delivery">
            <Head title="Navigation & Delivery" />

            <div className="pg-header">
                <div className="pg-title">Navigation & Delivery</div>
                <div className="pg-subtitle">Navigate to customers and mark deliveries complete.</div>
            </div>

            {/* Tips */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">Delivery Tips</span></div>
                <div className="card-body">
                    <div className="grid-3">
                        {[
                            { icon: '🗺️', title: 'Use GPS Navigation', desc: 'Always use the map link to get the fastest route to the customer.' },
                            { icon: '⏱️', title: 'Deliver On Time',    desc: 'Aim to deliver within the expected time frame to maintain your SLA.' },
                            { icon: '🚦', title: 'Adapt to Conditions', desc: 'Adjust your route for traffic, road closures, or bad weather.' },
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

            {/* Active Deliveries */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Navigation className="h-4 w-4" /> Active Deliveries ({activeDeliveries.length})
                    </span>
                </div>
                <div className="card-body">
                    {activeDeliveries.length === 0 ? (
                        <div className="empty-state"><div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div><div className="empty-state-text">No active deliveries right now</div></div>
                    ) : activeDeliveries.map((order) => {
                        const fullAddress = [order.address?.address_line1, order.address?.barangay, order.address?.city, order.address?.zip_code].filter(Boolean).join(', ');
                        return (
                            <div key={order.id} className="ap-order-card">
                                <div className="ap-order-head">
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                        <div style={{ fontSize: 13, color: '#4a6741' }}>{order.customer?.name}</div>
                                        {order.customer?.phone && (
                                            <a href={`tel:${order.customer.phone}`} style={{ fontSize: 12, color: '#6b7e68' }}>
                                                📞 {order.customer.phone}
                                            </a>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                        <span className="badge badge-gray">{order.payment_method?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="ap-order-body">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, border: '1px solid #d4ddd2', padding: 12, marginBottom: 12, borderRadius: 8 }}>
                                        <MapPin className="h-4 w-4" style={{ color: '#b91c1c', flexShrink: 0, marginTop: 1 }} />
                                        <div style={{ flex: 1, fontSize: 13, color: '#4a6741' }}>{fullAddress || 'No address provided'}</div>
                                        {fullAddress && (
                                            <button onClick={() => openMaps(fullAddress)} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Open Maps</button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7e68' }}>
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="ap-order-foot">
                                    <span />
                                    <button onClick={() => markDelivered(order.id)} className="btn btn-primary">
                                        <CheckCircle className="h-4 w-4" /> Mark Delivered
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </RiderLayout>
    );
}
