import { Head, Link, router } from '@inertiajs/react';
import { Percent, Plus, Edit, Trash2, Search, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Coupon {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_amount?: number;
    max_discount?: number;
    usage_limit?: number;
    used_count: number;
    valid_from: string;
    valid_to: string;
    applicable_products: string | string[];
    created_at: string;
}

interface CouponsIndexProps {
    coupons: {
        data: Coupon[];
        links: any[];
        meta: any;
    };
}

export default function CouponsIndex({ coupons }: CouponsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleDelete = (couponId: number) => {
        if (confirm('Are you sure you want to delete this voucher?')) {
            router.delete(route('admin.coupons.destroy', couponId));
        }
    };

    const isActive = (coupon: Coupon) => {
        const now = new Date();
        const validFrom = new Date(coupon.valid_from);
        const validTo = new Date(coupon.valid_to);
        return now >= validFrom && now <= validTo;
    };

    const isExpired = (coupon: Coupon) => {
        const now = new Date();
        const validTo = new Date(coupon.valid_to);
        return now > validTo;
    };

    const getStatusColor = (coupon: Coupon) => {
        if (isExpired(coupon)) return 'bg-red-100 text-red-800';
        if (isActive(coupon)) return 'bg-green-100 text-green-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (coupon: Coupon) => {
        if (isExpired(coupon)) return 'Expired';
        if (isActive(coupon)) return 'Active';
        return 'Scheduled';
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.type === 'percentage') {
            return `${coupon.value}%`;
        }
        return `$${coupon.value}`;
    };

    return (
        <AdminLayout breadcrumb="Coupons">
            <Head title="Voucher Management" />
            <div>
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
                        <p className="text-gray-600">Create and manage discount vouchers</p>
                    </div>
                    <Link
                        href={route('admin.coupons.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Voucher
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Percent className="h-8 w-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Vouchers</p>
                                <p className="text-2xl font-bold text-gray-900">{coupons.meta?.total ?? coupons.data.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Calendar className="h-8 w-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {coupons.data.filter(c => isActive(c)).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Calendar className="h-8 w-8 text-red-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Expired</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {coupons.data.filter(c => isExpired(c)).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-purple-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Uses</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {coupons.data.reduce((sum, c) => sum + c.used_count, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search vouchers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Voucher Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Discount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valid Period
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coupons.data.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Percent className="h-5 w-5 text-blue-500 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {coupon.code}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {coupon.applicable_products === 'all' ? 'All Products' : 'Selected Products'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <span className="font-semibold">{formatDiscount(coupon)}</span>
                                                <span className="text-gray-500 ml-1">
                                                    {coupon.type === 'percentage' ? 'off' : 'discount'}
                                                </span>
                                            </div>
                                            {coupon.min_order_amount && (
                                                <div className="text-xs text-gray-500">
                                                    Min order: ${coupon.min_order_amount}
                                                </div>
                                            )}
                                            {coupon.max_discount && coupon.type === 'percentage' && (
                                                <div className="text-xs text-gray-500">
                                                    Max discount: ${coupon.max_discount}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {coupon.used_count} / {coupon.usage_limit || '∞'}
                                            </div>
                                            {coupon.usage_limit && (
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${Math.min((coupon.used_count / coupon.usage_limit) * 100, 100)}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{new Date(coupon.valid_from).toLocaleDateString()}</div>
                                            <div>to {new Date(coupon.valid_to).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon)}`}>
                                                {getStatusText(coupon)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route('admin.coupons.edit', coupon.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {coupons.links && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{coupons.meta?.from}</span> to{' '}
                                            <span className="font-medium">{coupons.meta?.to}</span> of{' '}
                                            <span className="font-medium">{coupons.meta?.total ?? coupons.data.length}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {coupons.links.map((link, index) => (
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-300"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {coupons.data.length === 0 && (
                    <div className="text-center py-12">
                        <Percent className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No vouchers</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first voucher.</p>
                        <div className="mt-6">
                            <Link
                                href={route('admin.coupons.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Voucher
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}