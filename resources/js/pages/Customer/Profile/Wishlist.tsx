import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, Package, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import StarRating from '@/components/StarRating';

interface Product {
    id: number;
    name: string;
    price: string;
    compare_at_price?: string;
    stock_quantity: number;
    avg_rating?: number;
    reviews_count?: number;
    category?: { name: string };
    images?: { image_path: string; is_primary: boolean; url: string }[];
}

export default function Wishlist({ products }: { products: Product[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [addingId, setAddingId] = useState<number | null>(null);

    const addToCart = (productId: number) => {
        setAddingId(productId);
        router.post(route('customer.cart.add'), { product_id: productId, quantity: 1 }, {
            preserveScroll: true,
            onFinish: () => setAddingId(null),
        });
    };
    return (
        <>
            <Head title="My Favorites" />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div>
                        <Link href={route('dashboard')} className="inline-flex items-center gap-1.5 text-sm text-[#2d6a2d] hover:underline mb-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Favorites</h1>
                        <p className="text-gray-500 text-sm">{products.length} saved item{products.length !== 1 ? 's' : ''}</p>
                    </div>

                    {flash?.success && (
                        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 shrink-0" /> {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{flash.error}</div>
                    )}

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => {
                                const img = product.images?.find(i => i.is_primary) ?? product.images?.[0];
                                const price = parseFloat(product.price);
                                const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
                                const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

                                return (
                                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                        <div className="relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {img ? (
                                                <img src={img.url} alt={product.name}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <Package className="h-14 w-14 text-gray-200" />
                                            )}
                                            {discount > 0 && (
                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                                            )}
                                            <button onClick={() => router.post(route('customer.wishlist.toggle', product.id))}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
                                                title="Remove from favorites">
                                                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs text-[#2d6a2d] font-medium mb-0.5">{product.category?.name}</p>
                                            <Link href={route('customer.products.show', product.id)}
                                                className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#2d6a2d] transition-colors block mb-1">
                                                {product.name}
                                            </Link>
                                            <div className="mb-2">
                                                <StarRating rating={product.avg_rating ?? 0} count={product.reviews_count} />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-[#2d6a2d]">₱{price.toFixed(2)}</span>
                                                {comparePrice && comparePrice > price && (
                                                    <span className="text-xs text-gray-400 line-through">₱{comparePrice.toFixed(2)}</span>
                                                )}
                                            </div>
                                            {product.stock_quantity > 0 ? (
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={addingId === product.id}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-[#2d6a2d] text-white text-xs py-1.5 rounded-lg hover:bg-[#245724] transition-colors font-medium disabled:opacity-60">
                                                    <ShoppingCart className="h-3.5 w-3.5" />
                                                    {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                                                </button>
                                            ) : (
                                                <span className="block w-full text-center text-xs py-1.5 rounded-lg bg-gray-100 text-gray-400 font-medium">Out of Stock</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Heart className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                            <p className="text-gray-500 font-medium">Your favorites list is empty.</p>
                            <Link href={route('customer.products.index')}
                                className="mt-4 inline-block px-5 py-2 bg-[#2d6a2d] text-white rounded-full text-sm font-bold hover:bg-[#245724] transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
