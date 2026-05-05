import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface RiderProfile {
    vehicle_type?: string;
    license_number?: string;
    status: 'pending' | 'approved' | 'declined';
    address?: string;
    phone?: string;
    date_of_birth?: string;
    tin?: string;
    bank_account?: string;
    id_document?: string;
    nbi_clearance?: string;
    vehicle_registration?: string;
    proof_of_insurance?: string;
    or_cr?: string;
    has_helmet?: boolean;
    has_phone_mount?: boolean;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    decline_reason?: string;
}

interface Rider {
    id: number; name: string; email: string; phone?: string;
    is_active: boolean; created_at: string;
    rider_profile?: RiderProfile;
}

function ApproveDeclineRow({ rider }: { rider: Rider }) {
    const [expanded, setExpanded] = useState(false);
    const approveForm = useForm({ reason: '' });
    const declineForm = useForm({ reason: '' });

    const profile = rider.rider_profile!;

    const doc = (path?: string | null, label = 'View') =>
        path ? <a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">{label}</a> : <span style={{ color: '#9ca3af' }}>—</span>;

    return (
        <>
            <tr>
                <td>
                    <div style={{ fontWeight: 500 }}>{rider.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{rider.email}</div>
                </td>
                <td style={{ color: '#6b7280' }}>{profile.vehicle_type ?? '—'}</td>
                <td style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{profile.license_number ?? '—'}</td>
                <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(rider.created_at).toLocaleDateString()}</td>
                <td>
                    <button onClick={() => setExpanded(v => !v)} className="btn btn-secondary btn-sm">
                        {expanded ? 'Hide' : 'Review'}
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={5} style={{ background: '#f9fafb', padding: '16px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                            {/* Personal */}
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Personal</div>
                                {[
                                    ['Address', profile.address],
                                    ['Phone', profile.phone],
                                    ['Date of Birth', profile.date_of_birth],
                                    ['Emergency Contact', profile.emergency_contact_name],
                                    ['Emergency Phone', profile.emergency_contact_phone],
                                    ['TIN', profile.tin],
                                    ['Bank Account', profile.bank_account],
                                ].map(([label, val]) => (
                                    <div key={label as string} style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 4 }}>
                                        <span style={{ color: '#6b7280', width: 140, flexShrink: 0 }}>{label}</span>
                                        <span style={{ color: '#111827' }}>{val || '—'}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Vehicle & Docs */}
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Vehicle & Documents</div>
                                {[
                                    ['Vehicle Type', profile.vehicle_type],
                                    ['License No.', profile.license_number],
                                    ['Has Helmet', profile.has_helmet ? 'Yes' : 'No'],
                                    ['Has Phone Mount', profile.has_phone_mount ? 'Yes' : 'No'],
                                ].map(([label, val]) => (
                                    <div key={label as string} style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 4 }}>
                                        <span style={{ color: '#6b7280', width: 140, flexShrink: 0 }}>{label}</span>
                                        <span style={{ color: '#111827' }}>{val || '—'}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                    {doc(profile.id_document, 'ID Doc')}
                                    {doc(profile.nbi_clearance, 'NBI')}
                                    {doc(profile.vehicle_registration, 'Vehicle Reg.')}
                                    {doc(profile.proof_of_insurance, 'Insurance')}
                                    {doc(profile.or_cr, 'OR/CR')}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <form onSubmit={e => { e.preventDefault(); if (confirm('Approve this rider?')) approveForm.post(route('admin.riders.approve', rider.id)); }}
                                style={{ padding: 14, borderRadius: 8, border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d', marginBottom: 8 }}>✅ Approve Rider</div>
                                <button type="submit" disabled={approveForm.processing}
                                    className="btn btn-success btn-sm" style={{ width: '100%' }}>
                                    {approveForm.processing ? 'Approving…' : 'Approve'}
                                </button>
                            </form>

                            <form onSubmit={e => { e.preventDefault(); if (confirm('Decline this rider?')) declineForm.post(route('admin.riders.decline', rider.id)); }}
                                style={{ padding: 14, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c', marginBottom: 8 }}>❌ Decline Rider</div>
                                <textarea
                                    value={declineForm.data.reason}
                                    onChange={e => declineForm.setData('reason', e.target.value)}
                                    placeholder="Reason (optional)…"
                                    rows={2}
                                    style={{ width: '100%', fontSize: 13, border: '1px solid #fca5a5', borderRadius: 6, padding: '6px 10px', marginBottom: 8, resize: 'none', outline: 'none' }}
                                />
                                <button type="submit" disabled={declineForm.processing}
                                    className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                                    {declineForm.processing ? 'Declining…' : 'Decline'}
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function AdminRidersIndex({ riders, counts, pending }: {
    riders: { data: Rider[]; links: any[]; meta: any };
    counts: { total: number; pending: number; active: number; inactive: number };
    pending: Rider[];
}) {
    const [tab, setTab] = useState<'approved' | 'pending'>(pending.length > 0 ? 'pending' : 'approved');
    const toggleStatus = (id: number) => router.patch(route('admin.users.status', id));

    const tabBtn = (t: typeof tab, label: string, count?: number) => (
        <button onClick={() => setTab(t)} style={{
            padding: '7px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            borderRadius: 6, border: 'none',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 6,
        }}>
            {label}
            {count !== undefined && count > 0 && (
                <span style={{
                    background: tab === t ? 'rgba(255,255,255,.25)' : '#fee2e2',
                    color: tab === t ? '#fff' : '#dc2626',
                    fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 7px',
                }}>{count}</span>
            )}
        </button>
    );

    return (
        <AdminLayout breadcrumb="Riders">
            <Head title="Rider Management" />

            <div className="pg-header">
                <div className="pg-title">Rider Management</div>
                <div className="pg-subtitle">Monitor and manage delivery riders</div>
            </div>

            <div className="stat-grid">
                {[
                    { label: 'Total Riders',       value: counts.total,   icon: '🛵' },
                    { label: 'Pending Approval',   value: counts.pending, icon: '⏳' },
                    { label: 'Active',             value: counts.active,  icon: '✅' },
                    { label: 'Inactive',           value: counts.inactive, icon: '⛔' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    {tabBtn('pending', 'Pending Approval', counts.pending)}
                    {tabBtn('approved', 'Approved Riders')}
                </div>

                {/* Pending tab */}
                {tab === 'pending' && (
                    <div className="table-wrap">
                        <table className="ap-table">
                            <thead>
                                <tr>{['Rider', 'Vehicle', 'License', 'Applied', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {pending.length > 0 ? pending.map(rider => (
                                    <ApproveDeclineRow key={rider.id} rider={rider} />
                                )) : (
                                    <tr><td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon">✅</div>
                                            <div className="empty-state-title">No pending applications</div>
                                        </div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Approved tab */}
                {tab === 'approved' && (
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
                        {riders.data.length === 0 && <div className="empty-state"><div className="empty-state-icon">🛵</div><div className="empty-state-title">No approved riders yet</div></div>}
                    </div>
                )}

                {tab === 'approved' && riders.links && riders.data.length > 0 && (
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
