import { Head, Link, router, usePage } from '@inertiajs/react';

interface Voucher {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_amount?: number;
    valid_to?: string;
    claim_limit?: number;
    claimed_count: number;
}

interface ClaimedVoucher {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_amount?: number;
    valid_to?: string;
    is_used: boolean;
    is_expired: boolean;
}

interface Props {
    available: Voucher[];
    claimed: ClaimedVoucher[];
}

const fmt = (n: number) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
const discountLabel = (v: { type: string; value: number }) =>
    v.type === 'percentage' ? `${v.value}% OFF` : `${fmt(v.value)} OFF`;

export default function VouchersIndex({ available, claimed }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const claim = (id: number) => router.post(route('customer.vouchers.claim'), { coupon_id: id });

    return (
        <>
            <Head title="My Vouchers" />
            <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Vouchers</h1>
                    <Link href={route('customer.cart.index')} style={{ fontSize: 13, color: '#4a7c42' }}>← Back to Cart</Link>
                </div>

                {flash?.success && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
                        {flash.error}
                    </div>
                )}

                {/* Available to Claim */}
                <section style={{ marginBottom: 36 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#374151' }}>Available to Claim</h2>
                    {available.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#9ca3af' }}>No vouchers available right now.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {available.map(v => (
                                <div key={v.id} style={{ display: 'flex', alignItems: 'center', border: '1px dashed #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
                                    <div style={{ background: '#4a7c42', color: '#fff', minWidth: 100, padding: '18px 12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{discountLabel(v)}</div>
                                        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.type}</div>
                                    </div>
                                    <div style={{ flex: 1, padding: '12px 16px' }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em' }}>{v.code}</div>
                                        {v.min_order_amount && (
                                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Min. order: {fmt(v.min_order_amount)}</div>
                                        )}
                                        {v.valid_to && (
                                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                                Expires: {new Date(v.valid_to).toLocaleDateString()}
                                            </div>
                                        )}
                                        {v.claim_limit && (
                                            <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>
                                                {v.claim_limit - v.claimed_count} left
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '0 16px' }}>
                                        <button
                                            onClick={() => claim(v.id)}
                                            style={{ background: '#4a7c42', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* My Claimed Vouchers */}
                <section>
                    <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#374151' }}>My Claimed Vouchers</h2>
                    {claimed.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#9ca3af' }}>You haven't claimed any vouchers yet.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {claimed.map(v => (
                                <div key={v.id} style={{ display: 'flex', alignItems: 'center', border: '1px dashed #d1d5db', borderRadius: 8, overflow: 'hidden', opacity: v.is_used || v.is_expired ? 0.5 : 1 }}>
                                    <div style={{ background: v.is_used || v.is_expired ? '#9ca3af' : '#4a7c42', color: '#fff', minWidth: 100, padding: '18px 12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{discountLabel(v)}</div>
                                        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.type}</div>
                                    </div>
                                    <div style={{ flex: 1, padding: '12px 16px' }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em' }}>{v.code}</div>
                                        {v.min_order_amount && (
                                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Min. order: {fmt(v.min_order_amount)}</div>
                                        )}
                                        {v.valid_to && (
                                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                                Expires: {new Date(v.valid_to).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '0 16px', fontSize: 12, fontWeight: 600 }}>
                                        {v.is_used ? (
                                            <span style={{ color: '#9ca3af' }}>Used</span>
                                        ) : v.is_expired ? (
                                            <span style={{ color: '#ef4444' }}>Expired</span>
                                        ) : (
                                            <span style={{ color: '#4a7c42' }}>Ready</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
