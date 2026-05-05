import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ImagePlus, Save, Trash2, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import SellerLayout from '@/layouts/SellerLayout';

interface ProductImage { id: number; url: string; is_primary: boolean }
interface Category { id: number; name: string }
interface Brand { id: number; name: string }
interface Product {
    id: number; name: string; description: string; price: number;
    compare_at_price?: number; cost_per_item?: number; sku?: string;
    stock_quantity: number; low_stock_threshold: number;
    category_id: number; brand_id?: number; status: string;
    images: ProductImage[];
}

const inputStyle = (hasError?: boolean) => ({
    width: '100%', border: `1px solid ${hasError ? '#a32d2d' : '#e8e8e4'}`, padding: '8px 12px',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: '#fff', borderRadius: 0,
});
const labelStyle = { display: 'block', fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#6e6d67', marginBottom: 6 };
const sectionStyle = { border: '1px solid #e8e8e4', background: '#fff', marginBottom: 20 };
const sectionHead = { padding: '14px 18px', borderBottom: '1px solid #e8e8e4' };
const sectionBody = { padding: 18 };
const sectionTitle = { fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 500 };

export default function VendorProductEdit({ product, categories, brands }: { product: Product; categories: Category[]; brands: Brand[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string; name: string; description: string; price: string;
        compare_at_price: string; cost_per_item: string; sku: string;
        stock_quantity: string; low_stock_threshold: string;
        category_id: string; brand_id: string; status: string; images: File[];
    }>({
        _method: 'PUT', name: product.name, description: product.description,
        price: product.price.toString(), compare_at_price: product.compare_at_price?.toString() ?? '',
        cost_per_item: product.cost_per_item?.toString() ?? '', sku: product.sku ?? '',
        stock_quantity: product.stock_quantity.toString(), low_stock_threshold: product.low_stock_threshold.toString(),
        category_id: product.category_id.toString(), brand_id: product.brand_id?.toString() ?? '',
        status: product.status, images: [],
    });

    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImages = (files: FileList | null) => {
        if (!files) return;
        const total = product.images.length + data.images.length;
        const newFiles = Array.from(files).slice(0, 8 - total);
        setData('images', [...data.images, ...newFiles]);
        setNewPreviews((p) => [...p, ...newFiles.map((f) => URL.createObjectURL(f))]);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newPreviews[index]);
        setData('images', data.images.filter((_, i) => i !== index));
        setNewPreviews((p) => p.filter((_, i) => i !== index));
    };

    const deleteExistingImage = (imageId: number) => {
        if (!confirm('Delete this image?')) return;
        router.delete(route('seller.products.images.destroy', { product: product.id, image: imageId }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('seller.products.update', product.id), { forceFormData: true });
    };

    return (
        <SellerLayout breadcrumb="Edit Product">
            <Head title="Edit Product" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href={route('seller.products.index')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid #e8e8e4', color: '#6e6d67', textDecoration: 'none' }}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, letterSpacing: '-0.5px', marginBottom: 2 }}>Edit Product</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#b0afa8' }}>Update product listing</div>
                    </div>
                </div>
                <button type="submit" form="product-form" disabled={processing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: '#0d0d0d', color: '#fff', fontSize: 13, border: 'none', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}>
                    <Save className="h-4 w-4" />{processing ? 'Saving…' : 'Save'}
                </button>
            </div>

            <form id="product-form" onSubmit={handleSubmit}>
                {Object.keys(errors).length > 0 && (
                    <div style={{ display: 'flex', gap: 12, border: '1px solid #e8c8c8', background: '#fdf5f5', padding: 16, marginBottom: 20 }}>
                        <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#a32d2d', marginTop: 1 }} />
                        <ul style={{ fontSize: 13, color: '#a32d2d', paddingLeft: 16 }}>
                            {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}

                {/* Basic Info */}
                <div style={sectionStyle}>
                    <div style={sectionHead}><span style={sectionTitle}>Basic Information</span></div>
                    <div style={{ ...sectionBody, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Product Name <span style={{ color: '#a32d2d' }}>*</span></label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required style={inputStyle(!!errors.name)} />
                            {errors.name && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 4 }}>{errors.name}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Description <span style={{ color: '#a32d2d' }}>*</span></label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} required style={{ ...inputStyle(!!errors.description), resize: 'vertical' }} />
                            {errors.description && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 4 }}>{errors.description}</p>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Category <span style={{ color: '#a32d2d' }}>*</span></label>
                                <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} required style={inputStyle(!!errors.category_id)}>
                                    <option value="">Select category</option>
                                    {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                </select>
                                {errors.category_id && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 4 }}>{errors.category_id}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Brand</label>
                                <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} style={inputStyle()}>
                                    <option value="">No brand</option>
                                    {brands.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div style={sectionStyle}>
                    <div style={sectionHead}><span style={sectionTitle}>Pricing</span></div>
                    <div style={{ ...sectionBody, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { label: 'Price', key: 'price' as const, required: true },
                            { label: 'Compare at Price', key: 'compare_at_price' as const },
                            { label: 'Cost per Item', key: 'cost_per_item' as const },
                        ].map(({ label, key, required }) => (
                            <div key={key}>
                                <label style={labelStyle}>{label} {required && <span style={{ color: '#a32d2d' }}>*</span>}</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#b0afa8', fontSize: 13 }}>₱</span>
                                    <input type="number" value={data[key]} onChange={(e) => setData(key, e.target.value)} step="0.01" min="0" required={required} style={{ ...inputStyle(!!errors[key]), paddingLeft: 24 }} />
                                </div>
                                {errors[key] && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 4 }}>{errors[key]}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory */}
                <div style={sectionStyle}>
                    <div style={sectionHead}><span style={sectionTitle}>Inventory</span></div>
                    <div style={{ ...sectionBody, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { label: 'Stock Quantity', key: 'stock_quantity' as const, required: true, type: 'number' },
                            { label: 'Low Stock Threshold', key: 'low_stock_threshold' as const, type: 'number' },
                            { label: 'SKU', key: 'sku' as const, type: 'text' },
                        ].map(({ label, key, required, type }) => (
                            <div key={key}>
                                <label style={labelStyle}>{label} {required && <span style={{ color: '#a32d2d' }}>*</span>}</label>
                                <input type={type} value={data[key] as string} onChange={(e) => setData(key, e.target.value)} min={type === 'number' ? '0' : undefined} required={required} style={inputStyle(!!errors[key])} />
                                {errors[key] && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 4 }}>{errors[key]}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div style={sectionStyle}>
                    <div style={sectionHead}><span style={sectionTitle}>Product Images</span></div>
                    <div style={sectionBody}>
                        <p style={{ fontSize: 12, color: '#b0afa8', fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>Up to 8 images total. First image is primary.</p>
                        {product.images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                                {product.images.map((img) => (
                                    <div key={img.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', border: `2px solid ${img.is_primary ? '#0d0d0d' : '#e8e8e4'}` }}>
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {img.is_primary && <span style={{ position: 'absolute', top: 4, left: 4, background: '#0d0d0d', color: '#fff', fontSize: 10, padding: '2px 6px', fontFamily: "'DM Mono', monospace" }}>Primary</span>}
                                        <button type="button" onClick={() => deleteExistingImage(img.id)} style={{ position: 'absolute', top: 4, right: 4, background: '#a32d2d', border: 'none', color: '#fff', cursor: 'pointer', padding: 2, display: 'flex' }}>
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {newPreviews.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                                {newPreviews.map((src, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', border: '2px dashed #e8e8e4' }}>
                                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <span style={{ position: 'absolute', top: 4, left: 4, background: '#f5f5f3', color: '#0d0d0d', fontSize: 10, padding: '2px 6px', fontFamily: "'DM Mono', monospace" }}>New</span>
                                        <button type="button" onClick={() => removeNewImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: '#a32d2d', border: 'none', color: '#fff', cursor: 'pointer', padding: 2, display: 'flex' }}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {(product.images.length + data.images.length) < 8 && (
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 28, border: '2px dashed #e8e8e4', background: 'none', cursor: 'pointer', color: '#b0afa8' }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0d0d0d')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e8e8e4')}>
                                <ImagePlus className="h-7 w-7" />
                                <span style={{ fontSize: 13, fontWeight: 500 }}>Add more images</span>
                                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{product.images.length + data.images.length}/8 used</span>
                            </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => handleImages(e.target.files)} />
                        {errors.images && <p style={{ fontSize: 12, color: '#a32d2d', marginTop: 8 }}>{errors.images}</p>}
                    </div>
                </div>

                {/* Status */}
                <div style={sectionStyle}>
                    <div style={sectionHead}><span style={sectionTitle}>Status</span></div>
                    <div style={{ ...sectionBody, display: 'flex', gap: 24 }}>
                        {['active', 'inactive'].map((s) => (
                            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                                <input type="radio" name="status" value={s} checked={data.status === s} onChange={() => setData('status', s)} style={{ accentColor: '#0d0d0d' }} />
                                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{s}</span>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px', borderRadius: 10, background: s === 'active' ? '#0d0d0d' : '#e8e8e4', color: s === 'active' ? '#fff' : '#6e6d67' }}>
                                    {s === 'active' ? 'Visible' : 'Hidden'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 32 }}>
                    <Link href={route('seller.products.index')} style={{ padding: '10px 24px', border: '1px solid #e8e8e4', fontSize: 13, color: '#6e6d67', textDecoration: 'none' }}>Cancel</Link>
                    <button type="submit" disabled={processing}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#0d0d0d', color: '#fff', fontSize: 13, border: 'none', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}>
                        <Save className="h-4 w-4" />{processing ? 'Saving…' : 'Update Product'}
                    </button>
                </div>
            </form>
        </SellerLayout>
    );
}
