import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';

interface NavItem { name: string; routeName: string; icon: string }
interface NavSection { label: string; items: NavItem[] }

interface Props {
    children: ReactNode;
    breadcrumb?: string;
    role?: 'admin' | 'seller';
    nav: NavSection[];
    roleLabel: string;
    accentClass: string;
}

const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
    --sidebar-w: 256px;
    --header-h: 64px;
    --font: 'Inter', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;

    --bg: #f4f8f3;
    --surface: #ffffff;
    --surface-2: #eef4ec;
    --border: #d4ddd2;
    --border-light: #e8f0e6;

    --text-primary: #1a2e1a;
    --text-secondary: #4a6741;
    --text-muted: #6b7e68;

    --accent: #2d5a27;
    --accent-light: #e8f5e4;
    --accent-hover: #1e3d1a;

    --success: #16a34a;
    --warning: #d97706;
    --danger: #dc2626;

    --shadow-sm: 0 1px 2px rgba(45,90,39,.06);
    --shadow: 0 1px 3px rgba(45,90,39,.1), 0 1px 2px rgba(45,90,39,.06);
    --shadow-md: 0 4px 6px -1px rgba(45,90,39,.1), 0 2px 4px -1px rgba(45,90,39,.06);
    --shadow-lg: 0 10px 15px -3px rgba(45,90,39,.12), 0 4px 6px -2px rgba(45,90,39,.06);

    --radius: 8px;
    --radius-sm: 6px;
    --radius-lg: 12px;
}

html, body { height: 100%; }

.ap-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: var(--font);
    background: var(--bg);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
}

/* ── Overlay ── */
.ap-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    z-index: 199;
    backdrop-filter: blur(2px);
}
.ap-overlay.show { display: block; }

/* ── Sidebar ── */
.ap-sidebar {
    width: var(--sidebar-w);
    min-width: var(--sidebar-w);
    height: 100%;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 200;
    overflow: hidden;
    flex-shrink: 0;
    transition: transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s;
}

/* ── Logo ── */
.ap-logo {
    height: var(--header-h);
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
    gap: 12px;
    flex-shrink: 0;
    text-decoration: none;
}
.ap-logo-icon {
    width: 34px; height: 34px;
    border-radius: var(--radius-sm);
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
}
.ap-logo-icon svg { width: 18px; height: 18px; }
.ap-logo-name { font-size: 16px; font-weight: 700; color: var(--text-primary); letter-spacing: -.3px; }
.ap-logo-badge {
    margin-left: auto;
    font-size: 9px;
    font-weight: 600;
    font-family: var(--mono);
    letter-spacing: .08em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface-2);
    color: var(--text-muted);
    border: 1px solid var(--border);
}

/* ── Nav ── */
.ap-nav { flex: 1; overflow-y: auto; padding: 12px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.ap-nav::-webkit-scrollbar { width: 4px; }
.ap-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

.ap-nav-group { margin-bottom: 4px; }
.ap-nav-group-label {
    font-size: 10px;
    font-weight: 600;
    font-family: var(--mono);
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 12px 10px 4px;
    display: block;
}
.ap-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    font-size: 13.5px;
    font-weight: 400;
    color: var(--text-secondary);
    text-decoration: none;
    transition: background .12s, color .12s;
    margin-bottom: 1px;
    position: relative;
}
.ap-nav-link:hover { background: var(--surface-2); color: var(--text-primary); }
.ap-nav-link.active {
    background: var(--accent);
    color: #fff;
    font-weight: 500;
}
.ap-nav-link.active::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: #a8d5a2;
}
.ap-nav-icon {
    width: 32px; height: 32px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    background: transparent;
    transition: background .12s;
}
.ap-nav-link:hover .ap-nav-icon { background: var(--border-light); }
.ap-nav-link.active .ap-nav-icon { background: rgba(255,255,255,.15); }

/* ── Sidebar Footer ── */
.ap-sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
}
.ap-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background .12s;
}
.ap-user-card:hover { background: var(--surface-2); }
.ap-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c42 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    letter-spacing: .02em;
}
.ap-user-info { flex: 1; min-width: 0; }
.ap-user-name { font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ap-user-role { font-size: 11px; color: var(--text-muted); font-family: var(--mono); text-transform: uppercase; letter-spacing: .06em; }
.ap-logout-btn {
    width: 30px; height: 30px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    transition: background .12s, color .12s;
    flex-shrink: 0;
}
.ap-logout-btn:hover { background: #fee2e2; color: var(--danger); }

/* Sidebar green tint */
.ap-sidebar { background: #2d5a27; border-right: none; }
.ap-logo { border-bottom: 1px solid rgba(255,255,255,.12); }
.ap-logo-name { color: #fff; }
.ap-logo-badge { background: rgba(255,255,255,.12); color: rgba(255,255,255,.7); border-color: rgba(255,255,255,.15); }
.ap-nav-group-label { color: rgba(255,255,255,.45); }
.ap-nav-link { color: rgba(255,255,255,.75); }
.ap-nav-link:hover { background: rgba(255,255,255,.1); color: #fff; }
.ap-nav-link.active { background: rgba(255,255,255,.18); color: #fff; }
.ap-nav-link.active::before { background: #a8d5a2; }
.ap-sidebar-footer { border-top: 1px solid rgba(255,255,255,.12); }
.ap-user-card:hover { background: rgba(255,255,255,.1); }
.ap-user-name { color: #fff; }
.ap-user-role { color: rgba(255,255,255,.5); }
.ap-logout-btn { color: rgba(255,255,255,.5); }
.ap-logout-btn:hover { background: rgba(220,38,38,.25); color: #fca5a5; }

/* ── Main ── */
.ap-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

/* ── Header ── */
.ap-header {
    height: var(--header-h);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
}
.ap-hamburger {
    display: none;
    width: 36px; height: 36px;
    border-radius: var(--radius-sm);
    align-items: center; justify-content: center;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: 1px solid var(--border);
    transition: background .12s;
    flex-shrink: 0;
}
.ap-hamburger:hover { background: var(--surface-2); }
.ap-hamburger span { display: block; width: 16px; height: 1.5px; background: var(--text-secondary); border-radius: 2px; transition: .2s; }

.ap-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-muted);
    font-family: var(--mono);
    min-width: 0;
}
.ap-breadcrumb-sep { font-size: 10px; color: var(--border); }
.ap-breadcrumb-current { color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ap-header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.ap-header-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c42 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #fff;
    text-decoration: none;
    cursor: pointer;
    transition: opacity .15s;
    flex-shrink: 0;
}
.ap-header-avatar:hover { opacity: .85; }

.ap-header-btn {
    width: 34px; height: 34px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid var(--border);
    cursor: pointer; color: var(--text-secondary);
    transition: background .12s, color .12s;
    text-decoration: none;
}
.ap-header-btn:hover { background: var(--surface-2); color: var(--text-primary); }

/* ── Header Dropdown ── */
.ap-hdr-drop-wrap { position: relative; }
.ap-hdr-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 220px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    z-index: 300;
    overflow: hidden;
    animation: dropIn .12s ease;
}
@keyframes dropIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.ap-hdr-drop-banner {
    padding: 10px 14px;
    background: var(--accent-light);
    border-bottom: 1px solid var(--border-light);
    font-size: 12px;
    color: var(--accent);
    font-weight: 500;
}
.ap-hdr-drop-banner span { display: block; font-size: 11px; color: var(--text-muted); font-weight: 400; margin-top: 2px; }
.ap-hdr-drop-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    transition: background .1s, color .1s;
}
.ap-hdr-drop-item:hover { background: var(--surface-2); color: var(--text-primary); }
.ap-hdr-drop-sep { height: 1px; background: var(--border-light); margin: 2px 0; }

/* ── Content ── */
.ap-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
}
.ap-content::-webkit-scrollbar { width: 6px; }
.ap-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* ── Responsive ── */
@media (max-width: 1024px) {
    :root { --sidebar-w: 240px; }
    .ap-content { padding: 24px; }
}

@media (max-width: 768px) {
    .ap-sidebar {
        position: fixed;
        left: 0; top: 0;
        height: 100%;
        transform: translateX(calc(-1 * var(--sidebar-w)));
        box-shadow: none;
    }
    .ap-sidebar.open {
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
    }
    .ap-hamburger { display: flex; }
    .ap-content { padding: 20px 16px; }
    .ap-header { padding: 0 16px; }
}

@media (max-width: 480px) {
    .ap-content { padding: 16px 12px; }
    .ap-logo-badge { display: none; }
}
`;

export default function AppShell({ children, breadcrumb, nav, roleLabel, accentClass }: Props) {
    const [open, setOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;
    const initials = auth?.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? roleLabel[0];

    useEffect(() => {
        const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setDropOpen(false); } };
        document.addEventListener('keydown', close);
        return () => document.removeEventListener('keydown', close);
    }, []);

    const isActive = (routeName: string) => {
        try { return url.startsWith(new URL(route(routeName)).pathname); } catch { return false; }
    };

    return (
        <div className="ap-shell">
            <style>{SHARED_CSS}</style>

            {/* Overlay */}
            <div className={`ap-overlay${open ? ' show' : ''}`} onClick={() => setOpen(false)} />

            {/* Sidebar */}
            <aside className={`ap-sidebar${open ? ' open' : ''}`}>
                {/* Logo */}
                <div className="ap-logo">
                    <div className="ap-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 9 10 8M12 12c0-5 5-8 10-8-1 5-4 9-10 8"/>
                        </svg>
                    </div>
                    <span className="ap-logo-name">AgriShop</span>
                    <span className="ap-logo-badge">{roleLabel}</span>
                </div>

                {/* Nav */}
                <nav className="ap-nav">
                    {nav.map((section) => (
                        <div className="ap-nav-group" key={section.label}>
                            <span className="ap-nav-group-label">{section.label}</span>
                            {section.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={route(item.routeName)}
                                    className={`ap-nav-link${isActive(item.routeName) ? ' active' : ''}`}
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="ap-nav-icon">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="ap-sidebar-footer">
                    <div className="ap-user-card">
                        <Link href={route('profile.show')} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, textDecoration: 'none' }} onClick={() => setOpen(false)}>
                            <div className="ap-avatar">{initials}</div>
                            <div className="ap-user-info">
                                <div className="ap-user-name">{auth?.user?.name ?? roleLabel}</div>
                                <div className="ap-user-role">{roleLabel}</div>
                            </div>
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="ap-logout-btn" title="Sign out">
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="ap-main">
                {/* Header */}
                <header className="ap-header">
                    <button className="ap-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                        <span /><span /><span />
                    </button>

                    <div className="ap-breadcrumb">
                        <span>AgriShop</span>
                        <span className="ap-breadcrumb-sep">›</span>
                        <span className="ap-breadcrumb-current">{breadcrumb ?? roleLabel}</span>
                    </div>

                    <div className="ap-header-right">
                        <div className="ap-hdr-drop-wrap">
                            <button
                                className="ap-header-avatar"
                                title="Account"
                                onClick={() => setDropOpen(v => !v)}
                                style={{ border: 'none' }}
                            >
                                {initials}
                            </button>
                            {dropOpen && (
                                <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={() => setDropOpen(false)} />
                                    <div className="ap-hdr-dropdown">
                                        <div className="ap-hdr-drop-banner">
                                            🛍 You are in {roleLabel} Mode
                                            <span>Switch back to browse and shop as a customer</span>
                                        </div>
                                        <Link
                                            href={route('role.switch')}
                                            method="post"
                                            as="button"
                                            data={{ role: 'customer' }}
                                            className="ap-hdr-drop-item"
                                            onClick={() => setDropOpen(false)}
                                        >
                                            🏠 Switch to Customer
                                        </Link>
                                        <div className="ap-hdr-drop-sep" />
                                        <Link href={route('profile.show')} className="ap-hdr-drop-item" onClick={() => setDropOpen(false)}>
                                            👤 Profile
                                        </Link>
                                        <div className="ap-hdr-drop-sep" />
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="ap-hdr-drop-item"
                                            style={{ color: 'var(--danger)' }}
                                            onClick={() => setDropOpen(false)}
                                        >
                                            🚪 Log out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="ap-content">{children}</main>
            </div>
        </div>
    );
}
