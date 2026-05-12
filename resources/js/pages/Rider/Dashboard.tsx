import { Head, Link } from '@inertiajs/react';
import { Bike, CheckCircle, Clock, Package, Star, TrendingUp, Wallet } from 'lucide-react';
import RiderLayout from './Layout';

interface Stats {
    totalDeliveries: number;
    completedToday: number;
    pendingPickups: number;
    activeDeliveries: number;
    totalEarnings: number;
    todayEarnings: number;
    rating: number;
    successRate: number;
}
interface Delivery {
    id: number;
    order_number: string;
    status: string;
    customer_name: string;
    total: number;
    created_at: string;
    customer?: { name: string };
}

const STATUS_DOT: Record<string, string> = {
    pending: '#f59e0b',
    picked_up: '#3b82f6',
    on_the_way: '#8b5cf6',
    delivered: '#22c55e',
    failed: '#ef4444',
    returned: '#b0afa8',
};

export default function RiderDashboard({
    stats,
    recentDeliveries,
    pendingOrders,
}: {
    stats: Stats;
    recentDeliveries: Delivery[];
    pendingOrders: Delivery[];
}) {
    const cardConfigs = [
        { label: 'Total Deliveries', value: stats.totalDeliveries, accent: 'green', icon: <Bike size={20} /> },
        { label: 'Completed Today', value: stats.completedToday, accent: 'teal', icon: <CheckCircle size={20} /> },
        { label: 'Pending Pickups', value: stats.pendingPickups, accent: 'blue', icon: <Package size={20} /> },
        { label: 'Active Deliveries', value: stats.activeDeliveries, accent: 'purple', icon: <Clock size={20} /> },
        { label: 'Total Earnings', value: `₱${stats.totalEarnings.toFixed(2)}`, accent: 'lime', icon: <Wallet size={20} /> },
        { label: "Today's Earnings", value: `₱${stats.todayEarnings.toFixed(2)}`, accent: 'amber', icon: <TrendingUp size={20} /> },
        { label: 'Rating', value: `${stats.rating.toFixed(1)} ★`, accent: 'purple', icon: <Star size={20} /> },
        { label: 'Success Rate', value: `${stats.successRate}%`, accent: 'green', icon: <CheckCircle size={20} /> },
    ];

    const accentColors: Record<string, { accent: string; ci: string }> = {
        green: { accent: 'accent-green', ci: 'ci-green' },
        teal: { accent: 'accent-teal', ci: 'ci-teal' },
        blue: { accent: 'accent-blue', ci: 'ci-blue' },
        purple: { accent: 'accent-purple', ci: 'ci-purple' },
        lime: { accent: 'accent-lime', ci: 'ci-lime' },
        amber: { accent: 'accent-amber', ci: 'ci-amber' },
        red: { accent: 'accent-red', ci: 'ci-red' },
    };

    return (
        <RiderLayout title="Dashboard">
            <Head title="Rider Dashboard" />

            <style>{`
                :root {
                    --green-950: #0e2610;
                    --green-900: #173d14;
                    --green-800: #1e5219;
                    --green-700: #2d6a27;
                    --green-600: #3d8535;
                    --green-500: #4fa344;
                    --green-400: #72bf68;
                    --green-200: #b8e0b3;
                    --green-100: #d6efd3;
                    --green-50: #edf7eb;

                    --teal-700: #0d7060;
                    --teal-100: #d0f0ea;
                    --teal-50: #e5f8f4;

                    --blue-700: #1a5fa8;
                    --blue-100: #d3e8fb;
                    --blue-50: #eaf3fd;

                    --amber-700: #b56b10;
                    --amber-100: #fde8c0;
                    --amber-50: #fef5e3;

                    --red-700: #b52c2c;
                    --red-100: #fbc9c9;
                    --red-50: #fdeaea;

                    --purple-700: #5c35a0;
                    --purple-100: #e0d5f8;
                    --purple-50: #f0eafd;

                    --lime-700: #4d7a0e;
                    --lime-100: #daedb8;
                    --lime-50: #edf7d8;

                    --gray-50: #f6f8f3;
                    --gray-100: #edf0e8;
                    --gray-200: #dde3d5;
                    --text-primary: #1a3017;
                    --text-secondary: #5a7056;
                    --text-muted: #8fa88b;
                    --border: #dde3d5;
                    --border-hover: #b0caa8;
                    --radius-md: 12px;
                    --shadow-card: 0 1px 3px rgba(30,82,25,0.07), 0 1px 2px rgba(30,82,25,0.05);
                    --shadow-card-hover: 0 4px 12px rgba(30,82,25,0.1), 0 2px 4px rgba(30,82,25,0.06);
                }

                .dashboard-topbar {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 26px;
                }

                .dashboard-heading {
                    font-size: 26px;
                    font-family: 'Instrument Serif', serif;
                    color: var(--text-primary);
                    letter-spacing: -0.4px;
                    line-height: 1;
                }

                .dashboard-subheading {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-top: 2px;
                }

                .cards-row {
                    display: grid;
                    gap: 14px;
                    margin-bottom: 14px;
                }

                .cols-4 {
                    grid-template-columns: repeat(4, 1fr);
                }

                .cols-2 {
                    grid-template-columns: repeat(2, 1fr);
                }

                @media (max-width: 1100px) {
                    .cols-4 {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .cols-4 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .cols-2 {
                        grid-template-columns: 1fr;
                    }
                }

                .stat-card {
                    background: white;
                    border-radius: var(--radius-md);
                    padding: 18px 16px 14px;
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-card);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-card-hover);
                    border-color: var(--border-hover);
                }

                .stat-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    border-radius: var(--radius-md) var(--radius-md) 0 0;
                }

                .accent-green::after { background: var(--green-600); }
                .accent-teal::after { background: var(--teal-700); }
                .accent-blue::after { background: var(--blue-700); }
                .accent-purple::after { background: var(--purple-700); }
                .accent-lime::after { background: var(--lime-700); }
                .accent-amber::after { background: var(--amber-700); }
                .accent-red::after { background: var(--red-700); }

                .card-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                }

                .card-icon svg {
                    width: 20px;
                    height: 20px;
                }

                .ci-green { background: var(--green-50); }
                .ci-green svg { color: var(--green-700); }
                .ci-teal { background: var(--teal-50); }
                .ci-teal svg { color: var(--teal-700); }
                .ci-blue { background: var(--blue-50); }
                .ci-blue svg { color: var(--blue-700); }
                .ci-purple { background: var(--purple-50); }
                .ci-purple svg { color: var(--purple-700); }
                .ci-lime { background: var(--lime-50); }
                .ci-lime svg { color: var(--lime-700); }
                .ci-amber { background: var(--amber-50); }
                .ci-amber svg { color: var(--amber-700); }
                .ci-red { background: var(--red-50); }
                .ci-red svg { color: var(--red-700); }

                .card-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.7px;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 5px;
                }

                .card-value {
                    font-family: 'Instrument Serif', serif;
                    font-size: 24px;
                    color: var(--text-primary);
                    letter-spacing: -0.5px;
                    line-height: 1;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stat-card {
                    animation: fadeUp 0.35s ease both;
                }

                .cards-row:nth-child(1) .stat-card:nth-child(1) { animation-delay: 0.05s; }
                .cards-row:nth-child(1) .stat-card:nth-child(2) { animation-delay: 0.10s; }
                .cards-row:nth-child(1) .stat-card:nth-child(3) { animation-delay: 0.15s; }
                .cards-row:nth-child(1) .stat-card:nth-child(4) { animation-delay: 0.20s; }
                .cards-row:nth-child(2) .stat-card:nth-child(1) { animation-delay: 0.25s; }
                .cards-row:nth-child(2) .stat-card:nth-child(2) { animation-delay: 0.30s; }
                .cards-row:nth-child(2) .stat-card:nth-child(3) { animation-delay: 0.35s; }
                .cards-row:nth-child(2) .stat-card:nth-child(4) { animation-delay: 0.40s; }
            `}</style>

            <div className="dashboard-topbar">
                <div>
                    <h1 className="dashboard-heading">Dashboard</h1>
                    <p className="dashboard-subheading">Check your pending pickups and active deliveries below.</p>
                </div>
            </div>

            {/* Metrics Row 1 */}
            <div className="cards-row cols-4">
                {cardConfigs.slice(0, 4).map((config) => {
                    const colors = accentColors[config.accent];
                    return (
                        <div key={config.label} className={`stat-card ${colors.accent}`}>
                            <div className={`card-icon ${colors.ci}`}>{config.icon}</div>
                            <div className="card-label">{config.label}</div>
                            <div className="card-value">{config.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Metrics Row 2 */}
            <div className="cards-row cols-4">
                {cardConfigs.slice(4, 8).map((config) => {
                    const colors = accentColors[config.accent];
                    return (
                        <div key={config.label} className={`stat-card ${colors.accent}`}>
                            <div className={`card-icon ${colors.ci}`}>{config.icon}</div>
                            <div className="card-label">{config.label}</div>
                            <div className="card-value">{config.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title">Quick Actions</span>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                        {[
                            { label: 'Order Pickup', href: 'rider.pickup', icon: '📦' },
                            { label: 'Active Delivery', href: 'rider.navigation', icon: '🗺️' },
                            { label: 'Proof of Delivery', href: 'rider.proof', icon: '📸' },
                            { label: 'My Performance', href: 'rider.performance', icon: '📊' },
                        ].map((a) => (
                            <Link
                                key={a.label}
                                href={route(a.href)}
                                className="btn btn-secondary"
                                style={{ flexDirection: 'column', padding: 16, gap: 8, justifyContent: 'center', height: 'auto' }}
                            >
                                <span style={{ fontSize: 22 }}>{a.icon}</span>
                                {a.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pending Pickups + Recent Deliveries */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Pending Pickups</span>
                        <Link href={route('rider.pickup')} className="btn btn-secondary btn-sm">
                            View all →
                        </Link>
                    </div>
                    <div>
                        {pendingOrders.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Package className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} />
                                </div>
                                <div className="empty-state-text">No pending pickups</div>
                            </div>
                        ) : (
                            pendingOrders.slice(0, 4).map((o) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 20px',
                                        borderBottom: '1px solid #e8f0e6',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>#{o.order_number}</div>
                                        <div style={{ fontSize: 11, color: '#6b7e68' }}>{o.customer_name}</div>
                                    </div>
                                    <span className="badge badge-yellow">Pickup</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Recent Deliveries</span>
                        <Link href={route('rider.performance')} className="btn btn-secondary btn-sm">
                            View all →
                        </Link>
                    </div>
                    <div>
                        {recentDeliveries.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Bike className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} />
                                </div>
                                <div className="empty-state-text">No deliveries yet</div>
                            </div>
                        ) : (
                            recentDeliveries.slice(0, 4).map((d) => {
                                const dot = STATUS_DOT[d.status] ?? '#6b7e68';
                                return (
                                    <div
                                        key={d.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 20px',
                                            borderBottom: '1px solid #e8f0e6',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>#{d.order_number}</div>
                                            <div style={{ fontSize: 11, color: '#6b7e68' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 5,
                                                fontSize: 11,
                                                padding: '3px 9px',
                                                borderRadius: 20,
                                                border: `1px solid ${dot}44`,
                                                background: `${dot}18`,
                                                color: dot,
                                                fontWeight: 600,
                                            }}
                                        >
                                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                                            {d.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
}
