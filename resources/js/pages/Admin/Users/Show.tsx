import { Head, Link, router } from '@inertiajs/react';
import { User, ShoppingCart, Shield, UserCheck, UserX, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Order { id: number; order_number: string; status: string; total: number; created_at: string }
interface UserProfile {
    id: number; name: string; email: string; phone?: string; is_active: boolean; created_at: string;
    roles: Array<{ name: string }>;
    customer_profile?: { loyalty_points: number; total_spent: number };
    vendor_profile?: { store_name: string; balance: number };
    orders: Order[];
}

const ROLE_COLOR: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-800', admin: 'bg-purple-100 text-purple-800',
    seller: 'bg-blue-100 text-blue-800', customer: 'bg-green-100 text-green-800',
    support_agent: 'bg-yellow-100 text-yellow-800',
};

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800', shipped: 'bg-purple-100 text-purple-800',
};

export default function AdminUserShow({ user, roles }: { user: UserProfile; roles: Array<{ id: number; name: string }> }) {
    const role = user.roles[0]?.name ?? 'customer';

    const toggleStatus = () => {
        router.patch(route('admin.users.status', user.id));
    };

    const deleteUser = () => {
        if (confirm(`Delete ${user.name}? This cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const updateRole = (newRole: string) => {
        router.patch(route('admin.users.role', user.id), { role: newRole });
    };

    return (
        <AdminLayout breadcrumb={user.name}>
            <Head title={user.name} />
            <div className="max-w-4xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.users.index')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            ←
                        </Link>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={toggleStatus}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${user.is_active ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'}`}
                            >
                                {user.is_active ? <><UserX className="h-4 w-4" /> Deactivate</> : <><UserCheck className="h-4 w-4" /> Activate</>}
                            </button>
                            <button onClick={deleteUser} className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100">
                                <Trash2 className="h-4 w-4" /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Profile */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <User className="h-5 w-5 text-blue-500" /> Profile
                                </h2>
                                <dl className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        ['Name', user.name], ['Email', user.email],
                                        ['Phone', user.phone ?? '—'], ['Joined', new Date(user.created_at).toLocaleDateString()],
                                        ['Status', user.is_active ? 'Active' : 'Inactive'],
                                    ].map(([label, value]) => (
                                        <div key={label as string}>
                                            <dt className="text-gray-500">{label}</dt>
                                            <dd className="font-medium text-gray-900">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* Recent orders */}
                            {user.orders.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                        <ShoppingCart className="h-5 w-5 text-blue-500" /> Recent Orders
                                    </h2>
                                    <div className="divide-y divide-gray-100">
                                        {user.orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">#{order.order_number}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</span>
                                                    <Link href={route('admin.orders.show', order.id)} className="text-xs text-blue-600 hover:text-blue-800">View</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Side */}
                        <div className="space-y-4">
                            {/* Role */}
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <Shield className="h-4 w-4 text-gray-500" /> Role
                                </h2>
                                <span className={`mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${ROLE_COLOR[role] ?? 'bg-gray-100 text-gray-800'}`}>
                                    {role.replace('_', ' ')}
                                </span>
                                <select
                                    value={role}
                                    onChange={(e) => updateRole(e.target.value)}
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer profile */}
                            {user.customer_profile && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="mb-3 font-semibold text-gray-900">Customer Stats</h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Total Spent</span><span className="font-medium">${Number(user.customer_profile.total_spent).toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Loyalty Points</span><span className="font-medium">{user.customer_profile.loyalty_points}</span></div>
                                    </div>
                                </div>
                            )}

                            {/* Seller profile */}
                            {user.vendor_profile && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="mb-3 font-semibold text-gray-900">Seller Info</h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Store</span><span className="font-medium">{user.vendor_profile.store_name}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Balance</span><span className="font-medium">${Number(user.vendor_profile.balance).toFixed(2)}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </AdminLayout>
    );
}
