import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface Coupon {
    id: number; code: string; type: string; value: number;
    valid_from?: string; valid_to?: string; usage_limit?: number;
    used_count: number; active: boolean;
}
interface Props { coupons: { data: Coupon[]; links: any[]; meta: any } }

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

export default function PromotionsIndex({ coupons }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Delete this voucher?')) router.delete(route('seller.promotions.destroy', id));
    };

    const toggleActive = (coupon: Coupon) => {
        router.patch(route('seller.promotions.toggle', coupon.id));
    };

    return (
        <SellerLayout breadcrumb="Promotions">
            <Head title="Promotions" />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Vouchers</div>
                    <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Manage discount voucher codes and offers</div>
                </div>
                <Link href={route('seller.promotions.create')}
                    style={{ padding: '9px 16px', background: '#0d0d0d', color: '#fff', fontSize: 13, textDecoration: 'none' }}>
                    + Create Voucher
                </Link>
            </div>

            <div style={{ border: '1px solid #e8e8e4' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
                        <thead>
                            <tr>
                                {['Code', 'Type', 'Value', 'Valid Period', 'Usage', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', padding: '10px 14px', borderBottom: '1px solid #e8e8e4', fontWeight: 400 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.data.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #e8e8e4' }}
                                    onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(cell => (cell.style.background = '#f5f5f3'))}
                                    onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(cell => (cell.style.background = ''))}>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ ...M, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>{c.code}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px', ...M, fontSize: 11, textTransform: 'uppercase', color: '#6e6d67' }}>{c.type}</td>
                                    <td style={{ padding: '12px 14px', ...M, fontSize: 13 }}>
                                        {c.type === 'percentage' ? `${c.value}%` : `₱${Number(c.value).toFixed(2)}`}
                                    </td>
                                    <td style={{ padding: '12px 14px', ...M, fontSize: 11, color: '#6e6d67' }}>
                                        {c.valid_from ? new Date(c.valid_from).toLocaleDateString() : '—'}
                                        {' → '}
                                        {c.valid_to ? new Date(c.valid_to).toLocaleDateString() : '—'}
                                    </td>
                                    <td style={{ padding: '12px 14px', ...M, fontSize: 12 }}>
                                        {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <button onClick={() => toggleActive(c)}
                                            style={{ ...M, fontSize: 10, textTransform: 'uppercase', padding: '3px 8px', background: c.active ? '#0d0d0d' : 'transparent', color: c.active ? '#fff' : '#b0afa8', border: c.active ? 'none' : '1px dotted #b0afa8', cursor: 'pointer' }}>
                                            {c.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <Link href={route('seller.promotions.edit', c.id)}
                                                style={{ ...M, fontSize: 11, color: '#6e6d67', textDecoration: 'none' }}>Edit</Link>
                                            <button onClick={() => handleDelete(c.id)}
                                                style={{ ...M, fontSize: 11, color: '#a32d2d', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {coupons.data.length === 0 && (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>
                        No vouchers yet.{' '}
                        <Link href={route('seller.promotions.create')} style={{ color: '#0d0d0d' }}>Create one →</Link>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
