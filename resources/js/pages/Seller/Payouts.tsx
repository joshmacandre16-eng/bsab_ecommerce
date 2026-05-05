import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface SellerProfile {
    store_name?: string; balance?: number; commission_rate?: number; payout_details?: Record<string, string>;
}
interface CreditedOrder {
    id: number; order_number: string; total: number; delivered_at: string; payment_method: string;
}
interface Props {
    seller?: SellerProfile;
    pendingCOD?: number;
    recentCredited?: CreditedOrder[];
}

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

const steps = [
    { icon: '🛒', title: 'Buyer places COD order',    desc: 'Customer selects Cash on Delivery at checkout.' },
    { icon: '📦', title: 'You prepare & ship',        desc: 'Pack the product and hand it to the rider for delivery.' },
    { icon: '🛵', title: 'Rider collects cash',       desc: 'Rider delivers the package and collects cash from the buyer.' },
    { icon: '🏦', title: 'Platform holds the money',  desc: 'Collected cash is remitted to the platform, not directly to you.' },
    { icon: '✅', title: 'You get paid',              desc: 'Once the order is marked Delivered, your balance is credited (minus commission).' },
];

export default function SellerPayouts({ seller, pendingCOD = 0, recentCredited = [] }: Props) {
    const commission = Number(seller?.commission_rate ?? 0.10);

    return (
        <SellerLayout breadcrumb="Payouts">
            <Head title="Payouts" />

            <div style={{ marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Payouts</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Your earnings and payout information</div>
            </div>

            {/* Balance cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 8 }}>Available Balance</div>
                    <div style={{ ...S, fontSize: 36, letterSpacing: '-1px', color: '#1a7a3c' }}>
                        ₱{Number(seller?.balance ?? 0).toFixed(2)}
                    </div>
                    <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 4 }}>Ready to withdraw</div>
                </div>

                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 8 }}>Pending COD</div>
                    <div style={{ ...S, fontSize: 36, letterSpacing: '-1px', color: '#f59e0b' }}>
                        ₱{Number(pendingCOD).toFixed(2)}
                    </div>
                    <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 4 }}>Awaiting delivery confirmation</div>
                </div>

                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 8 }}>Commission Rate</div>
                    <div style={{ ...S, fontSize: 36, letterSpacing: '-1px', color: '#6e6d67' }}>
                        {(commission * 100).toFixed(0)}%
                    </div>
                    <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 4 }}>Deducted per completed order</div>
                </div>
            </div>

            {/* COD flow */}
            <div style={{ border: '1px solid #e8e8e4', background: '#fff', marginBottom: 24 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #e8e8e4' }}>
                    <span style={{ ...M, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>How COD Payouts Work</span>
                </div>
                <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '12px 8px' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                            <div style={{ ...M, fontSize: 10, color: '#b0afa8', lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently credited */}
            <div style={{ border: '1px solid #e8e8e4', background: '#fff', marginBottom: 24 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #e8e8e4' }}>
                    <span style={{ ...M, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Recently Credited Orders</span>
                </div>
                <div style={{ padding: 18 }}>
                    {recentCredited.length === 0 ? (
                        <div style={{ ...M, fontSize: 13, color: '#b0afa8', textAlign: 'center', padding: '20px 0' }}>No credited orders yet.</div>
                    ) : recentCredited.map((o) => {
                        const payout = o.total * (1 - commission);
                        return (
                            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0ee' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>#{o.order_number}</div>
                                    <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 2 }}>
                                        {new Date(o.delivered_at).toLocaleDateString()} · {o.payment_method.toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ ...M, fontSize: 13, fontWeight: 600, color: '#1a7a3c' }}>+₱{payout.toFixed(2)}</div>
                                    <div style={{ ...M, fontSize: 10, color: '#b0afa8' }}>of ₱{Number(o.total).toFixed(2)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payout details */}
            {seller?.payout_details && Object.keys(seller.payout_details).length > 0 && (
                <div style={{ border: '1px solid #e8e8e4', background: '#fff', marginBottom: 24 }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #e8e8e4' }}>
                        <span style={{ ...M, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Payout Details</span>
                    </div>
                    <div style={{ padding: 18 }}>
                        {Object.entries(seller.payout_details).map(([key, val]) => (
                            <div key={key} style={{ marginBottom: 10 }}>
                                <div style={{ ...M, fontSize: 10, color: '#b0afa8', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>{val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Link href={route('seller.profile.index')}
                style={{ padding: '9px 16px', border: '1px solid #e8e8e4', fontSize: 13, color: '#6e6d67', textDecoration: 'none' }}>
                ◉ Update Store Profile
            </Link>
        </SellerLayout>
    );
}
