import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Coupon {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_amount?: number;
    max_discount?: number;
    usage_limit?: number;
    used_count: number;
    valid_from: string;
    valid_to: string;
    applicable_products: string | string[];
}

const isActive  = (c: Coupon) => { const now = new Date(); return now >= new Date(c.valid_from) && now <= new Date(c.valid_to); };
const isExpired = (c: Coupon) => new Date() > new Date(c.valid_to);

const statusBadge = (c: Coupon) => {
    if (isExpired(c)) return { cls: 'badge-red',    label: 'Expired' };
    if (isActive(c))  return { cls: 'badge-green',  label: 'Active' };
    return                   { cls: 'badge-yellow', label: 'Scheduled' };
};

const formatDiscount = (c: Coupon) => c.type === 'percentage' ? `${c.value}%` : `₱${c.value}`;

export default function CouponsIndex({ coupons }: { coupons: { data: Coupon[]; links: any[]; meta: any } }) {
    const [search, setSearch]       = useState('');
    const [statusFilter, setStatus] = useState('all');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this voucher?')) {
            router.delete(route('admin.coupons.destroy', id));
        }
    };

    const total    = coupons.meta?.total ?? coupons.data.length;
    const active   = coupons.data.filter(isActive).length;
    const expired  = coupons.data.filter(isExpired).length;
    const totalUses = coupons.data.reduce((sum, c) => sum + c.used_count, 0);

    const filtered = coupons.data.filter(c => {
        const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
        const s = statusBadge(c).label.toLowerCase();
        const matchStatus = statusFilter === 'all' || s === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AdminLayout breadcrumb="Coupons">
            <Head title="Voucher Management" />

            <div className="pg-header">
                <div>
                    <div className="pg-title">Voucher Management</div>
                    <div className="pg-subtitle">Create and manage discount vouchers</div>
                </div>
                <Link href={route('admin.coupons.create')} className="btn btn-primary btn-sm">
                    + Add Voucher
                </Link>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Vouchers', value: total,     icon: '🎟' },
                    { label: 'Active',         value: active,    icon: '✅' },
                    { label: 'Expired',        value: expired,   icon: '⛔' },
                    { label: 'Total Uses',     value: totalUses, icon: '📊' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Vouchers</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="Search vouchers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input"
                            style={{ width: 200 }}
                        />
                        <select
                            value={statusFilter}
                            onChange={e => setStatus(e.target.value)}
                            className="form-input"
                            style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{total} total</span>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Code', 'Discount', 'Usage', 'Valid Period', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {filtered.map(coupon => {
                                const { cls, label } = statusBadge(coupon);
                                const usagePct = coupon.usage_limit
                                    ? Math.min((coupon.used_count / coupon.usage_limit) * 100, 100)
                                    : null;

                                return (
                                    <tr key={coupon.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>{coupon.code}</div>
                                            <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                                {coupon.applicable_products === 'all' ? 'All Products' : 'Selected Products'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{formatDiscount(coupon)} <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: 12 }}>{coupon.type === 'percentage' ? 'off' : 'discount'}</span></div>
                                            {coupon.min_order_amount && <div style={{ fontSize: 12, color: '#9ca3af' }}>Min: ₱{coupon.min_order_amount}</div>}
                                            {coupon.max_discount && coupon.type === 'percentage' && <div style={{ fontSize: 12, color: '#9ca3af' }}>Max: ₱{coupon.max_discount}</div>}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 13 }}>{coupon.used_count} / {coupon.usage_limit ?? '∞'}</div>
                                            {usagePct !== null && (
                                                <div style={{ marginTop: 4, height: 4, borderRadius: 4, background: '#e5e7eb', width: 80 }}>
                                                    <div style={{ height: '100%', borderRadius: 4, background: 'var(--accent)', width: `${usagePct}%` }} />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontSize: 12, color: '#9ca3af' }}>
                                            <div>{new Date(coupon.valid_from).toLocaleDateString()}</div>
                                            <div>→ {new Date(coupon.valid_to).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${cls}`}>{label}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <Link href={route('admin.coupons.edit', coupon.id)} className="btn btn-secondary btn-sm">Edit</Link>
                                                <button onClick={() => handleDelete(coupon.id)} className="btn btn-danger btn-sm">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎟</div>
                            <div className="empty-state-title">No vouchers found</div>
                        </div>
                    )}
                </div>

                {coupons.links && coupons.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {coupons.meta?.from}–{coupons.meta?.to} of {coupons.meta?.total}</span>
                        <div className="pagination-links">
                            {coupons.links.map((l: any, i: number) => l.url
                                ? <Link key={i} href={l.url} className={l.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: l.label }} />
                                : <span key={i} dangerouslySetInnerHTML={{ __html: l.label }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
