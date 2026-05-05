import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Log {
    id: number; action: string; model_type: string | null; model_id: number | null;
    ip_address: string | null; user_agent: string | null; url: string | null;
    method: string | null; created_at: string;
    user: { id: number; name: string; email: string } | null;
}

const METHOD_BADGE: Record<string, string> = {
    GET: 'badge-blue', POST: 'badge-green', PATCH: 'badge-yellow',
    PUT: 'badge-yellow', DELETE: 'badge-red',
};

export default function ActivityIndex({ logs, counts, filters }: {
    logs: { data: Log[]; links: any[]; meta: any };
    counts: { total: number; today: number; gets: number; writes: number };
    filters: { search?: string; method?: string; date?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [method, setMethod] = useState(filters.method ?? '');
    const [date, setDate]     = useState(filters.date ?? '');

    const apply = () => router.get(route('admin.activity.index'), { search, method, date }, { preserveState: true });
    const clear = () => { setSearch(''); setMethod(''); setDate(''); router.get(route('admin.activity.index')); };

    return (
        <AdminLayout breadcrumb="Activity">
            <Head title="Activity Logs" />

            <div className="pg-header">
                <div className="pg-title">Activity Logs</div>
                <div className="pg-subtitle">Auto-tracked user activity across the platform</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Logs',    value: counts.total,  icon: '📋' },
                    { label: 'Today',         value: counts.today,  icon: '📅' },
                    { label: 'Page Views',    value: counts.gets,   icon: '👁' },
                    { label: 'Write Actions', value: counts.writes, icon: '✏️' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                {/* Filters */}
                <div className="filter-bar">
                    <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && apply()} placeholder="Search action or user…" />
                    <select className="form-input" value={method} onChange={e => setMethod(e.target.value)} style={{ flex: '0 0 auto', width: 'auto' }}>
                        <option value="">All Methods</option>
                        {['GET','POST','PATCH','PUT','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} style={{ flex: '0 0 auto', width: 'auto' }} />
                    <button className="btn btn-primary btn-sm" onClick={apply}>Filter</button>
                    <button className="btn btn-secondary btn-sm" onClick={clear}>Clear</button>
                </div>

                {/* Table */}
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['User', 'Method', 'Action / URL', 'Model', 'IP', 'Time'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {logs.data.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        {log.user
                                            ? <><div style={{ fontWeight: 500, fontSize: 13 }}>{log.user.name}</div><div style={{ fontSize: 11, color: '#9ca3af' }}>{log.user.email}</div></>
                                            : <span style={{ color: '#9ca3af', fontSize: 12 }}>Guest</span>
                                        }
                                    </td>
                                    <td>{log.method && <span className={`badge ${METHOD_BADGE[log.method] ?? 'badge-gray'}`}>{log.method}</span>}</td>
                                    <td style={{ maxWidth: 300 }}>
                                        <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.action}</div>
                                        {log.url && <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.url}</div>}
                                    </td>
                                    <td style={{ fontSize: 12, color: '#6b7280' }}>{log.model_type ? `${log.model_type} #${log.model_id}` : '—'}</td>
                                    <td style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{log.ip_address ?? '—'}</td>
                                    <td style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.data.length === 0 && <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No activity logs found</div></div>}
                </div>

                {/* Pagination */}
                {logs.links && logs.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {logs.meta?.from}–{logs.meta?.to} of {logs.meta?.total}</span>
                        <div className="pagination-links">
                            {logs.links.map((link: any, i: number) =>
                                link.url
                                    ? <Link key={i} href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    : <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
