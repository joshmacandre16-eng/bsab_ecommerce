import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, Clock, Leaf, Menu, Package, ShoppingBag, ShoppingCart, Star, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    compare_at_price?: string;
    stock_quantity: number;
    status: string;
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    images?: { image_path: string; is_primary: boolean }[];
}

interface Category {
    id: number;
    name: string;
    image?: string;
}

function Countdown() {
    const [time, setTime] = useState(2 * 3600 + 45 * 60 + 18);
    useEffect(() => {
        const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, []);
    const h = String(Math.floor(time / 3600)).padStart(2, '0');
    const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const s = String(time % 60).padStart(2, '0');
    return <span className="font-mono font-bold">{h}:{m}:{s}</span>;
}

function ProductCard({ product, isLoggedIn }: { product: Product; isLoggedIn: boolean }) {
    const img = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
    const price = parseFloat(product.price);
    const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
    const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    const showRoute = isLoggedIn ? route('customer.products.show', product.id) : route('login');

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-lg">
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-50">
                {img ? (
                    <img src={`/storage/${img.image_path}`} alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <Package className="h-14 w-14 text-gray-200" />
                )}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
                )}
                {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="mb-0.5 text-xs font-medium text-[#2d6a2d]">{product.category?.name}</p>
                <Link href={showRoute} className="mb-1 line-clamp-2 block text-sm font-semibold text-gray-800 transition-colors hover:text-[#2d6a2d]">
                    {product.name}
                </Link>
                <div className="mb-2 flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <div className="mb-2 flex items-center gap-2">
                    <span className="font-bold text-[#2d6a2d]">₱{price.toFixed(2)}</span>
                    {comparePrice && comparePrice > price && <span className="text-xs text-gray-400 line-through">₱{comparePrice.toFixed(2)}</span>}
                </div>
                <div className="flex gap-1.5">
                    <Link href={isLoggedIn ? route('customer.cart.index') : route('login')}
                        className="flex-1 rounded-lg border border-[#2d6a2d] py-1.5 text-center text-xs font-medium text-[#2d6a2d] transition-colors hover:bg-[#e8f5e9]">
                        Add to Cart
                    </Link>
                    <Link href={showRoute}
                        className="flex-1 rounded-lg bg-[#f59e0b] py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-[#d97706]">
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { products, categories, settings } = usePage<SharedData & {
        products: Product[];
        categories: Category[];
        settings: Record<string, string>;
    }>().props;

    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isLoggedIn = !!auth.user;

    const s = settings ?? {};
    const bannerBg = s.banner_image ? `/storage/${s.banner_image}` : null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoggedIn) router.get(route('customer.products.index'), { search });
        else router.get(route('login'));
    };

    const shopRoute = isLoggedIn ? route('products.index') : route('login');

    const navLinks = [
        { label: 'Home',      href: route('home') },
        { label: 'Product',   href: isLoggedIn ? route('products.index') : route('login') },
        { label: 'My Orders', href: isLoggedIn ? route('orders.index') : route('login') },
        { label: 'Favorites', href: isLoggedIn ? route('wishlist') : route('login') },
        { label: 'Addresses', href: isLoggedIn ? route('addresses') : route('login') },

    ];

    return (
        <>
            <Head title="CPSU-BSAB AgriShop" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white shadow-sm">
                    <div className="mx-auto flex h-[80px] max-w-6xl items-center gap-3 px-4">
                        <button onClick={() => setSidebarOpen(true)}
                            className="shrink-0 rounded-lg p-1.5 text-[#2d6a2d] transition-colors hover:bg-[#e8f5e9] sm:hidden" aria-label="Open menu">
                            <Menu className="h-6 w-6" />
                        </button>
                        <Link href="/" className="flex shrink-0 items-center gap-2">
                            <Leaf className="h-8 w-8 text-[#2d6a2d]" />
                            <span className="text-xl font-bold text-[#2d6a2d]">AgriShop</span>
                        </Link>
                        <nav className="hidden flex-1 items-center justify-center gap-1 overflow-x-auto sm:flex">
                            {navLinks.map((item) => (
                                <Link key={item.label} href={item.href}
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#2d6a2d] transition-colors hover:bg-[#e8f5e9] hover:text-[#1a4d1a]">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
                            <Link href={isLoggedIn ? route('cart.index') : route('login')} className="relative p-1">
                                <ShoppingCart className="h-5 w-5 text-gray-600" />
                            </Link>
                            {isLoggedIn ? (
                                <div className="relative">
                                    <button onClick={() => setDropdownOpen((o) => !o)}
                                        className="flex items-center gap-1.5 rounded-lg p-1.5 text-[#2d6a2d] transition-colors hover:bg-[#e8f5e9]">
                                        <User className="h-5 w-5" />
                                    </button>
                                    {dropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                            <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                                <Link href={route('dashboard')} onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2d6a2d] hover:bg-[#e8f5e9]">
                                                    <User className="h-4 w-4" /> {auth.user.name}
                                                </Link>
                                                <Link href={route('logout')} method="post" as="button" onClick={() => setDropdownOpen(false)}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
                                                    Logout
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link href={route('login')}
                                    className="flex items-center gap-1.5 rounded-lg bg-[#2d6a2d] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#245724]">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Mobile Sidebar */}
                {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={() => setSidebarOpen(false)} />}
                <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 sm:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-7 w-7 text-[#2d6a2d]" />
                            <span className="text-lg font-bold text-[#2d6a2d]">AgriShop</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {isLoggedIn && (
                        <div className="flex items-center gap-3 border-b border-gray-100 bg-[#e8f5e9] px-5 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d6a2d] text-white">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-500">{auth.user.email}</p>
                            </div>
                        </div>
                    )}
                    <nav className="flex flex-col py-3">
                        {navLinks.map((item) => (
                            <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-[#e8f5e9] hover:text-[#2d6a2d]">
                                {item.label}
                            </Link>
                        ))}
                        <div className="px-5 pt-3 pb-1">
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Products</p>
                        </div>
                        <Link href={shopRoute} onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#e8f5e9] hover:text-[#2d6a2d]">
                            <ShoppingBag className="h-4 w-4 text-[#2d6a2d]" /> All Products
                        </Link>
                        {(categories ?? []).map((cat) => (
                            <Link key={cat.id}
                                href={isLoggedIn ? route('customer.products.index') + `?category=${cat.id}` : route('login')}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#e8f5e9] hover:text-[#2d6a2d]">
                                {cat.image
                                    ? <img src={`/storage/${cat.image}`} alt={cat.name} className="h-6 w-6 rounded object-cover" />
                                    : <span className="text-base">🌿</span>}
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 px-5 py-4">
                        {isLoggedIn ? (
                            <Link href={route('logout')} method="post" as="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                                Logout
                            </Link>
                        ) : (
                            <Link href={route('login')}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d6a2d] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245724]">
                                Sign In
                            </Link>
                        )}
                    </div>
                </aside>

                {/* Page Content */}
                <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
                    {/* Hero Banner */}
                    <div
                        className="relative flex min-h-[200px] items-center overflow-hidden rounded-2xl p-8 text-white md:p-12"
                        style={bannerBg
                            ? { backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : { background: 'linear-gradient(to right, #1a4d1a, #2d6a2d, #4a9e4a)' }
                        }
                    >
                        {bannerBg && <div className="absolute inset-0 bg-black/40" />}
                        <div className="relative z-10 max-w-lg">
                            <p className="mb-1 text-sm font-medium tracking-wider text-green-200 uppercase">
                                {s.banner_subtitle || 'Welcome to CPSU-BSAB'}
                            </p>
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                                {s.banner_title || 'BSAB Essential Deals'}
                            </h1>
                            <p className="mb-5 text-lg text-green-100">
                                {s.banner_description || 'Start Your Farming Journey Today!'}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {(s.banner_badge || '15% OFF for CPSU Students!') && (
                                    <span className="rounded-full bg-[#f59e0b] px-5 py-2 text-sm font-bold text-white shadow-lg">
                                        {s.banner_badge || '15% OFF for CPSU Students!'}
                                    </span>
                                )}
                                <Link href={shopRoute}
                                    className="inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-[#2d6a2d] shadow-lg transition-colors hover:bg-green-50">
                                    {s.banner_shop_btn || 'Shop Now →'}
                                </Link>
                            </div>
                        </div>
                        {!bannerBg && (
                            <div className="absolute top-0 right-0 bottom-0 flex w-1/3 items-center justify-center text-[160px] opacity-10 select-none">
                                🌾
                            </div>
                        )}
                    </div>

                    {/* Flash Sale */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">⚡</span>
                                <h2 className="text-lg font-bold text-gray-800">{s.flash_title || 'Flash Sale'}</h2>
                                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-sm text-gray-500">
                                    <Clock className="h-3.5 w-3.5 text-red-500" />
                                    <span className="text-red-500">Ends <Countdown /></span>
                                </span>
                            </div>
                            <Link href={shopRoute} className="flex items-center gap-1 text-sm font-medium text-[#2d6a2d] hover:underline">
                                See all <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {(products ?? []).slice(0, 4).map((p) => {
                                const img = p.images?.find((i) => i.is_primary) ?? p.images?.[0];
                                return (
                                    <div key={p.id} className="overflow-hidden rounded-xl border border-gray-100 transition-shadow hover:shadow-md">
                                        <div className="flex h-28 items-center justify-center overflow-hidden bg-gray-50">
                                            {img ? <img src={`/storage/${img.image_path}`} alt={p.name} className="h-full w-full object-cover" />
                                                : <Package className="h-10 w-10 text-gray-200" />}
                                        </div>
                                        <div className="p-2.5">
                                            <p className="truncate text-xs font-medium text-gray-700">{p.name}</p>
                                            <p className="text-sm font-bold text-[#2d6a2d]">₱{parseFloat(p.price).toFixed(2)}</p>
                                            <div className="mt-0.5 flex items-center gap-1 text-xs text-red-500">
                                                <Clock className="h-3 w-3" /> <Countdown />
                                            </div>
                                            <Link href={isLoggedIn ? route('customer.products.show', p.id) : route('login')}
                                                className="mt-2 block w-full rounded-lg bg-[#2d6a2d] py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-[#245724]">
                                                Shop Now
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Categories */}
                    {(categories ?? []).length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-bold text-gray-800">{s.categories_title || 'Featured Categories'}</h2>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {categories.slice(0, 4).map((cat) => (
                                    <Link key={cat.id}
                                        href={isLoggedIn ? route('customer.products.index') + `?category=${cat.id}` : route('login')}
                                        className="group overflow-hidden rounded-xl border border-[#c8e6c9] bg-[#e8f5e9] transition-all hover:shadow-md hover:border-[#2d6a2d]">
                                        <div className="relative h-24 w-full overflow-hidden bg-[#c8e6c9]">
                                            {cat.image ? (
                                                <img
                                                    src={`/storage/${cat.image}`}
                                                    alt={cat.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-4xl">🌿</div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <span className="text-sm font-semibold text-[#2d6a2d] group-hover:text-[#1a4d1a]">{cat.name}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Latest Products */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">{s.products_title || 'Latest Products'}</h2>
                            <Link href={shopRoute} className="flex items-center gap-1 text-sm font-medium text-[#2d6a2d] hover:underline">
                                View all <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        {(products ?? []).length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {products.map((p) => <ProductCard key={p.id} product={p} isLoggedIn={isLoggedIn} />)}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
                                <Package className="mx-auto mb-3 h-12 w-12 text-gray-200" />
                                <p className="font-medium text-gray-500">No products available yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 bg-[#111] px-4 py-10 text-gray-400">
                    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-sm sm:grid-cols-4">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-[#4a9e4a]" />
                                <p className="font-bold text-white">{s.footer_brand || 'CPSU AgriShop'}</p>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-500">{s.footer_tagline || 'A modern e-commerce platform for CPSU-BSAB students and faculty.'}</p>
                        </div>
                        <div>
                            <p className="mb-3 font-bold text-white">{s.footer_col2_title || 'About Us'}</p>
                            {['About Us', 'Track Order', 'FAQ'].map((l) => (
                                <p key={l} className="cursor-pointer py-1 text-xs transition-colors hover:text-white">{l}</p>
                            ))}
                        </div>
                        <div>
                            <p className="mb-3 font-bold text-white">{s.footer_col3_title || 'Payments'}</p>
                            {(s.footer_payments || 'GCash,PayMaya,COD').split(',').map((l) => (
                                <p key={l} className="cursor-pointer py-1 text-xs transition-colors hover:text-white">{l.trim()}</p>
                            ))}
                        </div>
                        <div>
                            <p className="mb-3 font-bold text-white">{s.footer_col4_title || 'Follow Us'}</p>
                            <div className="flex gap-3">
                                {['📘', '📷', '▶️', '🎵'].map((icon, i) => (
                                    <span key={i} className="cursor-pointer text-xl transition-transform hover:scale-110">{icon}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto mt-8 flex max-w-6xl justify-between border-t border-gray-800 pt-4 text-xs text-gray-600">
                        <span>{s.footer_copyright || '© 2026 CPSU AgriShop. All rights reserved.'}</span>
                        <span className="cursor-pointer transition-colors hover:text-white">{s.footer_contact || 'Contact Us'}</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
