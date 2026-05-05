import { Head } from '@inertiajs/react';
import { MessageCircle, Package, Phone } from 'lucide-react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string;
    customer: { name: string; phone?: string; email?: string };
    address?: { address_line1: string; city: string };
}

const TIPS = [
    { icon: '📞', title: 'Call if Needed',       desc: 'Contact the customer if the address is unclear or no one is home.' },
    { icon: '💬', title: 'Send Updates',          desc: 'Notify the customer when you are on the way or nearby.' },
    { icon: '🤝', title: 'Be Polite',             desc: 'Always greet customers professionally and handle concerns calmly.' },
    { icon: '📍', title: 'Coordinate Location',   desc: 'Ask for landmarks or a pin location if the address is hard to find.' },
    { icon: '🚫', title: 'No Personal Info',      desc: 'Never share your personal contact details with customers.' },
    { icon: '📝', title: 'Log Issues',            desc: 'Report any communication problems through the platform support.' },
];

const TEMPLATES = [
    { label: 'On the Way',      msg: "Hi! I'm your rider and I'm currently on my way to deliver your order. I'll be there shortly!" },
    { label: 'Nearby',          msg: "Hi! I'm already near your location. Please be ready to receive your order. Thank you!" },
    { label: 'Unclear Address', msg: "Hi! I'm having trouble finding your address. Could you please send me a landmark or pin your location? Thank you!" },
    { label: 'No Answer',       msg: "Hi! I tried to deliver your order but no one was available. Please contact me or support to reschedule." },
];

export default function CustomerCommunication({ activeOrders }: { activeOrders: Order[] }) {
    return (
        <RiderLayout title="Customer Communication">
            <Head title="Customer Communication" />

            <div className="pg-header">
                <div className="pg-title">Customer Communication</div>
                <div className="pg-subtitle">Guidelines and templates for communicating with customers.</div>
            </div>

            {/* Tips */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageCircle className="h-4 w-4" /> Communication Guidelines
                    </span>
                </div>
                <div className="card-body">
                    <div className="grid-3">
                        {TIPS.map((tip) => (
                            <div key={tip.title} style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #d4ddd2', padding: 14, background: '#f4f8f3', borderRadius: 8 }}>
                                <span style={{ fontSize: 20 }}>{tip.icon}</span>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a2e1a' }}>{tip.title}</div>
                                <div style={{ fontSize: 12, color: '#6b7e68' }}>{tip.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Message Templates */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">💬 Message Templates</span></div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {TEMPLATES.map((t) => (
                        <div key={t.label} style={{ border: '1px solid #d4ddd2', padding: 14, borderRadius: 8, background: '#f9fbf9' }}>
                            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 6, fontWeight: 600 }}>{t.label}</div>
                            <p style={{ fontSize: 13, color: '#4a6741', fontStyle: 'italic' }}>"{t.msg}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Order Contacts */}
            <div className="card">
                <div className="card-header"><span className="card-title">Active Order Contacts</span></div>
                <div className="card-body">
                    {activeOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Package className="mx-auto h-12 w-12" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No active orders</div>
                        </div>
                    ) : activeOrders.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#4a6741' }}>{order.customer?.name}</div>
                                    {order.address && (
                                        <div style={{ fontSize: 12, color: '#6b7e68', marginTop: 2 }}>
                                            📍 {order.address.address_line1}, {order.address.city}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {order.customer?.phone && (
                                        <a href={`tel:${order.customer.phone}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                                            <Phone className="h-3.5 w-3.5" /> Call
                                        </a>
                                    )}
                                    {order.customer?.phone && (
                                        <a href={`sms:${order.customer.phone}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                                            <MessageCircle className="h-3.5 w-3.5" /> SMS
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div style={{ padding: '8px 16px', borderTop: '1px solid #e8f0e6' }}>
                                <span className="badge badge-blue">{order.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
