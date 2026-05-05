import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Edit, Package } from 'lucide-react';
import { useState } from 'react';
import SellerLayout from '@/layouts/SellerLayout';

interface ProductImage { id: number; image_path: string; is_primary: boolean }
interface Product {
    id: number; name: string; description: string; price: number;
    compare_at_price?: number; sku?: string; stock_quantity: number;
    low_stock_threshold: number; status: string;
    category?: { name: string }; brand?: { name: string };
    images: ProductImage[]; order_items_count?: number;
}

export default function VendorProductShow({ product }: { product: Product }) {
    const primaryImg = product.images.find((i) => i.is_primary) ?? product.images[0];
    const [active, setActive] = useState<ProductImage | undefined>(primaryImg);
    const isLowStock = product.stock_quantity <= product.low_stock_threshold;

    const details = [
        ['Category',    product.category?.name ?? '—'],
        ['Brand',       product.brand?.name ?? '—'],
        ['SKU',         product.sku ?? '—'],
        ['Stock',       `${product.stock_quantity} units`],
        ['Low Stock At', `${product.low_stock_threshold} units`],
        ['Total Sold',  product.order_items_count ?? 0],
    ];

    return (
        <SellerLayout breadcrumb={product.name}>
            <Head title={product.name} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                <Link href={route('seller.products.index')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid #e8e8e4', color: '#6e6d67', textDecoration: 'none', flexShrink: 0 }}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, letterSpacing: '-0.5px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                <Link href={route('seller.products.edit', product.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: '#0d0d0d', color: '#fff', fontSize: 13, textDecoration: 'none' }}>
                    <Edit className="h-4 w-4" /> Edit
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Main image */}
                    <div style={{ aspectRatio: '1', overflow: 'hidden', border: '1px solid #e8e8e4', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {active ? (
                            <img src={`/storage/${active.image_path}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Package className="h-16 w-16" style={{ color: '#e8e8e4' }} />
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {product.images.map((img) => (
                                <div key={img.id}
                                    onClick={() => setActive(img)}
                                    style={{ aspectRatio: '1', overflow: 'hidden', border: `2px solid ${active?.id === img.id ? '#0d0d0d' : '#e8e8e4'}`, cursor: 'pointer', transition: 'border-color .15s' }}>
                                    <img src={`/storage/${img.image_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Price + status */}
                    <div style={{ border: '1px solid #e8e8e4', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: product.status === 'active' ? '#0d0d0d' : 'transparent', color: product.status === 'active' ? '#fff' : '#b0afa8', border: product.status === 'active' ? 'none' : '1px dotted #b0afa8' }}>
                                {product.status}
                            </span>
                            {isLowStock && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a32d2d', fontFamily: "'DM Mono', monospace" }}>
                                    <AlertTriangle className="h-3.5 w-3.5" /> Low Stock
                                </span>
                            )}
                        </div>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, letterSpacing: '-1px', marginBottom: 4 }}>₱{Number(product.price).toFixed(2)}</div>
                        {product.compare_at_price && (
                            <div style={{ fontSize: 13, color: '#b0afa8', textDecoration: 'line-through', fontFamily: "'DM Mono', monospace" }}>₱{Number(product.compare_at_price).toFixed(2)}</div>
                        )}
                    </div>

                    {/* Details grid */}
                    <div style={{ border: '1px solid #e8e8e4', padding: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {details.map(([label, value]) => (
                                <div key={label as string}>
                                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0afa8', marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ border: '1px solid #e8e8e4', padding: 20 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>Description</div>
                        <p style={{ fontSize: 13, color: '#6e6d67', lineHeight: 1.6 }}>{product.description}</p>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
