import { Head, Link, router } from '@inertiajs/react';
import { Package, User, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface OrderItem { id: number; product: { name: string; sku?: string; images?: { url: string; is_primary: boolean }[] }; quantity: number; unit_price: number }
interface Order {
    id: number; order_number: string; status: string; payment_status: string; payment_method: string;
    subtotal: number; shipping_cost: number; tax: number; discount: number; total: number;
    items: OrderItem[];
    user?: { name: string; email: string; phone?: string };
    shipping_address?: { full_name: string; address_line1: string; city: string; state: string; postal_code: string; country: string };
    shipment?: { carrier: string; tracking_number: string; status: string };
    notes?: string;
    created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800', refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrderShow({ order }: { order: Order }) {
    const updateStatus = (status: string) => {
        router.patch(route('admin.orders.status', order.id), { status });
    };

    const refund = () => {
        if (confirm('Process a refund for this order?')) {
            router.post(route('admin.orders.refund', order.id));
        }
    };

    return (
        <AdminLayout breadcrumb={`Order #${order.order_number}`}>
            <Head title={`Order #${order.order_number}`} />
            <div className="max-w-5xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href={route('admin.orders.index')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            ←
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={order.status ?? ''}
                                onChange={(e) => updateStatus(e.target.value)}
                                className={`rounded-full border-0 px-3 py-1 text-sm font-semibold ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-800'}`}
                            >
                                {['pending','processing','shipped','delivered','cancelled','refunded'].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {order.payment_status === 'paid' && order.status !== 'refunded' && (
                                <button onClick={refund} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <RefreshCw className="h-3.5 w-3.5" /> Refund
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Items */}
                        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Items ({order.items.length})</h2>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 py-3">
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            {(() => {
                                                const img = item.product.images?.find((i) => i.is_primary) ?? item.product.images?.[0];
                                                return img
                                                    ? <img src={img.url} alt={item.product.name} className="h-full w-full object-cover" />
                                                    : <Package className="m-auto h-6 w-6 text-gray-400" />;
                                            })()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium text-gray-900">{item.product.name}</p>
                                            {item.product.sku && <p className="text-xs text-gray-400">SKU: {item.product.sku}</p>}
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">${(item.quantity * Number(item.unit_price)).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side */}
                        <div className="space-y-4">
                            {/* Customer */}
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <User className="h-4 w-4 text-gray-500" /> Customer
                                </h2>
                                <p className="font-medium text-gray-900">{order.user?.name ?? '—'}</p>
                                <p className="text-sm text-gray-500">{order.user?.email}</p>
                                {order.user?.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
                            </div>

                            {/* Payment */}
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <CreditCard className="h-4 w-4 text-gray-500" /> Payment
                                </h2>
                                <div className="space-y-1.5 text-sm">
                                    {[['Subtotal', `$${Number(order.subtotal).toFixed(2)}`], ['Shipping', `$${Number(order.shipping_cost).toFixed(2)}`], ['Tax', `$${Number(order.tax).toFixed(2)}`], ...(order.discount > 0 ? [['Discount', `-$${Number(order.discount).toFixed(2)}`]] : [])].map(([l, v]) => (
                                        <div key={l} className="flex justify-between text-gray-600"><span>{l}</span><span>{v}</span></div>
                                    ))}
                                    <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                                        <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 capitalize pt-1">{order.payment_method} — {order.payment_status}</p>
                                </div>
                            </div>

                            {/* Address */}
                            {order.shipping_address && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                        <MapPin className="h-4 w-4 text-gray-500" /> Ship To
                                    </h2>
                                    <address className="not-italic text-sm text-gray-600 space-y-0.5">
                                        <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                                        <p>{order.shipping_address.address_line1}</p>
                                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                                        <p>{order.shipping_address.country}</p>
                                    </address>
                                </div>
                            )}

                            {/* Shipment */}
                            {order.shipment && (
                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <h2 className="mb-2 font-semibold text-gray-900">Shipment</h2>
                                    <p className="text-sm text-gray-700">{order.shipment.carrier}</p>
                                    <p className="text-sm text-gray-500">{order.shipment.tracking_number}</p>
                                    <p className="text-xs text-gray-400 capitalize mt-1">{order.shipment.status}</p>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </AdminLayout>
    );
}
