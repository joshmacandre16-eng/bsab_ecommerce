import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, ExternalLink, XCircle } from 'lucide-react';
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

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        pending:  'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        declined: 'bg-red-100 text-red-700',
    };
    const icons: Record<string, React.ReactNode> = {
        pending:  <Clock className="h-3.5 w-3.5" />,
        approved: <CheckCircle className="h-3.5 w-3.5" />,
        declined: <XCircle className="h-3.5 w-3.5" />,
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold capitalize ${map[status]}`}>
            {icons[status]} {status}
        </span>
    );
};

const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-40 flex-shrink-0">{label}</span>
        <span className="text-sm text-gray-800 text-right">{value || '—'}</span>
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

    return (
        <AdminLayout breadcrumb="Seller Application">
            <Head title="Seller Application" />

            <div className="max-w-3xl">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.seller-applications.index')}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{application.full_name}</h1>
                            <p className="text-xs text-gray-400">Submitted {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    {statusBadge(application.status)}
                </div>

                <div className="space-y-4">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Information</h2>
                        </div>
                        <div className="px-5 py-1">
                            <Row label="Full Name"       value={application.full_name} />
                            <Row label="Date of Birth"   value={application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
                            <Row label="Contact Number"  value={application.contact_number} />
                            <Row label="Email"           value={application.email} />
                            <Row label="Gov. ID Type"    value={application.government_id_type?.replace('_', ' ')} />
                            <div className="flex justify-between py-2.5 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-40 flex-shrink-0">Gov. ID File</span>
                                <a href={`/storage/${application.government_id_path}`} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                    View Document <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Business Info */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Information</h2>
                        </div>
                        <div className="px-5 py-1">
                            <Row label="Business Name"    value={application.business_name} />
                            <Row label="Business Type"    value={application.business_type?.replace('_', ' ')} />
                            <Row label="TIN"              value={application.tin} />
                            <Row label="Business Address" value={application.business_address} />
                            {application.business_registration_path && (
                                <div className="flex justify-between py-2.5 border-b border-gray-100">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-40 flex-shrink-0">Biz. Registration</span>
                                    <a href={`/storage/${application.business_registration_path}`} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                        View Document <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
                        </div>
                        <div className="px-5 py-1">
                            <Row label="Account Name"  value={application.user.name} />
                            <Row label="Account Email" value={application.user.email} />
                            {application.reviewer && <Row label="Reviewed By" value={application.reviewer.name} />}
                            {application.reviewed_at && <Row label="Reviewed At" value={new Date(application.reviewed_at).toLocaleString()} />}
                            {application.admin_notes && <Row label="Admin Notes" value={application.admin_notes} />}
                        </div>
                    </div>

                    {/* Review actions — only for pending */}
                    {isPending && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Decision</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Approve */}
                                <form onSubmit={approve} className="space-y-3 p-4 rounded-lg border border-green-200 bg-green-50">
                                    <h3 className="text-sm font-semibold text-green-800 flex items-center gap-1.5">
                                        <CheckCircle className="h-4 w-4" /> Approve Application
                                    </h3>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                                        <textarea value={approveForm.data.admin_notes}
                                            onChange={e => approveForm.setData('admin_notes', e.target.value)}
                                            rows={2} placeholder="Welcome message or notes…"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                                    </div>
                                    <button type="submit" disabled={approveForm.processing}
                                        className="w-full py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                                        {approveForm.processing ? 'Approving…' : 'Approve'}
                                    </button>
                                </form>

                                {/* Decline */}
                                <form onSubmit={decline} className="space-y-3 p-4 rounded-lg border border-red-200 bg-red-50">
                                    <h3 className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
                                        <XCircle className="h-4 w-4" /> Decline Application
                                    </h3>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                                        <textarea value={declineForm.data.admin_notes}
                                            onChange={e => declineForm.setData('admin_notes', e.target.value)}
                                            rows={2} placeholder="Reason for declining…"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                                    </div>
                                    <button type="submit" disabled={declineForm.processing}
                                        className="w-full py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
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
