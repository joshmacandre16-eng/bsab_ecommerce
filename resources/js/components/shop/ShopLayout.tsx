import { Link, router, usePage } from '@inertiajs/react';
import { Leaf, Search, User, ShoppingCart, ChevronDown, ChevronRight, Menu, X, Pencil, Check } from 'lucide-react';
import { useState, useRef, useEffect, type ReactNode, type ElementType } from 'react';
import { type SharedData } from '@/types';

interface NavItem {
    label: string;
    href?: string;
    routeName?: string;
    children?: { label: string; href?: string; routeName?: string; params?: Record<string, string> }[];
}

const NAV: NavItem[] = [
    { label: 'Home', routeName: 'home' },
    { label: 'All Products', routeName: 'shop.products' },
    {
        label: 'BSAB Apparel',
        routeName: 'shop.apparel',
        children: [
            { label: 'All Apparel', routeName: 'shop.apparel' },
            { label: 'Polo Shirts', routeName: 'shop.apparel', params: { sub: 'polo' } },
            { label: 'T-Shirts', routeName: 'shop.apparel', params: { sub: 'tshirt' } },
            { label: 'Lab Gowns', routeName: 'shop.apparel', params: { sub: 'gown' } },
            { label: 'Caps & Accessories', routeName: 'shop.apparel', params: { sub: 'accessories' } },
        ],
    },
    { label: 'Study Guides', routeName: 'shop.study-guides' },
    {
        label: 'Tools',
        routeName: 'shop.tools',
        children: [
            { label: 'All Tools', routeName: 'shop.tools' },
            { label: 'Field Tools', routeName: 'shop.tools', params: { sub: 'field' } },
            { label: 'Garden Tools', routeName: 'shop.tools', params: { sub: 'garden' } },
            { label: 'Soil Testers', routeName: 'shop.tools', params: { sub: 'soil' } },
            { label: 'Measuring Tools', routeName: 'shop.tools', params: { sub: 'measuring' } },
        ],
    },
    { label: 'Deals', routeName: 'shop.deals' },
    {
        label: 'Categories',
        routeName: 'shop.categories',
        children: [
            { label: 'All Categories', routeName: 'shop.categories' },
            { label: 'Seeds & Seedlings', routeName: 'shop.categories', params: { sub: 'seeds' } },
            { label: 'Fertilizers', routeName: 'shop.categories', params: { sub: 'fertilizers' } },
            { label: 'Books & Guides', routeName: 'shop.categories', params: { sub: 'books' } },
            { label: 'Uniforms', routeName: 'shop.categories', params: { sub: 'uniforms' } },
        ],
    },
];

function DropdownMenu({ item, active }: { item: NavItem; active: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    type ChildItem = { label: string; href?: string; routeName?: string; params?: Record<string, string> };
    const navigate = (n: NavItem | ChildItem) => {
        if (n.routeName && 'params' in n && n.params) router.visit(route(n.routeName, n.params));
        else if (n.routeName) router.visit(route(n.routeName));
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => item.children ? setOpen(v => !v) : navigate(item)}
                className={`px-4 py-2.5 text-sm whitespace-nowrap flex items-center gap-1 transition-colors text-[#2d6a2d] hover:bg-[#e8f5e9] hover:text-[#1a4d1a] ${active ? 'bg-[#e8f5e9] font-semibold border-b-2 border-[#2d6a2d]' : ''}`}
            >
                {item.label}
                {item.children && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
            </button>
            {item.children && open && (
                <div className="absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-b-xl min-w-[180px] z-50 border border-gray-100 overflow-hidden">
                    {item.children.map((child, i) => (
                        <button key={i} onClick={() => navigate(child)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#e8f5e9] hover:text-[#2d6a2d] transition-colors border-b border-gray-50 last:border-0">
                            {child.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Inline editable field for header/footer
function InlineEdit({ value, onSave, className, dark = false }: {
    value: string;
    onSave: (v: string) => void;
    className?: string;
    dark?: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
    useEffect(() => { setDraft(value); }, [value]);

    if (editing) return (
        <span className="inline-flex items-center gap-1">
            <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { onSave(draft); setEditing(false); } if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
                className={`border rounded px-2 py-0.5 text-sm min-w-[120px] ${dark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`} />
            <button onClick={() => { onSave(draft); setEditing(false); }} className="p-0.5 bg-[#2d6a2d] text-white rounded"><Check className="h-3 w-3" /></button>
            <button onClick={() => { setDraft(value); setEditing(false); }} className="p-0.5 bg-gray-400 text-white rounded"><X className="h-3 w-3" /></button>
        </span>
    );

    return (
        <span className={`group/ie inline-flex items-center gap-1 ${className ?? ''}`}>
            {value}
            <button onClick={() => setEditing(true)}
                className="opacity-0 group-hover/ie:opacity-100 transition-opacity p-0.5 rounded bg-white/20 hover:bg-white/40">
                <Pencil className="h-3 w-3" />
            </button>
        </span>
    );
}

interface Settings {
    site_name: string;
    site_tagline: string;
    footer_brand: string;
    footer_tagline: string;
    footer_col2_title: string;
    footer_col3_title: string;
    footer_payments: string;
    footer_col4_title: string;
    footer_copyright: string;
    footer_contact: string;
    [key: string]: string;
}

interface Props {
    children: ReactNode;
    activeNav?: string;
    onSearch?: (q: string) => void;
    searchValue?: string;
    settings?: Settings;
    isSuperAdmin?: boolean;
    onSaveField?: (key: string, value: string) => void;
}

export default function ShopLayout({ children, activeNav = 'home', onSearch, searchValue = '', settings, isSuperAdmin = false, onSaveField }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(searchValue);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Lock body scroll when sidebar open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navigateMobile = (routeName: string, params?: Record<string, string>) => {
        setMobileOpen(false);
        setOpenSubmenu(null);
        if (params) router.visit(route(routeName, params));
        else router.visit(route(routeName));
    };

    const save = (key: string) => (val: string) => onSaveField?.(key, val);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) { onSearch(search); return; }
        router.get(route('shop.products'), { search }, { preserveState: true });
    };

    const siteName = settings?.site_name ?? 'AgriShop';
    const siteTagline = settings?.site_tagline ?? 'CPSU AgriShop';
    const payments = (settings?.footer_payments ?? 'GCash,PayMaya,COD').split(',').map(s => s.trim());

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ── Backdrop ── */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ zIndex: 999 }}
            />

            {/* ── Slide-in Sidebar ── */}
            <aside
                className="fixed top-0 left-0 h-full w-72 bg-[#1a4d1a] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden"
                style={{ zIndex: 1000, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d6a2d] shrink-0">
                    <div className="flex items-center gap-2">
                        <Leaf className="h-6 w-6 text-[#4a9e4a]" />
                        <span className="text-lg font-bold">{settings?.site_name ?? 'AgriShop'}</span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-[#2d6a2d] transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sidebar Nav */}
                <nav className="flex-1 overflow-y-auto py-3">
                    {NAV.map(item => (
                        <div key={item.label}>
                            <button
                                onClick={() => {
                                    if (item.children) {
                                        setOpenSubmenu(prev => prev === item.label ? null : item.label);
                                    } else if (item.routeName) {
                                        navigateMobile(item.routeName);
                                    }
                                }}
                                className={`w-full text-left flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-[#2d6a2d] transition-colors ${
                                    activeNav === item.label ? 'bg-[#2d6a2d]' : ''
                                }`}
                            >
                                {item.label}
                                {item.children && (
                                    <ChevronRight className={`h-4 w-4 text-green-300 transition-transform duration-200 ${
                                        openSubmenu === item.label ? 'rotate-90' : ''
                                    }`} />
                                )}
                            </button>
                            {/* Submenu */}
                            {item.children && openSubmenu === item.label && (
                                <div className="bg-[#163d16]">
                                    {item.children.map((child, i) => (
                                        <button
                                            key={i}
                                            onClick={() => child.routeName && navigateMobile(child.routeName, child.params)}
                                            className="w-full text-left px-8 py-2.5 text-sm text-green-200 hover:bg-[#2d6a2d] hover:text-white transition-colors border-t border-[#1a4d1a]"
                                        >
                                            {child.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-5 py-4 border-t border-[#2d6a2d] text-xs text-green-300 shrink-0">
                    © 2025 CPSU AgriShop
                </div>
            </aside>

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
                    {/* Hamburger — mobile only */}
                    <button
                        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5 text-[#2d6a2d]" />
                    </button>
                    <Link href={route('home')} className="flex items-center gap-2 shrink-0">
                        <Leaf className="h-8 w-8 text-[#2d6a2d]" />
                        {isSuperAdmin && onSaveField ? (
                            <InlineEdit value={siteName} onSave={save('site_name')} className="text-xl font-bold text-[#2d6a2d]" />
                        ) : (
                            <span className="text-xl font-bold text-[#2d6a2d]">{siteName}</span>
                        )}
                    </Link>
                    <form onSubmit={handleSearch} className="flex-1 flex">
                        <input type="text" placeholder="Search for Agri Supplies, Books, Tools, Uniforms..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] focus:border-transparent" />
                        <button type="submit" className="bg-[#2d6a2d] text-white px-4 rounded-r-lg hover:bg-[#245724] transition-colors">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href={auth.user ? route('dashboard') : route('login')}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2d6a2d] transition-colors">
                            <User className="h-5 w-5" />
                            <span className="hidden sm:inline">{auth.user ? auth.user.name : 'Sign In'}</span>
                        </Link>
                        <button className="relative p-1">
                            <ShoppingCart className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
                        </button>
                        {/* Hamburger — mobile only */}
                        <button
                            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5 text-[#2d6a2d]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Desktop Nav */}
            <nav className="bg-white border-b border-gray-200 shadow-sm hidden md:block">
                <div className="max-w-6xl mx-auto flex items-center justify-center px-4">
                    {NAV.map(item => (
                        <DropdownMenu key={item.label} item={item} active={activeNav === item.label} />
                    ))}
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#111] text-gray-400 py-10 px-4 mt-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Leaf className="h-5 w-5 text-[#4a9e4a]" />
                            <p className="font-bold text-white">
                                {isSuperAdmin && onSaveField
                                    ? <InlineEdit value={settings?.footer_brand ?? 'CPSU AgriShop'} onSave={save('footer_brand')} className="font-bold text-white" dark />
                                    : (settings?.footer_brand ?? 'CPSU AgriShop')}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {isSuperAdmin && onSaveField
                                ? <InlineEdit value={settings?.footer_tagline ?? ''} onSave={save('footer_tagline')} className="text-xs text-gray-500" dark />
                                : (settings?.footer_tagline ?? 'A modern e-commerce platform for CPSU-BSAB students and faculty.')}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-white mb-3">
                            {isSuperAdmin && onSaveField
                                ? <InlineEdit value={settings?.footer_col2_title ?? 'Quick Links'} onSave={save('footer_col2_title')} className="font-bold text-white" dark />
                                : (settings?.footer_col2_title ?? 'Quick Links')}
                        </p>
                        {NAV.filter(n => !n.children).map(n => (
                            <button key={n.label} onClick={() => n.routeName && router.visit(route(n.routeName))}
                                className="block py-1 text-xs hover:text-white transition-colors">{n.label}</button>
                        ))}
                    </div>
                    <div>
                        <p className="font-bold text-white mb-3">
                            {isSuperAdmin && onSaveField
                                ? <InlineEdit value={settings?.footer_col3_title ?? 'Payments'} onSave={save('footer_col3_title')} className="font-bold text-white" dark />
                                : (settings?.footer_col3_title ?? 'Payments')}
                        </p>
                        {isSuperAdmin && onSaveField ? (
                            <>
                                <InlineEdit value={settings?.footer_payments ?? 'GCash,PayMaya,COD'} onSave={save('footer_payments')} className="text-xs text-gray-400" dark />
                                <p className="text-xs text-gray-600 mt-1">(comma-separated)</p>
                            </>
                        ) : (
                            payments.map(l => <p key={l} className="py-1 text-xs hover:text-white cursor-pointer transition-colors">{l}</p>)
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-white mb-3">
                            {isSuperAdmin && onSaveField
                                ? <InlineEdit value={settings?.footer_col4_title ?? 'Follow Us'} onSave={save('footer_col4_title')} className="font-bold text-white" dark />
                                : (settings?.footer_col4_title ?? 'Follow Us')}
                        </p>
                        <div className="flex gap-3">
                            {['📘', '📷', '▶️', '🎵'].map((s, i) => <span key={i} className="cursor-pointer hover:scale-110 transition-transform text-xl">{s}</span>)}
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-600">
                    <span>
                        {isSuperAdmin && onSaveField
                            ? <InlineEdit value={settings?.footer_copyright ?? '© 2025 CPSU AgriShop. All rights reserved.'} onSave={save('footer_copyright')} className="text-xs text-gray-600" dark />
                            : (settings?.footer_copyright ?? '© 2025 CPSU AgriShop. All rights reserved.')}
                    </span>
                    <span className="hover:text-white cursor-pointer transition-colors">
                        {isSuperAdmin && onSaveField
                            ? <InlineEdit value={settings?.footer_contact ?? 'Contact Us'} onSave={save('footer_contact')} className="text-xs text-gray-600" dark />
                            : (settings?.footer_contact ?? 'Contact Us')}
                    </span>
                </div>
            </footer>
        </div>
    );
}
