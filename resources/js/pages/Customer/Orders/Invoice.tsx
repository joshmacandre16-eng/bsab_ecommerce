import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

interface OrderItem { id: number; product: { name: string }; quantity: number; unit_price: number }
interface Order {
    id: number; order_number: string; status: string; payment_method: string;
    subtotal: number; shipping_cost: number; tax: number; discount: number; total: number;
    items: OrderItem[];
    user: { name: string; email: string };
    address?: { full_name: string; address_line1: string; city: string; state: string; postal_code: string; country: string };
    rider?: { name: string; phone: string; rider_profile?: { vehicle_type: string; license_number: string } };
    created_at: string;
}

export default function CustomerOrderInvoice({ order }: { order: Order }) {
    return (
        <>
            <Head title={`Invoice #${order.order_number}`} />
            <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:bg-white print:p-0">
                {/* Print controls — hidden when printing */}
                <div className="mx-auto mb-6 flex max-w-3xl items-center gap-4 print:hidden">
                    <Link href={route('customer.orders.show', order.id)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-200">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <Link href={route('dashboard')} className="inline-flex items-center gap-1 text-sm text-[#2d6a2d] hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Printer className="h-4 w-4" /> Print / Save PDF
                    </button>
                </div>

                {/* Invoice */}
                <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:shadow-none print:border-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                            <p className="text-gray-500 mt-1">#{order.order_number}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                            <p className="font-semibold text-gray-900 text-lg">BSAB E-Commerce</p>
                            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p>Status: <span className="font-medium capitalize">{order.status}</span></p>
                        </div>
                    </div>

                    {/* Bill to */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Bill To</h3>
                            <p className="font-semibold text-gray-900">{order.user.name}</p>
                            <p className="text-sm text-gray-600">{order.user.email}</p>
                        </div>
                        {order.address && (
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Ship To</h3>
                                <p className="font-semibold text-gray-900">{order.address.full_name}</p>
                                <p className="text-sm text-gray-600">{order.address.address_line1}</p>
                                <p className="text-sm text-gray-600">{order.address.city}, {order.address.state} {order.address.postal_code}</p>
                                <p className="text-sm text-gray-600">{order.address.country}</p>
                            </div>
                        )}
                    </div>

                    {/* Rider info */}
                    {order.rider && (
                        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">🛵 Delivery Rider</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Name</span>
                                    <p className="font-semibold text-gray-900">{order.rider.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Phone</span>
                                    <p className="font-semibold text-gray-900">{order.rider.phone ?? '—'}</p>
                                </div>
                                {order.rider.rider_profile && (
                                    <>
                                        <div>
                                            <span className="text-gray-500">Vehicle Type</span>
                                            <p className="font-semibold text-gray-900">{order.rider.rider_profile.vehicle_type}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">License Number</span>
                                            <p className="font-semibold text-gray-900">{order.rider.rider_profile.license_number}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Items table */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Item</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Qty</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Unit Price</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-3 text-sm text-gray-900">{item.product.name}</td>
                                    <td className="py-3 text-right text-sm text-gray-600">{item.quantity}</td>
                                    <td className="py-3 text-right text-sm text-gray-600">${Number(item.unit_price).toFixed(2)}</td>
                                    <td className="py-3 text-right text-sm font-medium text-gray-900">${(item.quantity * Number(item.unit_price)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                            {[
                                ['Subtotal', `$${Number(order.subtotal).toFixed(2)}`],
                                ['Shipping', `$${Number(order.shipping_cost).toFixed(2)}`],
                                ['Tax', `$${Number(order.tax).toFixed(2)}`],
                                ...(order.discount > 0 ? [['Discount', `-$${Number(order.discount).toFixed(2)}`]] : []),
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between text-gray-600">
                                    <span>{label}</span><span>{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-base font-bold text-gray-900">
                                <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 capitalize">Payment: {order.payment_method}</p>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-xs text-gray-400">Thank you for your purchase!</p>
                </div>
            </div>
        </>
    );
}
