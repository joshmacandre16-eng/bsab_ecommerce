import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Percent, Save } from 'lucide-react';
import { FormEvent } from 'react';

interface Product {
    id: number;
    name: string;
}

export default function CouponCreate({ products }: { products: Product[] }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_discount: '',
        usage_limit: '',
        claim_limit: '',
        valid_from: '',
        valid_to: '',
        applicable_products: [] as string[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.coupons.store'));
    };

    return (
        <>
            <Head title="Create Voucher" />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 flex items-center gap-4">
                        <Link href={route('admin.coupons.index')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Voucher</h1>
                            <p className="text-sm text-gray-500">Add a new discount voucher</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-3">
                                <Percent className="h-5 w-5 text-blue-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Voucher Details</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Voucher Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className={`w-full rounded-lg border px-4 py-2 uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="SAVE10"
                                        required
                                    />
                                    {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Value <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder={data.type === 'percentage' ? '10' : '5.00'}
                                        required
                                    />
                                    {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                                    <input
                                        type="number"
                                        value={data.min_order_amount}
                                        onChange={(e) => setData('min_order_amount', e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>

                                {data.type === 'percentage' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount ($)</label>
                                        <input
                                            type="number"
                                            value={data.max_discount}
                                            onChange={(e) => setData('max_discount', e.target.value)}
                                            min="0"
                                            step="0.01"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            placeholder="50.00"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={data.usage_limit}
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Unlimited"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Claim Limit <span className="text-xs text-gray-400">(max users who can claim)</span></label>
                                    <input
                                        type="number"
                                        value={data.claim_limit}
                                        onChange={(e) => setData('claim_limit', e.target.value)}
                                        min="1"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Unlimited"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Validity */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                            <h2 className="text-lg font-semibold text-gray-900">Validity Period</h2>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid From <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.valid_from}
                                        onChange={(e) => setData('valid_from', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.valid_from ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.valid_from && <p className="mt-1 text-sm text-red-500">{errors.valid_from}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valid To <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.valid_to}
                                        onChange={(e) => setData('valid_to', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.valid_to ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.valid_to && <p className="mt-1 text-sm text-red-500">{errors.valid_to}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link
                                href={route('admin.coupons.index')}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Voucher'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
