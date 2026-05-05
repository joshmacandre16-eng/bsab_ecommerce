import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Building2, CheckCircle, Clock, FileText, Upload, User, XCircle } from 'lucide-react';
import { FormEvent, useRef } from 'react';

interface Existing {
    status: 'pending' | 'approved' | 'declined';
    admin_notes?: string;
    created_at: string;
}

interface Props {
    user: { name: string; email: string; phone?: string };
    existing?: Existing | null;
}

const field = (err?: string) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`;

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
            <span className="text-blue-600">{icon}</span>
            <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </div>
);

function StatusBanner({ existing }: { existing: Existing }) {
    const map = {
        pending:  { icon: <Clock className="h-5 w-5" />,        bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', label: 'Application Pending',  msg: 'Your application is under review. We will notify you once a decision has been made.' },
        approved: { icon: <CheckCircle className="h-5 w-5" />,  bg: 'bg-green-50 border-green-200',   text: 'text-green-800',  label: 'Application Approved', msg: 'Congratulations! Your seller application has been approved.' },
        declined: { icon: <XCircle className="h-5 w-5" />,      bg: 'bg-red-50 border-red-200',       text: 'text-red-800',    label: 'Application Declined', msg: existing.admin_notes ?? 'Your application was not approved at this time.' },
    };
    const s = map[existing.status];
    return (
        <div className={`rounded-xl border p-5 ${s.bg}`}>
            <div className={`flex items-center gap-2.5 font-semibold mb-1.5 ${s.text}`}>
                {s.icon} {s.label}
            </div>
            <p className={`text-sm ${s.text}`}>{s.msg}</p>
            <p className="text-xs text-gray-400 mt-2">Submitted on {new Date(existing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    );
}

export default function SellerApplicationCreate({ user, existing }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        full_name:             user.name ?? '',
        date_of_birth:         '',
        contact_number:        user.phone ?? '',
        email:                 user.email ?? '',
        government_id_type:    '',
        government_id:         null as File | null,
        business_name:         '',
        business_type:         '',
        business_registration: null as File | null,
        tin:                   '',
        business_address:      '',
    });

    const govIdRef  = useRef<HTMLInputElement>(null);
    const bizDocRef = useRef<HTMLInputElement>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('seller.application.store'), { forceFormData: true });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <>
            <Head title="Seller Application" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3.5">
                        <Link href={route('dashboard')} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">Seller Application</h1>
                            <p className="text-xs text-gray-400">Apply to become a seller on BSAB E-Commerce</p>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">

                    {/* Existing application status */}
                    {existing && <StatusBanner existing={existing} />}

                    {/* If pending or approved, don't show form */}
                    {existing && existing.status !== 'declined' ? (
                        <div className="text-center py-8">
                            <Link href={route('dashboard')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Back to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <>
                            {existing?.status === 'declined' && (
                                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                    Your previous application was declined. You may submit a new application below.
                                </div>
                            )}

                            {hasErrors && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-1">
                                        <AlertCircle className="h-4 w-4" /> Please fix the following errors:
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-red-600 space-y-0.5">
                                        {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* Personal Information */}
                                <Section icon={<User className="h-4 w-4" />} title="Personal Information">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <Label required>Full Name</Label>
                                            <input type="text" value={data.full_name}
                                                onChange={e => setData('full_name', e.target.value)}
                                                className={field(errors.full_name)} placeholder="Juan Santos Dela Cruz" required />
                                            {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
                                        </div>
                                        <div>
                                            <Label required>Date of Birth</Label>
                                            <input type="date" value={data.date_of_birth}
                                                onChange={e => setData('date_of_birth', e.target.value)}
                                                className={field(errors.date_of_birth)} required />
                                            {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
                                        </div>
                                        <div>
                                            <Label required>Contact Number</Label>
                                            <input type="tel" value={data.contact_number}
                                                onChange={e => setData('contact_number', e.target.value)}
                                                className={field(errors.contact_number)} placeholder="+63 912 345 6789" required />
                                            {errors.contact_number && <p className="mt-1 text-xs text-red-500">{errors.contact_number}</p>}
                                        </div>
                                        <div>
                                            <Label required>Email Address</Label>
                                            <input type="email" value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className={field(errors.email)} required />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <Label required>Government ID Type</Label>
                                            <select value={data.government_id_type}
                                                onChange={e => setData('government_id_type', e.target.value)}
                                                className={field(errors.government_id_type)} required>
                                                <option value="">Select ID type</option>
                                                <option value="passport">Passport</option>
                                                <option value="drivers_license">Driver's License</option>
                                                <option value="national_id">National ID (PhilSys)</option>
                                                <option value="sss">SSS ID</option>
                                                <option value="pagibig">Pag-IBIG ID</option>
                                                <option value="philhealth">PhilHealth ID</option>
                                                <option value="voters_id">Voter's ID</option>
                                            </select>
                                            {errors.government_id_type && <p className="mt-1 text-xs text-red-500">{errors.government_id_type}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label required>Upload Government ID</Label>
                                            <button type="button" onClick={() => govIdRef.current?.click()}
                                                className={`w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 text-sm transition-colors ${data.government_id ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500'}`}>
                                                {data.government_id
                                                    ? <><CheckCircle className="h-4 w-4" /> {data.government_id.name}</>
                                                    : <><Upload className="h-4 w-4" /> Click to upload (JPG, PNG, PDF — max 5MB)</>
                                                }
                                            </button>
                                            <input ref={govIdRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                                                onChange={e => setData('government_id', e.target.files?.[0] ?? null)} />
                                            {errors.government_id && <p className="mt-1 text-xs text-red-500">{errors.government_id}</p>}
                                        </div>
                                    </div>
                                </Section>

                                {/* Business Information */}
                                <Section icon={<Building2 className="h-4 w-4" />} title="Business Information (Optional)">
                                    <p className="text-xs text-gray-400 -mt-1">Fill this section if you have a registered business. Leave blank if you are an individual seller.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Business Name</Label>
                                            <input type="text" value={data.business_name}
                                                onChange={e => setData('business_name', e.target.value)}
                                                className={field()} placeholder="e.g. Juan's Farm Supply" />
                                        </div>
                                        <div>
                                            <Label>Business Type</Label>
                                            <select value={data.business_type}
                                                onChange={e => setData('business_type', e.target.value)}
                                                className={field()}>
                                                <option value="">Select type</option>
                                                <option value="sole_proprietor">Sole Proprietor</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="corporation">Corporation</option>
                                                <option value="cooperative">Cooperative</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Tax Identification Number (TIN)</Label>
                                            <input type="text" value={data.tin}
                                                onChange={e => setData('tin', e.target.value)}
                                                className={field()} placeholder="000-000-000-000" />
                                        </div>
                                        <div>
                                            <Label>Business Address</Label>
                                            <input type="text" value={data.business_address}
                                                onChange={e => setData('business_address', e.target.value)}
                                                className={field()} placeholder="Street, Barangay, City, Province" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label>Business Registration Document</Label>
                                            <p className="text-xs text-gray-400 mb-1.5">DTI, SEC, or other registration (JPG, PNG, PDF — max 5MB)</p>
                                            <button type="button" onClick={() => bizDocRef.current?.click()}
                                                className={`w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 text-sm transition-colors ${data.business_registration ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500'}`}>
                                                {data.business_registration
                                                    ? <><CheckCircle className="h-4 w-4" /> {data.business_registration.name}</>
                                                    : <><Upload className="h-4 w-4" /> Click to upload</>
                                                }
                                            </button>
                                            <input ref={bizDocRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                                                onChange={e => setData('business_registration', e.target.files?.[0] ?? null)} />
                                        </div>
                                    </div>
                                </Section>

                                {/* Disclaimer */}
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 flex gap-2">
                                    <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <span>By submitting this application, you confirm that all information provided is accurate and complete. False information may result in permanent disqualification.</span>
                                </div>

                                <div className="flex justify-end gap-3 pb-6">
                                    <Link href={route('dashboard')}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </Link>
                                    <button type="submit" disabled={processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                        {processing ? 'Submitting…' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
