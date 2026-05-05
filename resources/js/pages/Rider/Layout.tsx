import { Link } from '@inertiajs/react';
import {
    BarChart2, Bike, Camera, Clock, LayoutDashboard, Leaf,
    LogOut, Menu, MessageCircle, Navigation, Package,
    RotateCcw, ShieldCheck, Smartphone, Wallet, Wrench, X,
} from 'lucide-react';
import { useState } from 'react';

export const RIDER_NAV = [
    { label: 'Dashboard',              href: 'rider.dashboard',        icon: LayoutDashboard },
    { label: 'Order Pickup',           href: 'rider.pickup',           icon: Package },
    { label: 'Order Handling',         href: 'rider.handling',         icon: Bike },
    { label: 'Navigation & Delivery',  href: 'rider.navigation',       icon: Navigation },
    { label: 'App Interaction',        href: 'rider.app-interaction',  icon: Smartphone },
    { label: 'Customer Communication', href: 'rider.communication',    icon: MessageCircle },
    { label: 'Payment Handling',       href: 'rider.payment',          icon: Wallet },
    { label: 'Proof of Delivery',      href: 'rider.proof',            icon: Camera },
    { label: 'Time Management',        href: 'rider.time',             icon: Clock },
    { label: 'Vehicle Maintenance',    href: 'rider.vehicle',          icon: Wrench },
    { label: 'Compliance & Safety',    href: 'rider.compliance',       icon: ShieldCheck },
    { label: 'Return Handling',        href: 'rider.returns',          icon: RotateCcw },
    { label: 'Performance',            href: 'rider.performance',      icon: BarChart2 },
];

export default function RiderLayout({ children, title }: { children: React.ReactNode; title: string }) {
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => {
        try { return window.location.pathname.startsWith(new URL(route(href)).pathname); } catch { return false; }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif", background: '#f4f8f3', color: '#1a2e1a' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                :root {
                    --rl-w: 220px; --rl-h: 60px;
                    --black: #1a2e1a; --white: #ffffff;
                    --green: #2d5a27; --green-dark: #1e3d1a;
                    --gray-100: #f4f8f3; --gray-200: #e8f0e6;
                    --gray-400: #6b7e68; --gray-600: #4a6741;
                    --border: 1px solid #d4ddd2;
                    --mono: 'JetBrains Mono', monospace;
                    --font: 'Inter', system-ui, sans-serif;
                }
                .rl-sidebar {
                    width: var(--rl-w); min-width: var(--rl-w); height: 100%;
                    background: var(--green); border-right: none;
                    display: flex; flex-direction: column; z-index: 200;
                    overflow-y: auto; flex-shrink: 0;
                    transition: transform .3s cubic-bezier(.4,0,.2,1);
                }
                .rl-logo { height: var(--rl-h); display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,.12); gap: 10px; flex-shrink: 0; }
                .rl-logo-mark { width: 28px; height: 28px; background: rgba(255,255,255,.2); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
                .rl-logo-mark span { color: var(--white); font-size: 14px; line-height: 1; }
                .rl-logo-text { font-family: var(--font); font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -.3px; }
                .rl-nav-section { padding: 20px 12px 8px; }
                .rl-nav-label { font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.45); padding: 0 8px; margin-bottom: 6px; }
                .rl-nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 400; color: rgba(255,255,255,.75); cursor: pointer; transition: background .15s, color .15s; text-decoration: none; margin-bottom: 1px; }
                .rl-nav-item:hover { background: rgba(255,255,255,.1); color: #fff; }
                .rl-nav-item.active { background: rgba(255,255,255,.18); color: #fff; font-weight: 500; }
                .rl-nav-item svg { width: 15px; height: 15px; flex-shrink: 0; }
                .rl-footer { margin-top: auto; padding: 14px 12px; border-top: 1px solid rgba(255,255,255,.12); display: flex; flex-direction: column; gap: 8px; }
                .rl-footer-link { display: flex; align-items: center; gap: 8px; font-size: 12px; font-family: var(--mono); color: rgba(255,255,255,.5); text-decoration: none; padding: 4px 8px; transition: color .15s; background: none; border: none; cursor: pointer; width: 100%; }
                .rl-footer-link:hover { color: #fff; }
                .rl-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; background: #f4f8f3; }
                .rl-header { height: var(--rl-h); background: var(--white); border-bottom: 1px solid #d4ddd2; display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 2px rgba(45,90,39,.06); }
                .rl-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7e68; font-family: var(--mono); }
                .rl-breadcrumb .current { color: var(--black); font-weight: 500; }
                .rl-header-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
                .rl-icon-btn { width: 34px; height: 34px; border: 1px solid #d4ddd2; background: var(--white); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .15s; position: relative; }
                .rl-icon-btn:hover { background: #f4f8f3; }
                .rl-icon-btn svg { width: 15px; height: 15px; }
                .rl-notif-dot { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; background: #dc2626; border-radius: 50%; border: 1.5px solid var(--white); }
                .rl-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #2d5a27, #4a7c42); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 11px; color: var(--white); flex-shrink: 0; text-decoration: none; }
                .rl-content { flex: 1; overflow-y: auto; padding: 28px; }
                .rl-hamburger { display: none; flex-direction: column; gap: 4px; cursor: pointer; padding: 4px; background: none; border: none; }
                .rl-hamburger span { display: block; width: 20px; height: 1.5px; background: #1a2e1a; }
                .rl-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 150; }

                /* Apex panel/card primitives for rider pages */
                .ap-panel { border: 1px solid #d4ddd2; background: var(--white); margin-bottom: 20px; border-radius: 10px; overflow: hidden; }
                .ap-panel-head { padding: 14px 18px; border-bottom: 1px solid #e8f0e6; display: flex; align-items: center; justify-content: space-between; }
                .ap-panel-title { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 500; color: #1a2e1a; }
                .ap-panel-body { padding: 18px; }
                .ap-metric { border: 1px solid #d4ddd2; padding: 20px; background: var(--white); position: relative; overflow: hidden; border-radius: 10px; }
                .ap-metric::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #2d5a27; transform: scaleX(0); transform-origin: left; transition: transform .3s; }
                .ap-metric:hover::after { transform: scaleX(1); }
                .ap-metric-label { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: #6b7e68; margin-bottom: 8px; }
                .ap-metric-value { font-size: 26px; font-weight: 700; color: #1a2e1a; letter-spacing: -1px; }
                .ap-badge { display: inline-flex; align-items: center; font-family: var(--mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; }
                .ap-badge-solid { background: #2d5a27; color: var(--white); }
                .ap-badge-outline { border: 1px solid #2d5a27; color: #2d5a27; }
                .ap-badge-muted { border: 1px dotted #6b7e68; color: #6b7e68; }
                .ap-tip { display: flex; align-items: flex-start; gap: 12px; border: 1px solid #d4ddd2; padding: 14px; background: #f4f8f3; margin-bottom: 10px; border-radius: 8px; }
                .ap-tip:last-child { margin-bottom: 0; }
                .ap-tip-icon { font-size: 18px; flex-shrink: 0; line-height: 1.4; }
                .ap-tip-title { font-size: 13px; font-weight: 500; margin-bottom: 2px; color: #1a2e1a; }
                .ap-tip-desc { font-size: 12px; color: #6b7e68; font-family: var(--mono); }
                .ap-warn { display: flex; align-items: flex-start; gap: 12px; border: 1px solid #e8c8c8; background: #fdf5f5; padding: 14px; margin-bottom: 20px; border-radius: 8px; }
                .ap-warn svg { color: #a32d2d; flex-shrink: 0; margin-top: 1px; }
                .ap-warn-text { font-size: 13px; color: #a32d2d; }
                .ap-info { display: flex; align-items: flex-start; gap: 12px; border: 1px solid #c5d9c1; background: #f4f8f3; padding: 14px; margin-bottom: 20px; border-radius: 8px; }
                .ap-info svg { color: #2d5a27; flex-shrink: 0; margin-top: 1px; }
                .ap-info-text { font-size: 13px; color: #2d5a27; }
                .ap-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; cursor: pointer; font-size: 13px; font-family: var(--font); font-weight: 500; transition: opacity .15s; border-radius: 8px; }
                .ap-btn:disabled { opacity: .5; cursor: not-allowed; }
                .ap-btn-primary { background: #2d5a27; color: var(--white); }
                .ap-btn-primary:hover:not(:disabled) { background: #1e3d1a; }
                .ap-btn-danger { background: #a32d2d; color: var(--white); }
                .ap-btn-danger:hover:not(:disabled) { opacity: .85; }
                .ap-btn-ghost { background: var(--white); color: #4a6741; border: 1px solid #d4ddd2; }
                .ap-btn-ghost:hover:not(:disabled) { background: #f4f8f3; }
                .ap-order-card { border: 1px solid #d4ddd2; background: var(--white); margin-bottom: 12px; border-radius: 10px; overflow: hidden; }
                .ap-order-head { padding: 12px 16px; border-bottom: 1px solid #e8f0e6; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
                .ap-order-body { padding: 14px 16px; }
                .ap-order-foot { padding: 10px 16px; border-top: 1px solid #e8f0e6; background: #f4f8f3; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
                .ap-prog-track { flex: 1; height: 4px; background: #d4ddd2; border-radius: 2px; }
                .ap-prog-fill { height: 100%; background: #2d5a27; border-radius: 2px; transition: width .8s cubic-bezier(.4,0,.2,1); }
                .ap-empty { text-align: center; padding: 64px 0; }
                .ap-empty svg { color: #d4ddd2; margin: 0 auto 12px; }
                .ap-empty p { font-size: 13px; color: #6b7e68; font-family: var(--mono); }

                @media (max-width: 720px) {
                    .rl-sidebar { position: fixed; left: 0; top: 0; height: 100%; transform: translateX(calc(-1 * var(--rl-w))); }
                    .rl-sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,.2); }
                    .rl-overlay { display: block; }
                    .rl-hamburger { display: flex; }
                    .rl-content { padding: 20px 16px; }
                }
            `}</style>

            {open && <div className="rl-overlay" style={{ opacity: 1 }} onClick={() => setOpen(false)} />}

            {/* Sidebar */}
            <aside className={`rl-sidebar${open ? ' open' : ''}`}>
                <div className="rl-logo">
                    <div className="rl-logo-mark">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 9 10 8M12 12c0-5 5-8 10-8-1 5-4 9-10 8"/>
                        </svg>
                    </div>
                    <span className="rl-logo-text">AgriShop</span>
                </div>

                <div className="rl-nav-section">
                    <div className="rl-nav-label">Rider</div>
                    {RIDER_NAV.map(({ label, href, icon: Icon }) => (
                        <Link key={href} href={route(href)}
                            className={`rl-nav-item${isActive(href) ? ' active' : ''}`}
                            onClick={() => setOpen(false)}>
                            <Icon />
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="rl-footer">
                    <Link href={route('profile.show')} className="rl-footer-link">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>
                        My Profile
                    </Link>
                    <Link href={route('home')} className="rl-footer-link">
                        <Leaf style={{ width: 14, height: 14 }} /> Back to Shop
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="rl-footer-link" style={{ color: '#a32d2d' }}>
                        <LogOut style={{ width: 14, height: 14 }} /> Logout
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="rl-main">
                <header className="rl-header">
                    <button className="rl-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
                        <span /><span /><span />
                    </button>
                    <div className="rl-breadcrumb">
                        <span>AgriShop</span>
                        <span style={{ fontSize: 11 }}>›</span>
                        <span className="current">{title}</span>
                    </div>
                    <div className="rl-header-right">
                        <button className="rl-icon-btn" title="Notifications">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2a4 4 0 0 1 4 4v3l1 2H3l1-2V6a4 4 0 0 1 4-4z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>
                            <span className="rl-notif-dot" />
                        </button>
                        <Link href={route('profile.show')} className="rl-avatar" style={{ textDecoration: 'none' }}>RD</Link>
                    </div>
                </header>
                <main className="rl-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
