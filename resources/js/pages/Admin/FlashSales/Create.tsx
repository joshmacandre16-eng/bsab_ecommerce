import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Product {
    id: number;
    name: string;
}

export default function FlashSaleCreate({ products }: { products: Product[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        start_time: '',
        end_time: '',
        applicable_products: [] as string[],
        active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.flash-sales.store'));
    };

    const handleProductToggle = (productId: string) => {
        const currentProducts = data.applicable_products || [];
        if (currentProducts.includes(productId)) {
            setData('applicable_products', currentProducts.filter(id => id !== productId));
        } else {
            setData('applicable_products', [...currentProducts, productId]);
        }
    };

    return (
        <AdminLayout breadcrumb="Create Flash Sale">
            <Head title="Create Flash Sale" />

            {/* Page Header */}
            <div className="pg-header">
                <div>
                    <Link href={route('admin.flash-sales.index')} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        ← Back to Flash Sales
                    </Link>
                    <div className="pg-title">Create Flash Sale</div>
                    <div className="pg-subtitle">Add a new limited-time discount</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
                {/* Basic Info */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Flash Sale Details</span>
                    </div>
                    <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: `1px solid ${errors.title ? '#ef4444' : 'var(--border)'}`,
                                    borderRadius: '6px',
                                    fontSize: 13,
                                }}
                                placeholder="Black Friday Sale"
                                required
                            />
                            {errors.title && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{errors.title}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                Discount Type <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                value={data.discount_type}
                                onChange={(e) => setData('discount_type', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    fontSize: 13,
                                }}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₱)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                Discount Value <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                value={data.discount_value}
                                onChange={(e) => setData('discount_value', e.target.value)}
                                min="0"
                                step="0.01"
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: `1px solid ${errors.discount_value ? '#ef4444' : 'var(--border)'}`,
                                    borderRadius: '6px',
                                    fontSize: 13,
                                }}
                                placeholder={data.discount_type === 'percentage' ? '20' : '100.00'}
                                required
                            />
                            {errors.discount_value && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{errors.discount_value}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                Start Time <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: `1px solid ${errors.start_time ? '#ef4444' : 'var(--border)'}`,
                                    borderRadius: '6px',
                                    fontSize: 13,
                                }}
                                required
                            />
                            {errors.start_time && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{errors.start_time}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                                End Time <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: `1px solid ${errors.end_time ? '#ef4444' : 'var(--border)'}`,
                                    borderRadius: '6px',
                                    fontSize: 13,
                                }}
                                required
                            />
                            {errors.end_time && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{errors.end_time}</p>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                id="active"
                                checked={data.active}
                                onChange={(e) => setData('active', e.target.checked)}
                                style={{ cursor: 'pointer', width: 18, height: 18 }}
                            />
                            <label htmlFor="active" style={{ fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>
                                Active
                            </label>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Description</span>
                    </div>
                    <div className="card-body">
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                fontSize: 13,
                                fontFamily: 'inherit',
                            }}
                            placeholder="Optional description for this flash sale"
                        />
                    </div>
                </div>

                {/* Applicable Products */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Applicable Products</span>
                    </div>
                    <div className="card-body">
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Select specific products. Leave empty to apply to all.</p>
                        <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 6, padding: 12 }}>
                            {products.map((product) => (
                                <label key={product.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', fontSize: 13, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.applicable_products?.includes(product.id.toString()) || false}
                                        onChange={() => handleProductToggle(product.id.toString())}
                                        style={{ marginRight: 8, cursor: 'pointer', width: 16, height: 16 }}
                                    />
                                    {product.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <Link href={route('admin.flash-sales.index')} className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                        style={{ opacity: processing ? 0.5 : 1 }}
                    >
                        {processing ? 'Creating...' : '+ Create Flash Sale'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
