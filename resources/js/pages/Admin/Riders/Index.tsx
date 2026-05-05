import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

interface Rider {
    id: number; name: string; email: string; phone?: string; is_active: boolean; created_at: string;
    rider_profile?: { vehicle_type?: string; license_number?: string };
}

export default function AdminRidersIndex({ riders, counts }: {
    riders: { data: Rider[]; links: any[]; meta: any };
    counts: { total: number; active: number; available: number; inactive: number };
}) {
    const toggleStatus = (id: number) => router.patch(route('admin.users.status', id));

    return (
        <AdminLayout breadcrumb="Riders">
            <Head title="Rider Management" />

            <div className="pg-header">
                <div className="pg-title">Rider Management</div>
                <div className="pg-subtitle">Monitor and manage delivery riders</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Riders', value: counts.total,     icon: '🛵' },
                    { label: 'Active',       value: counts.active,    icon: '✅' },
                    { label: 'With Profile', value: counts.available, icon: '📋' },
                    { label: 'Inactive',     value: counts.inactive,  icon: '⛔' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header"><span className="card-title">All Riders</span></div>
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>{['Rider', 'Vehicle', 'License', 'Status', 'Joined', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {riders.data.map(rider => (
                                <tr key={rider.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{rider.name}</div>
                                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{rider.email}</div>
                                        {rider.phone && <div style={{ fontSize: 12, color: '#9ca3af' }}>{rider.phone}</div>}
                                    </td>
                                    <td style={{ color: '#6b7280' }}>{rider.rider_profile?.vehicle_type ?? '—'}</td>
                                    <td style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{rider.rider_profile?.license_number ?? '—'}</td>
                                    <td><span className={`badge ${rider.is_active ? 'badge-green' : 'badge-red'}`}>{rider.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(rider.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <Link href={route('admin.users.show', rider.id)} className="btn btn-secondary btn-sm">View</Link>
                                            <button onClick={() => toggleStatus(rider.id)} className={`btn btn-sm ${rider.is_active ? 'btn-danger' : 'btn-success'}`}>
                                                {rider.is_active ? 'Suspend' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {riders.data.length === 0 && <div className="empty-state"><div className="empty-state-icon">🛵</div><div className="empty-state-title">No riders found</div></div>}
                </div>
                {riders.links && riders.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">Showing {riders.meta?.from}–{riders.meta?.to} of {riders.meta?.total}</span>
                        <div className="pagination-links">
                            {riders.links.map((l: any, i: number) => l.url
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
