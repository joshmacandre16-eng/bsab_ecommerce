import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Bike, CheckCircle, Clock, Package, Star, TrendingUp, Wallet } from 'lucide-react';
import RiderLayout from './Layout';

interface Stats {
    totalDeliveries: number; completedToday: number; pendingPickups: number;
    activeDeliveries: number; totalEarnings: number; todayEarnings: number;
    rating: number; successRate: number;
}
interface Delivery {
    id: number; order_number: string; status: string;
    customer_name: string; total: number; created_at: string;
    customer?: { name: string };
}

const STATUS_DOT: Record<string, string> = {
    pending: '#f59e0b', picked_up: '#3b82f6', on_the_way: '#8b5cf6',
    delivered: '#22c55e', failed: '#ef4444', returned: '#b0afa8',
};

export default function RiderDashboard({ stats, recentDeliveries, pendingOrders }: {
    stats: Stats; recentDeliveries: Delivery[]; pendingOrders: Delivery[];
}) {
    const metrics = [
        { label: 'Total Deliveries',  value: stats.totalDeliveries,                icon: <Bike className="h-4 w-4" /> },
        { label: 'Completed Today',   value: stats.completedToday,                 icon: <CheckCircle className="h-4 w-4" /> },
        { label: 'Pending Pickups',   value: stats.pendingPickups,                 icon: <Package className="h-4 w-4" /> },
        { label: 'Active Deliveries', value: stats.activeDeliveries,               icon: <Clock className="h-4 w-4" /> },
        { label: 'Total Earnings',    value: `₱${stats.totalEarnings.toFixed(2)}`, icon: <Wallet className="h-4 w-4" /> },
        { label: "Today's Earnings",  value: `₱${stats.todayEarnings.toFixed(2)}`, icon: <TrendingUp className="h-4 w-4" /> },
        { label: 'Rating',            value: `${stats.rating.toFixed(1)} ★`,       icon: <Star className="h-4 w-4" /> },
        { label: 'Success Rate',      value: `${stats.successRate}%`,              icon: <AlertCircle className="h-4 w-4" /> },
    ];

    return (
        <RiderLayout title="Dashboard">
            <Head title="Rider Dashboard" />

            <div className="pg-header">
                <div className="pg-title">Dashboard</div>
                <div className="pg-subtitle">Check your pending pickups and active deliveries below.</div>
            </div>

            {/* Metrics */}
            <div className="stat-grid" style={{ marginBottom: 28 }}>
                {metrics.map((m) => (
                    <div key={m.label} className="stat-card">
                        <div className="stat-icon" style={{ background: '#e8f5e4' }}>{m.icon}</div>
                        <div className="stat-label">{m.label}</div>
                        <div className="stat-value">{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">Quick Actions</span></div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                        {[
                            { label: 'Order Pickup',      href: 'rider.pickup',      icon: '📦' },
                            { label: 'Active Delivery',   href: 'rider.navigation',  icon: '🗺️' },
                            { label: 'Proof of Delivery', href: 'rider.proof',       icon: '📸' },
                            { label: 'My Performance',    href: 'rider.performance', icon: '📊' },
                        ].map((a) => (
                            <Link key={a.label} href={route(a.href)} className="btn btn-secondary"
                                style={{ flexDirection: 'column', padding: 16, gap: 8, justifyContent: 'center', height: 'auto' }}>
                                <span style={{ fontSize: 22 }}>{a.icon}</span>{a.label}
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
                        <Link href={route('rider.pickup')} className="btn btn-secondary btn-sm">View all →</Link>
                    </div>
                    <div>
                        {pendingOrders.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon"><Package className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div><div className="empty-state-text">No pending pickups</div></div>
                        ) : pendingOrders.slice(0, 4).map((o) => (
                            <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e8f0e6' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>#{o.order_number}</div>
                                    <div style={{ fontSize: 11, color: '#6b7e68' }}>{o.customer_name}</div>
                                </div>
                                <span className="badge badge-yellow">Pickup</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Recent Deliveries</span>
                        <Link href={route('rider.performance')} className="btn btn-secondary btn-sm">View all →</Link>
                    </div>
                    <div>
                        {recentDeliveries.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon"><Bike className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div><div className="empty-state-text">No deliveries yet</div></div>
                        ) : recentDeliveries.slice(0, 4).map((d) => {
                            const dot = STATUS_DOT[d.status] ?? '#6b7e68';
                            return (
                                <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e8f0e6' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>#{d.order_number}</div>
                                        <div style={{ fontSize: 11, color: '#6b7e68' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '3px 9px', borderRadius: 20, border: `1px solid ${dot}44`, background: `${dot}18`, color: dot, fontWeight: 600 }}>
                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                                        {d.status.replace('_', ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
}
