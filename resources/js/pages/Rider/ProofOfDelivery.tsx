import { Head, router } from '@inertiajs/react';
import { Camera, CheckCircle, Package, Upload } from 'lucide-react';
import { useState } from 'react';
import RiderLayout from './Layout';

interface Order {
    id: number; order_number: string; status: string;
    customer: { name: string }; proof_photo?: string; delivered_at?: string;
}

export default function ProofOfDelivery({ deliveredOrders, pendingProof }: {
    deliveredOrders: Order[]; pendingProof: Order[];
}) {
    const [uploading, setUploading] = useState<number | null>(null);
    const [photos, setPhotos] = useState<Record<number, File>>({});

    const handleFile = (id: number, file: File) => setPhotos((p) => ({ ...p, [id]: file }));

    const submitProof = (id: number) => {
        if (!photos[id]) return;
        setUploading(id);
        const form = new FormData();
        form.append('photo', photos[id]);
        router.post(route('rider.proof.upload', id), form, {
            forceFormData: true, preserveScroll: true,
            onFinish: () => setUploading(null),
        });
    };

    return (
        <RiderLayout title="Proof of Delivery">
            <Head title="Proof of Delivery" />

            <div className="pg-header">
                <div className="pg-title">Proof of Delivery</div>
                <div className="pg-subtitle">Upload delivery photos and confirm completed handoffs.</div>
            </div>

            {/* Guide */}
            <div className="ap-panel">
                <div className="ap-panel-head"><span className="ap-panel-title">Delivery Confirmation Steps</span></div>
                <div className="ap-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                        { icon: '📸', title: 'Capture Photo',  desc: "Take a clear photo of the delivered package at the customer's door or with the recipient." },
                        { icon: '✍️', title: 'Get Signature',  desc: 'Ask the customer to sign on the app or on paper as confirmation of receipt.' },
                        { icon: '✅', title: 'Mark Delivered', desc: 'Update the order status to "Delivered" in the system immediately after handoff.' },
                    ].map((t) => (
                        <div key={t.title} style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #d4ddd2', padding: 14, background: '#f4f8f3', borderRadius: 8 }}>
                            <span style={{ fontSize: 20 }}>{t.icon}</span>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a2e1a' }}>{t.title}</div>
                            <div style={{ fontSize: 12, color: '#6b7e68' }}>{t.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Proof Upload */}
            {pendingProof.length > 0 && (
                <div className="ap-panel">
                    <div className="ap-panel-head">
                        <span className="ap-panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Upload className="h-4 w-4" /> Upload Proof ({pendingProof.length})
                        </span>
                    </div>
                    <div className="ap-panel-body">
                        {pendingProof.map((order) => (
                            <div key={order.id} className="ap-order-card">
                                <div className="ap-order-head">
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                        <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                    </div>
                                    <span className="badge badge-yellow">Proof Needed</span>
                                </div>
                                <div className="ap-order-foot">
                                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                        <Camera className="h-4 w-4" />
                                        {photos[order.id] ? photos[order.id].name : 'Choose Photo'}
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFile(order.id, e.target.files[0])} />
                                    </label>
                                    <button onClick={() => submitProof(order.id)}
                                        disabled={!photos[order.id] || uploading === order.id}
                                        className="btn btn-primary"
                                        style={{ opacity: (!photos[order.id] || uploading === order.id) ? 0.5 : 1 }}>
                                        <CheckCircle className="h-4 w-4" />
                                        {uploading === order.id ? 'Uploading…' : 'Submit Proof'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed */}
            <div className="ap-panel">
                <div className="ap-panel-head">
                    <span className="ap-panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle className="h-4 w-4" /> Completed Deliveries ({deliveredOrders.length})
                    </span>
                </div>
                <div className="ap-panel-body">
                    {deliveredOrders.length === 0 ? (
                        <div className="ap-empty"><Package className="h-12 w-12" /><p>No completed deliveries yet</p></div>
                    ) : deliveredOrders.map((order) => (
                        <div key={order.id} className="ap-order-card">
                            <div className="ap-order-head">
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.order_number}</div>
                                    <div style={{ fontSize: 12, color: '#6b7e68' }}>{order.customer?.name}</div>
                                    {order.delivered_at && (
                                        <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>
                                            Delivered: {new Date(order.delivered_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                                        <CheckCircle className="h-3.5 w-3.5" /> Delivered
                                    </span>
                                    {order.proof_photo && (
                                        <a href={`/storage/${order.proof_photo}`} target="_blank" rel="noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7e68' }}>
                                            <Camera className="h-3.5 w-3.5" /> View Photo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
