import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface Transaction {
    id: number; order_id: number; amount: number; status: string;
    gateway: string; transaction_id?: string; created_at: string;
    order?: { order_number: string; user?: { name: string } };
}

const STATUS_BADGE: Record<string, string> = {
    paid: 'badge-green', pending: 'badge-yellow', failed: 'badge-red', refunded: 'badge-gray',
};

export default function AdminPaymentsIndex({ transactions, stats }: {
    transactions: { data: Transaction[]; links: any[]; meta: any };
    stats: { total: number; paid: number; pending: number; failed: number; revenue: number };
}) {
    return (
        <AdminLayout breadcrumb="Payments">
            <Head title="Payment Monitoring" />

            <div className="pg-header">
                <div className="pg-title">Payment Monitoring</div>
                <div className="pg-subtitle">Track transactions and payment statuses</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total',   value: stats.total,                              icon: '💳' },
                    { label: 'Paid',    value: stats.paid,                               icon: '✅' },
                    { label: 'Pending', value: stats.pending,                            icon: '⏳' },
                    { label: 'Failed',  value: stats.failed,                             icon: '❌' },
                    { label: 'Revenue', value: `₱${Number(stats.revenue).toFixed(2)}`,  icon: '💰' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header"><span className="card-title">Transactions</span></div>
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Order', 'Customer', 'Gateway', 'Reference', 'Amount', 'Status', 'Date'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {transactions.data.map(tx => (
                                <tr key={tx.id}>
                                    <td>
                                        <Link href={route('admin.orders.show', tx.order_id)} style={{ fontWeight: 600, textDecoration: 'none', color: '#2563eb' }}>
                                            #{tx.order?.order_number ?? tx.order_id}
                                        </Link>
                                    </td>
                                    <td style={{ color: '#6b7280' }}>{tx.order?.user?.name ?? '—'}</td>
                                    <td><span className="badge badge-gray" style={{ textTransform: 'uppercase' }}>{tx.gateway}</span></td>
                                    <td style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{tx.transaction_id ?? '—'}</td>
                                    <td style={{ fontWeight: 600 }}>₱{Number(tx.amount).toFixed(2)}</td>
                                    <td><span className={`badge ${STATUS_BADGE[tx.status] ?? 'badge-gray'}`}>{tx.status}</span></td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.data.length === 0 && <div className="empty-state"><div className="empty-state-icon">💳</div><div className="empty-state-title">No transactions found</div></div>}
                </div>
                {transactions.links && transactions.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {transactions.meta?.from}–{transactions.meta?.to} of {transactions.meta?.total}</span>
                        <div className="pagination-links">
                            {transactions.links.map((l: any, i: number) => l.url
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
