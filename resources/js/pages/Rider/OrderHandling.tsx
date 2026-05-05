import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Package, ThumbsUp } from 'lucide-react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string; total: number;
    payment_method: string; customer: { name: string };
    items: { id: number; quantity: number; product: { name: string; category?: { name: string } } }[];
}

const TIPS = [
    { icon: '📦', title: 'Handle with Care',      desc: 'Hold packages upright, avoid dropping or tossing items.' },
    { icon: '🌡️', title: 'Temperature Control',   desc: 'Keep food hot/cold as required. Use insulated bags for food orders.' },
    { icon: '🔒', title: 'Secure Items',           desc: 'Strap packages firmly to your bike to prevent shifting during transit.' },
    { icon: '🚫', title: 'No Tampering',           desc: 'Never open sealed packages. Report any pre-damaged items immediately.' },
    { icon: '💧', title: 'Weather Protection',     desc: 'Use waterproof bags during rain to protect items from moisture.' },
    { icon: '⚖️', title: 'Weight Distribution',   desc: 'Balance heavy items evenly on your carrier for safe riding.' },
];

export default function OrderHandling({ activeOrders }: { activeOrders: Order[] }) {
    const markHandled = (id: number) =>
        router.patch(route('rider.handling.update', id), { status: 'on_the_way' }, { preserveScroll: true });

    return (
        <RiderLayout title="Order Handling">
            <Head title="Order Handling" />

            <div className="pg-header">
                <div className="pg-title">Order Handling</div>
                <div className="pg-subtitle">Follow these guidelines to handle orders safely.</div>
            </div>

            {/* Tips */}
            <div className="ap-panel">
                <div className="ap-panel-head"><span className="ap-panel-title">Handling Guidelines</span></div>
                <div className="ap-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {TIPS.map((tip) => (
                        <div key={tip.title} className="ap-tip" style={{ flexDirection: 'column', gap: 6 }}>
                            <span className="ap-tip-icon">{tip.icon}</span>
                            <div className="ap-tip-title">{tip.title}</div>
                            <div className="ap-tip-desc">{tip.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="ap-warn">
                <AlertTriangle className="h-5 w-5" />
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#a32d2d', marginBottom: 2 }}>Report Damaged Items Immediately</div>
                    <div className="ap-warn-text">If you receive a damaged or incomplete order at pickup, take a photo and contact support before proceeding.</div>
                </div>
            </div>

            {/* Active Orders */}
            <div className="ap-panel">
                <div className="ap-panel-head"><span className="ap-panel-title">Orders In Your Hands ({activeOrders.length})</span></div>
                <div className="ap-panel-body">
                    {activeOrders.length === 0 ? (
                        <div className="ap-empty"><Package className="h-12 w-12" /><p>No active orders to handle</p></div>
                    ) : activeOrders.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                </div>
                                <span className="badge badge-blue">{order.status.replace('_', ' ')}</span>
                            </div>
                            <div className="ap-order-body">
                                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 8 }}>Items to Handle</div>
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}>
                                        <ThumbsUp className="h-3.5 w-3.5" style={{ color: '#1a7a3c' }} />
                                        <span style={{ color: '#4a6741' }}>{item.product?.name}</span>
                                        <span style={{ color: '#6b7e68', fontSize: 11 }}>× {item.quantity}</span>
                                        {item.product?.category && (
                                            <span className="badge badge-gray">{item.product.category.name}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="ap-order-foot">
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2e1a' }}>₱{Number(order.total).toFixed(2)}</div>
                                {order.status === 'picked_up' && (
                                    <button onClick={() => markHandled(order.id)} className="btn btn-primary">
                                        🛵 Start Delivery
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
