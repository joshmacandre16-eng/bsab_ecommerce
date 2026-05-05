import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft, BadgeCheck, Camera, Calendar, KeyRound,
    LoaderCircle, Mail, MapPin, Phone, Save, ShieldCheck, User, XCircle,
} from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface AuthUser {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    date_of_birth?: string;
    gender?: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    is_verified?: boolean;
    is_active?: boolean;
    email_verified_at?: string;
    created_at: string;
    roles: string[];
}

interface ProfileAddress {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

interface Props {
    user: AuthUser;
    profileAddress?: ProfileAddress | null;
    stats: Record<string, any>;
    status?: string;
}

const ROLE_LABEL: Record<string, string> = {
    super_admin: 'Super Admin', admin: 'Admin', seller: 'Seller',
    vendor: 'Seller', customer: 'Customer', rider: 'Rider', support_agent: 'Support Agent',
};
const ROLE_COLOR: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700', admin: 'bg-blue-100 text-blue-700',
    seller: 'bg-purple-100 text-purple-700', vendor: 'bg-purple-100 text-purple-700',
    customer: 'bg-green-100 text-green-700', rider: 'bg-orange-100 text-orange-700',
    support_agent: 'bg-yellow-100 text-yellow-700',
};

function backRoute(role: string) {
    if (['seller', 'vendor'].includes(role)) return route('seller.dashboard');
    if (role === 'rider')                    return route('rider.dashboard');
    return route('dashboard');
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-1 truncate text-xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

function roleStats(role: string, stats: Record<string, any>) {
    if (role === 'customer') return [
        { label: 'Total Orders',   value: stats.total_orders ?? 0 },
        { label: 'Total Spent',    value: `₱${Number(stats.total_spent ?? 0).toFixed(2)}` },
        { label: 'Loyalty Points', value: stats.loyalty_points ?? 0 },
        { label: 'Favorites', value: stats.wishlist_count ?? 0 },
    ];
    if (['seller', 'vendor'].includes(role)) return [
        { label: 'Products', value: stats.total_products ?? 0 },
        { label: 'Orders',   value: stats.total_orders ?? 0 },
        { label: 'Balance',  value: `₱${Number(stats.balance ?? 0).toFixed(2)}` },
        { label: 'Store',    value: stats.store_name || '—' },
    ];
    if (role === 'rider') return [
        { label: 'Total Deliveries', value: stats.total_deliveries ?? 0 },
        { label: 'Delivered',        value: stats.delivered ?? 0 },
        { label: 'Vehicle',          value: stats.vehicle_type ?? '—' },
        { label: 'License',          value: stats.license_number ?? '—' },
    ];
    if (['admin', 'super_admin'].includes(role)) return [
        { label: 'Total Users',    value: stats.total_users ?? 0 },
        { label: 'Total Orders',   value: stats.total_orders ?? 0 },
        { label: 'Total Products', value: stats.total_products ?? 0 },
        { label: 'Revenue',        value: `₱${Number(stats.total_revenue ?? 0).toFixed(2)}` },
    ];
    if (role === 'support_agent') return [
        { label: 'Open Tickets',   value: stats.open_tickets ?? 0 },
        { label: 'Resolved',       value: stats.resolved_tickets ?? 0 },
        { label: 'Total Assigned', value: stats.total_assigned ?? 0 },
    ];
    return [];
}

export default function ProfilePage({ user, profileAddress, stats, status }: Props) {
    const role    = user.roles[0] ?? 'customer';
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [tab, setTab] = useState<'personal' | 'address' | 'password'>('personal');

    const infoForm = useForm({
        first_name:    user.first_name    ?? '',
        last_name:     user.last_name     ?? '',
        middle_name:   user.middle_name   ?? '',
        date_of_birth: user.date_of_birth ?? '',
        gender:        user.gender        ?? '',
        email:         user.email,
        phone:         user.phone         ?? '',
    });

    const addrForm = useForm({
        address_line1: profileAddress?.address_line1 ?? '',
        address_line2: profileAddress?.address_line2 ?? '',
        city:          profileAddress?.city          ?? '',
        state:         profileAddress?.state         ?? '',
        postal_code:   profileAddress?.postal_code   ?? '',
        country:       profileAddress?.country       ?? '',
    });

    const pwForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    const handleAvatar = (file: File | null) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        const fd = new FormData();
        fd.append('avatar', file);
        router.post(route('profile.avatar'), fd, { preserveScroll: true });
    };

    const submitInfo = (e: FormEvent) => {
        e.preventDefault();
        infoForm.patch(route('profile.update'), { preserveScroll: true });
    };

    const submitAddress = (e: FormEvent) => {
        e.preventDefault();
        addrForm.patch(route('profile.address'), { preserveScroll: true });
    };

    const submitPassword = (e: FormEvent) => {
        e.preventDefault();
        pwForm.put(route('password.update'), { preserveScroll: true, onSuccess: () => pwForm.reset() });
    };

    const avatarSrc = preview ?? (user.profile_picture ? `/storage/${user.profile_picture}` : null);
    const initials  = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const cards     = roleStats(role, stats);

    const inputCls = (err?: string) =>
        `w-full rounded-lg border px-3 py-2 text-sm focus:border-gray-800 focus:ring-1 focus:ring-gray-800 focus:outline-none ${err ? 'border-red-400' : 'border-gray-300'}`;

    return (
        <>
            <Head title="My Profile" />
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
                        <Link href={backRoute(role)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-base font-semibold text-gray-900">My Profile</h1>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">

                    {/* Flash */}
                    {status && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {status}
                        </div>
                    )}

                    {/* Hero card */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-600" />
                        <div className="px-6 pb-6">
                            <div className="relative -mt-12 mb-4 inline-block">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 text-2xl font-bold text-gray-500 shadow">
                                    {avatarSrc
                                        ? <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                                        : initials}
                                </div>
                                <button onClick={() => fileRef.current?.click()}
                                    className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-white shadow hover:bg-gray-700">
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={e => handleAvatar(e.target.files?.[0] ?? null)} />
                            </div>

                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                        {user.is_active && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                                    </div>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLOR[role] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {ROLE_LABEL[role] ?? role}
                                        </span>
                                        {user.email_verified_at ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                <ShieldCheck className="h-3 w-3" /> Email Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                                                <XCircle className="h-3 w-3" /> Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />
                                        Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</div>
                                    {user.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phone}</div>}
                                    {profileAddress?.city && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {[profileAddress.city, profileAddress.state, profileAddress.country].filter(Boolean).join(', ')}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> ID #{user.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    {cards.length > 0 && (
                        <div className={`grid gap-4 ${cards.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
                            {cards.map(c => <StatCard key={c.label} label={c.label} value={c.value} />)}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
                        {([
                            { key: 'personal', icon: <User className="h-4 w-4" />,    label: 'Personal Info' },
                            { key: 'address',  icon: <MapPin className="h-4 w-4" />,  label: 'Address' },
                            { key: 'password', icon: <KeyRound className="h-4 w-4" />, label: 'Password' },
                        ] as const).map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                                {t.icon} <span className="hidden sm:inline">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Personal Info */}
                    {tab === 'personal' && (
                        <form onSubmit={submitInfo} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Personal Information</h3>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" value={infoForm.data.first_name}
                                        onChange={e => infoForm.setData('first_name', e.target.value)}
                                        placeholder="Juan" className={inputCls(infoForm.errors.first_name)} />
                                    {infoForm.errors.first_name && <p className="mt-1 text-xs text-red-500">{infoForm.errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Middle Name <span className="text-gray-400">(optional)</span></label>
                                    <input type="text" value={infoForm.data.middle_name}
                                        onChange={e => infoForm.setData('middle_name', e.target.value)}
                                        placeholder="Santos" className={inputCls()} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" value={infoForm.data.last_name}
                                        onChange={e => infoForm.setData('last_name', e.target.value)}
                                        placeholder="Dela Cruz" className={inputCls(infoForm.errors.last_name)} />
                                    {infoForm.errors.last_name && <p className="mt-1 text-xs text-red-500">{infoForm.errors.last_name}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input type="date" value={infoForm.data.date_of_birth}
                                        onChange={e => infoForm.setData('date_of_birth', e.target.value)}
                                        className={inputCls(infoForm.errors.date_of_birth)} />
                                    {infoForm.errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{infoForm.errors.date_of_birth}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
                                    <select value={infoForm.data.gender}
                                        onChange={e => infoForm.setData('gender', e.target.value)}
                                        className={inputCls(infoForm.errors.gender)}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={infoForm.data.email}
                                        onChange={e => infoForm.setData('email', e.target.value)}
                                        className={inputCls(infoForm.errors.email)} />
                                    {infoForm.errors.email && <p className="mt-1 text-xs text-red-500">{infoForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" value={infoForm.data.phone}
                                        onChange={e => infoForm.setData('phone', e.target.value)}
                                        placeholder="+63 912 345 6789" className={inputCls()} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                <button type="submit" disabled={infoForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                                    {infoForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Changes
                                </button>
                                {infoForm.recentlySuccessful && <span className="text-sm text-green-600">Saved!</span>}
                            </div>
                        </form>
                    )}

                    {/* Address */}
                    {tab === 'address' && (
                        <form onSubmit={submitAddress} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Address Details</h3>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Address Line 1</label>
                                <input type="text" value={addrForm.data.address_line1}
                                    onChange={e => addrForm.setData('address_line1', e.target.value)}
                                    placeholder="House No., Street, Barangay"
                                    className={inputCls(addrForm.errors.address_line1)} />
                                {addrForm.errors.address_line1 && <p className="mt-1 text-xs text-red-500">{addrForm.errors.address_line1}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Address Line 2 <span className="text-gray-400">(optional)</span></label>
                                <input type="text" value={addrForm.data.address_line2}
                                    onChange={e => addrForm.setData('address_line2', e.target.value)}
                                    placeholder="Apartment, suite, unit, building, floor, etc."
                                    className={inputCls()} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" value={addrForm.data.city}
                                        onChange={e => addrForm.setData('city', e.target.value)}
                                        placeholder="Bacolod" className={inputCls(addrForm.errors.city)} />
                                    {addrForm.errors.city && <p className="mt-1 text-xs text-red-500">{addrForm.errors.city}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">State / Province</label>
                                    <input type="text" value={addrForm.data.state}
                                        onChange={e => addrForm.setData('state', e.target.value)}
                                        placeholder="Negros Occidental" className={inputCls(addrForm.errors.state)} />
                                    {addrForm.errors.state && <p className="mt-1 text-xs text-red-500">{addrForm.errors.state}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input type="text" value={addrForm.data.postal_code}
                                        onChange={e => addrForm.setData('postal_code', e.target.value)}
                                        placeholder="6100" className={inputCls(addrForm.errors.postal_code)} />
                                    {addrForm.errors.postal_code && <p className="mt-1 text-xs text-red-500">{addrForm.errors.postal_code}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                                    <input type="text" value={addrForm.data.country}
                                        onChange={e => addrForm.setData('country', e.target.value)}
                                        placeholder="Philippines" className={inputCls(addrForm.errors.country)} />
                                    {addrForm.errors.country && <p className="mt-1 text-xs text-red-500">{addrForm.errors.country}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                <button type="submit" disabled={addrForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                                    {addrForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Address
                                </button>
                                {addrForm.recentlySuccessful && <span className="text-sm text-green-600">Saved!</span>}
                            </div>
                        </form>
                    )}

                    {/* Password */}
                    {tab === 'password' && (
                        <form onSubmit={submitPassword} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Change Password</h3>
                            <p className="text-sm text-gray-500">Choose a strong password with at least 8 characters.</p>
                            {[
                                { key: 'current_password',      label: 'Current Password' },
                                { key: 'password',              label: 'New Password' },
                                { key: 'password_confirmation', label: 'Confirm New Password' },
                            ].map(({ key, label }) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                                    <input type="password" value={(pwForm.data as any)[key]}
                                        onChange={e => pwForm.setData(key as any, e.target.value)}
                                        className={inputCls((pwForm.errors as any)[key])} />
                                    {(pwForm.errors as any)[key] && <p className="mt-1 text-xs text-red-500">{(pwForm.errors as any)[key]}</p>}
                                </div>
                            ))}
                            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                <button type="submit" disabled={pwForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                                    {pwForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                                    Update Password
                                </button>
                                {pwForm.recentlySuccessful && <span className="text-sm text-green-600">Updated!</span>}
                            </div>
                        </form>
                    )}

                    {/* Account details read-only */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Account Details</h3>
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                            {[
                                { label: 'User ID',        value: `#${user.id}` },
                                { label: 'Role',           value: ROLE_LABEL[role] ?? role },
                                { label: 'Account Status', value: user.is_active ? 'Active' : 'Inactive' },
                                { label: 'Email Status',   value: user.email_verified_at ? `Verified on ${user.email_verified_at}` : 'Not verified' },
                                { label: 'Date of Birth',  value: user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                                { label: 'Gender',         value: user.gender ? user.gender.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
                                { label: 'Member Since',   value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                { label: 'Phone',          value: user.phone || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                                    <span className="text-gray-500">{label}</span>
                                    <span className="font-medium text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
