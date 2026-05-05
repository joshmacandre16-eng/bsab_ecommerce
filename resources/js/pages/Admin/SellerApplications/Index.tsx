import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Application {
    id: number;
    full_name: string;
    business_name?: string;
    status: 'pending' | 'approved' | 'declined';
    created_at: string;
    user: { name: string };
}

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        pending:  'badge badge-yellow',
        approved: 'badge badge-green',
        declined: 'badge badge-red',
    };
    return (
        <span className={map[status] ?? 'badge badge-gray'}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function SellerApplicationsIndex({
    applications,
}: {
    applications: { data: Application[]; links: any[]; meta: any };
}) {
    const total = applications.meta?.total ?? applications.data.length;

    return (
        <AdminLayout breadcrumb="Seller Applications">
            <Head title="Seller Applications" />

            <div className="pg-header">
                <div className="pg-title">Seller Applications</div>
                <div className="pg-subtitle">{total} total applications</div>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Business</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {applications.data.length > 0 ? applications.data.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#1a2e1a' }}>{app.full_name}</div>
                                        <div style={{ fontSize: 12, color: '#6b7e68' }}>{app.user.name}</div>
                                    </td>
                                    <td style={{ color: '#374151' }}>{app.business_name || '—'}</td>
                                    <td>{statusBadge(app.status)}</td>
                                    <td style={{ fontSize: 12, color: '#6b7280' }}>
                                        {new Date(app.created_at).toLocaleDateString('en-GB').replace(/\//g, '/')}
                                    </td>
                                    <td>
                                        <Link
                                            href={route('admin.seller-applications.show', app.id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Eye size={13} /> View
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <div className="empty-state-title">No applications yet</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {applications.links && applications.data.length > 0 && (
                    <div className="pagination">
                        <span className="pagination-info">
                            Showing {applications.meta?.from}–{applications.meta?.to} of {applications.meta?.total} results
                        </span>
                        <div className="pagination-links">
                            {applications.links.map((l: any, i: number) =>
                                l.url
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
