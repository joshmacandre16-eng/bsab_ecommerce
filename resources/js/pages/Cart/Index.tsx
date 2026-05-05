import { Head, Link, router, usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
    id: number;
    quantity: number;
    unit_price: number;
    product: {
        id: number;
        name: string;
        sku?: string;
        description?: string;
        stock_quantity: number;
        images?: { image_path: string; is_primary: boolean }[];
    };
}

interface Cart {
    id?: number;
    subtotal: number;
    tax?: number;
    shipping?: number;
    discount?: number;
    total: number;
    coupon_code?: string;
    items: CartItem[];
}

interface Address {
    id: number;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

interface ClaimedVoucher {
    id: number;
    code: string;
    type: string;
    value: number;
    min_order_amount?: number;
}

interface GCash {
    qr_image: string;
    number: string;
    name: string;
}

const fmt = (n: number) =>
    '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartIndex({ cart, addresses, claimedVouchers, gcash }: { cart: Cart; addresses: Address[]; claimedVouchers: ClaimedVoucher[]; gcash: GCash }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [selectedVoucher, setSelectedVoucher] = useState(cart.coupon_code ?? '');
    const [showCheckout, setShowCheckout] = useState(false);

    // Safety filter: never show used vouchers in the dropdown (backend already filters, this is a guard)
    const availableVouchers = claimedVouchers.filter(v => v.code !== cart.coupon_code);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(
        addresses.find(a => a.is_default)?.id ?? addresses[0]?.id ?? null,
    );
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const items = cart.items ?? [];

    const updateQty = (itemId: number, qty: number) =>
        router.patch(route('customer.cart.update'), { cart_item_id: itemId, quantity: qty }, { preserveScroll: true });

    const removeItem = (itemId: number) =>
        router.delete(route('customer.cart.remove', itemId), { preserveScroll: true });

    const applyCoupon = () =>
        router.post(route('customer.cart.coupon'), { coupon_code: selectedVoucher }, {
            preserveScroll: true,
            preserveState: false,
        });

    const removeVoucher = () => {
        setSelectedVoucher('');
        router.post(route('customer.cart.coupon'), { coupon_code: '' }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const placeOrder = () => {
        if (!selectedAddress) return;
        router.post(route('customer.orders.store'), { address_id: selectedAddress, payment_method: paymentMethod });
    };

    return (
        <>
            <Head title="My Cart" />

            <div className="cart-wrap">
                <div className="cart-box">

                    {/* Header */}
                    <div className="cart-hdr">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="cart-hdr-icon">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        <div className="cart-hdr-text">
                            <div className="hdr-brand">Agrimart Philippines</div>
                            <div className="hdr-title">Your Agricultural Shopping Cart</div>
                        </div>
                        <Link href={route('customer.products.index')} className="hdr-close">✕</Link>
                    </div>

                    {flash?.success && <div className="cart-flash-success">{flash.success}</div>}
                    {flash?.error && <div className="cart-flash-error">{flash.error}</div>}

                    <div className="cart-body-inner">
                        {/* Column headers */}
                        <div className="col-hdrs">
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Unit Price</span>
                            <span>Subtotal</span>
                        </div>

                        {/* Items */}
                        {items.length === 0 ? (
                            <div className="cart-empty">Your cart is empty.</div>
                        ) : items.map((item) => {
                            const img = item.product.images?.find(i => i.is_primary) ?? item.product.images?.[0];
                            const lineTotal = item.quantity * Number(item.unit_price);
                            return (
                                <div key={item.id} className="item-row">
                                    <div className="item-info">
                                        <div className="item-icon">
                                            {img
                                                ? <img src={`/storage/${img.image_path}`} alt={item.product.name} />
                                                : <Package size={22} color="#4a7c42" />}
                                        </div>
                                        <div>
                                            <Link href={route('customer.products.show', item.product.id)} className="item-name">
                                                {item.product.name}
                                            </Link>
                                            {item.product.sku && <div className="item-meta">SKU: {item.product.sku}</div>}
                                            {item.product.description && <div className="item-meta-sm">{item.product.description}</div>}
                                            <button className="item-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                        </div>
                                    </div>

                                    <div className="item-row-bottom">
                                        <div className="qty-ctrl">
                                            <button className="qty-btn" onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeItem(item.id)}>−</button>
                                            <div className="qty-num">{item.quantity}</div>
                                            <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock_quantity}>+</button>
                                        </div>
                                        <div className="price-col">
                                            <div className="unit-price">{fmt(Number(item.unit_price))}</div>
                                            <div className="subtotal">{fmt(lineTotal)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Voucher Selector */}
                        <div className="promo-sec">
                            {availableVouchers.length === 0 && !cart.coupon_code ? (
                                <div style={{ fontSize: 13, color: '#888', padding: '8px 0' }}>
                                    No vouchers claimed yet.{' '}
                                    <a href={route('customer.vouchers.index')} style={{ color: '#4a7c42', textDecoration: 'underline' }}>Browse vouchers</a>
                                </div>
                            ) : cart.coupon_code ? (
                                /* Voucher already applied — locked, one-time use */
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        flex: 1, padding: '8px 12px', background: '#f0fdf4',
                                        border: '1px solid #86efac', borderRadius: 6,
                                        fontSize: 13, fontWeight: 600, color: '#166534',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                    }}>
                                        <span style={{ fontSize: 15 }}>✅</span>
                                        <span>Voucher <strong>{cart.coupon_code}</strong> applied</span>
                                    </div>
                                    <button
                                        onClick={removeVoucher}
                                        style={{ fontSize: 12, color: '#a32d2d', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                /* Select and apply a voucher */
                                <>
                                    <select
                                        className="promo-input"
                                        value={selectedVoucher}
                                        onChange={e => setSelectedVoucher(e.target.value)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="">— Select a voucher —</option>
                                        {availableVouchers.map(v => (
                                            <option key={v.id} value={v.code}>
                                                {v.code} — {v.type === 'percentage' ? `${v.value}% off` : `₱${Number(v.value).toFixed(2)} off`}
                                                {v.min_order_amount ? ` (min ₱${Number(v.min_order_amount).toFixed(2)})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="promo-apply" onClick={applyCoupon} disabled={!selectedVoucher}>Apply</button>
                                </>
                            )}
                        </div>


                    </div>

                    {/* Bottom */}
                    <div className="cart-bottom">
                        <div className="cart-summary">
                            <div className="summary-title">Cart Summary</div>
                            <div className="summary-row"><span>Subtotal</span><span>{fmt(Number(cart.subtotal))}</span></div>
                            {(cart.shipping ?? 0) > 0 && (
                                <div className="summary-row"><span>Shipping (Central Visayas)</span><span>{fmt(Number(cart.shipping))}</span></div>
                            )}
                            {(cart.tax ?? 0) > 0 && (
                                <div className="summary-row"><span>Tax (12% VAT)</span><span>{fmt(Number(cart.tax))}</span></div>
                            )}
                            {(cart.discount ?? 0) > 0 && (
                                <div className="summary-row"><span>Discount</span><span>-{fmt(Number(cart.discount))}</span></div>
                            )}
                            <div className="summary-total">
                                <span>Total</span>
                                <span className="summary-total-amount">{fmt(Number(cart.total))}</span>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button className="btn-checkout" onClick={() => setShowCheckout(true)}>
                                Proceed to Checkout →
                            </button>
                            <Link href={route('customer.products.index')} className="btn-view">
                                View Full Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-hdr">
                            <span className="modal-hdr-title">Checkout</span>
                            <button className="modal-close" onClick={() => setShowCheckout(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <p className="modal-label">Shipping Address</p>
                                {addresses.length > 0 ? (
                                    <div className="modal-addr-list">
                                        {addresses.map(addr => (
                                            <label key={addr.id} className={`modal-addr-item${selectedAddress === addr.id ? ' selected' : ''}`}>
                                                <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                                                <div>
                                                    <p className="modal-addr-name">{addr.full_name}</p>
                                                    <p className="modal-addr-line">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                                                    <p className="modal-addr-line">{addr.city}, {addr.state} {addr.postal_code}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="modal-no-addr">
                                        No address found.{' '}
                                        <Link href={route('customer.addresses')}>Add one here</Link>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="modal-label">Payment Method</p>
                                <select
                                    aria-label="Payment method"
                                    className="modal-select"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="gcash">GCash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                                {paymentMethod === 'gcash' && (gcash.qr_image || gcash.number) && (
                                    <div style={{ marginTop: 12, padding: '12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 6 }}>Scan to Pay via GCash</p>
                                        {gcash.qr_image && (
                                            <img
                                                src={`/storage/${gcash.qr_image}`}
                                                alt="GCash QR Code"
                                                style={{ width: 160, height: 160, objectFit: 'contain', margin: '0 auto 8px', display: 'block', borderRadius: 6 }}
                                            />
                                        )}
                                        {gcash.number && <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>{gcash.number}</p>}
                                        {gcash.name && <p style={{ fontSize: 12, color: '#166534' }}>{gcash.name}</p>}
                                        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>Send the exact amount, then place your order.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-total">
                                <span>Total</span>
                                <span className="modal-total-amount">{fmt(Number(cart.total))}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-cancel" onClick={() => setShowCheckout(false)}>Cancel</button>
                            <button className="modal-place" onClick={placeOrder} disabled={!selectedAddress}>Place Order</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
