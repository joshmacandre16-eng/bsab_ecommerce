import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface ReturnOrder {
    id: number; order_number: string; status: string; return_reason?: string; total: number; created_at: string;
    user?: { name: string; email: string }; seller?: { name: string };
}

const STATUS_BADGE: Record<string, string> = {
    return_requested: 'badge-yellow', return_approved: 'badge-blue',
    return_rejected: 'badge-red', refunded: 'badge-green',
};

export default function AdminReturnsIndex({ orders, counts }: {
    orders: { data: ReturnOrder[]; links: any[]; meta: any };
    counts: { total: number; requested: number; approved: number; refunded: number };
}) {
    const updateStatus = (id: number, status: string) => router.patch(route('admin.orders.status', id), { status });

    return (
        <AdminLayout breadcrumb="Returns">
            <Head title="Returns & Refunds" />

            <div className="pg-header">
                <div className="pg-title">Returns & Refunds</div>
                <div className="pg-subtitle">Review and process return/refund requests</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total',     value: counts.total,     icon: '↩' },
                    { label: 'Requested', value: counts.requested, icon: '⏳' },
                    { label: 'Approved',  value: counts.approved,  icon: '✅' },
                    { label: 'Refunded',  value: counts.refunded,  icon: '💰' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header"><span className="card-title">Return Requests</span></div>
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Order', 'Customer', 'Seller', 'Reason', 'Amount', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {orders.data.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <Link href={route('admin.orders.show', order.id)} style={{ fontWeight: 600, textDecoration: 'none', color: '#2563eb' }}>
                                            #{order.order_number}
                                        </Link>
                                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{order.user?.name ?? '—'}</div>
                                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.user?.email}</div>
                                    </td>
                                    <td style={{ color: '#6b7280' }}>{order.seller?.name ?? '—'}</td>
                                    <td style={{ maxWidth: 180, color: '#6b7280', fontSize: 13 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.return_reason ?? '—'}</div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₱{Number(order.total).toFixed(2)}</td>
                                    <td><span className={`badge ${STATUS_BADGE[order.status] ?? 'badge-gray'}`}>{order.status.replace('_', ' ')}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {order.status === 'return_requested' && <>
                                                <button onClick={() => updateStatus(order.id, 'return_approved')} className="btn btn-success btn-sm">Approve</button>
                                                <button onClick={() => updateStatus(order.id, 'return_rejected')} className="btn btn-danger btn-sm">Reject</button>
                                            </>}
                                            {order.status === 'return_approved' && (
                                                <button onClick={() => updateStatus(order.id, 'refunded')} className="btn btn-primary btn-sm">Refund</button>
                                            )}
                                            <Link href={route('admin.orders.show', order.id)} className="btn btn-secondary btn-sm">View</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.data.length === 0 && <div className="empty-state"><div className="empty-state-icon">↩</div><div className="empty-state-title">No return requests</div></div>}
                </div>
                {orders.links && orders.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {orders.meta?.from}–{orders.meta?.to} of {orders.meta?.total}</span>
                        <div className="pagination-links">
                            {orders.links.map((l: any, i: number) => l.url
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
