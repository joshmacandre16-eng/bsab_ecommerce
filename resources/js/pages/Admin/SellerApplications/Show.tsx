import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { FormEvent } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Application {
    id: number; full_name: string; date_of_birth: string; contact_number: string; email: string;
    government_id_type: string; government_id_path: string;
    business_name?: string; business_type?: string; business_registration_path?: string;
    tin?: string; business_address?: string;
    status: 'pending' | 'approved' | 'declined';
    admin_notes?: string; reviewed_at?: string;
    created_at: string;
    user: { name: string; email: string };
    reviewer?: { name: string };
}

const STATUS_BADGE: Record<string, string> = {
    pending:  'badge-yellow',
    approved: 'badge-green',
    declined: 'badge-red',
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: 'var(--text-muted)', width: 160, flexShrink: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
);

export default function SellerApplicationShow({ application }: { application: Application }) {
    const approveForm = useForm({ admin_notes: '' });
    const declineForm = useForm({ admin_notes: '' });

    const approve = (e: FormEvent) => {
        e.preventDefault();
        if (!confirm('Approve this application? The user will be granted seller access.')) return;
        approveForm.post(route('admin.seller-applications.approve', application.id));
    };

    const decline = (e: FormEvent) => {
        e.preventDefault();
        if (!confirm('Decline this application?')) return;
        declineForm.post(route('admin.seller-applications.decline', application.id));
    };

    const isPending = application.status === 'pending';
    const submittedDate = new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AdminLayout breadcrumb="Seller Application">
            <Head title="Seller Application" />

            {/* Page Header */}
            <div className="pg-header">
                <div>
                    <Link href={route('admin.seller-applications.index')} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        ← Back to Applications
                    </Link>
                    <div className="pg-title">{application.full_name}</div>
                    <div className="pg-subtitle">Submitted {submittedDate}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[application.status] ?? 'badge-gray'}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
            </div>

            {/* Stat Cards */}
            <div className="stat-grid">
                {[
                    { label: 'Status',        value: application.status.charAt(0).toUpperCase() + application.status.slice(1), icon: isPending ? '⏳' : application.status === 'approved' ? '✅' : '❌' },
                    { label: 'Business',      value: application.business_name ?? '—',   icon: '🏪' },
                    { label: 'Business Type', value: application.business_type?.replace(/_/g, ' ') ?? '—', icon: '📋' },
                    { label: 'Submitted',     value: submittedDate,                       icon: '📅' },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#f1f3f7' }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{ fontSize: 14 }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2">
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Personal Info */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Personal Information</span>
                        </div>
                        <div className="card-body">
                            <Field label="Full Name"      value={application.full_name} />
                            <Field label="Date of Birth"  value={application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
                            <Field label="Contact Number" value={application.contact_number} />
                            <Field label="Email"          value={application.email} />
                            <Field label="Gov. ID Type"   value={application.government_id_type?.replace(/_/g, ' ')} />
                            <div style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 6 }}>
                                <span style={{ color: 'var(--text-muted)', width: 160, flexShrink: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Gov. ID File</span>
                                <a href={`/storage/${application.government_id_path}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                    <ExternalLink size={12} /> View Document
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Business Info */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Business Information</span>
                        </div>
                        <div className="card-body">
                            <Field label="Business Name"    value={application.business_name} />
                            <Field label="Business Type"    value={application.business_type?.replace(/_/g, ' ')} />
                            <Field label="TIN"              value={application.tin} />
                            <Field label="Business Address" value={application.business_address} />
                            {application.business_registration_path && (
                                <div style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--text-muted)', width: 160, flexShrink: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Biz. Registration</span>
                                    <a href={`/storage/${application.business_registration_path}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                        <ExternalLink size={12} /> View Document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Account Info */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Account</span>
                        </div>
                        <div>
                            {[
                                ['Account Name',  application.user.name],
                                ['Account Email', application.user.email],
                                ...(application.reviewer ? [['Reviewed By', application.reviewer.name]] : []),
                                ...(application.reviewed_at ? [['Reviewed At', new Date(application.reviewed_at).toLocaleString()]] : []),
                                ...(application.admin_notes ? [['Admin Notes', application.admin_notes]] : []),
                            ].map(([label, value]) => (
                                <div key={label as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>{label as string}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Actions */}
                    {isPending && (
                        <div className="card">
                            <div className="card-header">
                                <span className="card-title">Review Decision</span>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Approve */}
                                <form onSubmit={approve} style={{ padding: 14, borderRadius: 8, border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <CheckCircle size={14} /> Approve Application
                                    </div>
                                    <textarea
                                        value={approveForm.data.admin_notes}
                                        onChange={e => approveForm.setData('admin_notes', e.target.value)}
                                        placeholder="Welcome message or notes (optional)…"
                                        rows={2}
                                        style={{ width: '100%', fontSize: 13, border: '1px solid #bbf7d0', borderRadius: 6, padding: '6px 10px', marginBottom: 10, resize: 'none', outline: 'none', background: '#fff' }}
                                    />
                                    <button type="submit" disabled={approveForm.processing} className="btn btn-success btn-sm" style={{ width: '100%' }}>
                                        {approveForm.processing ? 'Approving…' : 'Approve'}
                                    </button>
                                </form>

                                {/* Decline */}
                                <form onSubmit={decline} style={{ padding: 14, borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <XCircle size={14} /> Decline Application
                                    </div>
                                    <textarea
                                        value={declineForm.data.admin_notes}
                                        onChange={e => declineForm.setData('admin_notes', e.target.value)}
                                        placeholder="Reason for declining (optional)…"
                                        rows={2}
                                        style={{ width: '100%', fontSize: 13, border: '1px solid #fca5a5', borderRadius: 6, padding: '6px 10px', marginBottom: 10, resize: 'none', outline: 'none', background: '#fff' }}
                                    />
                                    <button type="submit" disabled={declineForm.processing} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                                        {declineForm.processing ? 'Declining…' : 'Decline'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
