import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface SellerProfile {
    store_name: string; store_description?: string;
    commission_rate?: number; balance?: number;
}
interface Props { profile: SellerProfile }

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };
const inputStyle = { width: '100%', border: '1px solid #e8e8e4', padding: '9px 12px', fontSize: 14, outline: 'none' };

export default function SellerProfilePage({ profile }: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        store_name:        profile.store_name ?? '',
        store_description: profile.store_description ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('seller.profile.update'));
    };

    return (
        <SellerLayout breadcrumb="Store Profile">
            <Head title="Store Profile" />

            {/* Switch to Customer banner */}
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">🛍</span>
                    <div>
                        <p className="text-sm font-semibold text-green-800">You are in Seller Mode</p>
                        <p className="text-xs text-green-600">Switch back to browse and shop as a customer</p>
                    </div>
                </div>
                <Link
                    href={route('role.switch')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
                >
                    Switch to Customer
                </Link>
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Store Profile</div>
                <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Manage your store information</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
                <form onSubmit={submit} style={{ border: '1px solid #e8e8e4', padding: 28 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 20 }}>Store Details</div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ ...M, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e6d67', display: 'block', marginBottom: 6 }}>Store Name</label>
                        <input value={data.store_name} onChange={e => setData('store_name', e.target.value)} style={inputStyle} />
                        {errors.store_name && <div style={{ color: '#a32d2d', fontSize: 12, marginTop: 4 }}>{errors.store_name}</div>}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ ...M, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6e6d67', display: 'block', marginBottom: 6 }}>Store Description</label>
                        <textarea value={data.store_description} onChange={e => setData('store_description', e.target.value)}
                            rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
                        {errors.store_description && <div style={{ color: '#a32d2d', fontSize: 12, marginTop: 4 }}>{errors.store_description}</div>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button type="submit" disabled={processing}
                            style={{ padding: '10px 24px', background: '#0d0d0d', color: '#fff', border: 'none', fontSize: 13, cursor: 'pointer', opacity: processing ? 0.6 : 1 }}>
                            {processing ? 'Saving…' : 'Save Changes'}
                        </button>
                        {recentlySuccessful && <span style={{ ...M, fontSize: 12, color: '#22c55e' }}>✓ Saved</span>}
                    </div>
                </form>

                {/* Account Info */}
                <div style={{ border: '1px solid #e8e8e4', padding: 24 }}>
                    <div style={{ ...M, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 16 }}>Account Info</div>
                    {[
                        { label: 'Commission Rate', value: profile.commission_rate ? `${profile.commission_rate}%` : '—' },
                        { label: 'Balance', value: profile.balance ? `₱${Number(profile.balance).toFixed(2)}` : '₱0.00' },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e8e8e4' }}>
                            <div style={{ ...M, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 4 }}>{label}</div>
                            <div style={{ ...S, fontSize: 20 }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </SellerLayout>
    );
}
