import { Head } from '@inertiajs/react';
import { AlertCircle, BarChart2, CheckCircle, Star, TrendingUp } from 'lucide-react';
import RiderLayout from './Layout';

interface PerformanceStats {
    totalDeliveries: number; successfulDeliveries: number; failedDeliveries: number;
    returnedOrders: number; onTimeRate: number; successRate: number;
    avgRating: number; totalEarnings: number; thisWeekEarnings: number; thisMonthEarnings: number;
}
interface WeeklyData { day: string; deliveries: number; earnings: number }
interface Feedback { id: number; rating: number; comment?: string; order_number: string; created_at: string }

export default function Performance({ stats, weeklyData, recentFeedback, shifts }: {
    stats: PerformanceStats; weeklyData: WeeklyData[];
    recentFeedback: Feedback[];
    shifts: { date: string; start: string; end: string; deliveries: number }[];
}) {
    const maxDeliveries = Math.max(...weeklyData.map((d) => d.deliveries), 1);

    return (
        <RiderLayout title="Performance">
            <Head title="Performance & Accountability" />

            <div className="pg-header">
                <div className="pg-title">Performance</div>
                <div className="pg-subtitle">Track your delivery performance and earnings.</div>
            </div>

            {/* Score banner */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 6 }}>Overall Performance Score</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                            <span style={{ fontSize: 48, fontWeight: 700, color: '#1a2e1a', letterSpacing: '-2px', lineHeight: 1 }}>{stats.successRate}%</span>
                            <span style={{ fontSize: 12, color: '#6b7e68', marginBottom: 6 }}>success rate</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginBottom: 4 }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-5 w-5" style={{ color: i <= Math.round(stats.avgRating) ? '#f59e0b' : '#d4ddd2', fill: i <= Math.round(stats.avgRating) ? '#f59e0b' : 'none' }} />
                            ))}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a2e1a', letterSpacing: '-1px' }}>{stats.avgRating.toFixed(1)}</div>
                        <div style={{ fontSize: 11, color: '#6b7e68' }}>Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                {[
                    { label: 'Total Deliveries',   value: stats.totalDeliveries },
                    { label: 'Successful',         value: stats.successfulDeliveries },
                    { label: 'Failed / Returned',  value: stats.failedDeliveries + stats.returnedOrders },
                    { label: 'On-Time Rate',       value: `${stats.onTimeRate}%` },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Earnings */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp className="h-4 w-4" /> Earnings Summary
                    </span>
                </div>
                <div className="card-body">
                    <div className="grid-3">
                        {[
                            { label: 'Total Earnings', value: `₱${stats.totalEarnings.toFixed(2)}` },
                            { label: 'This Week',      value: `₱${stats.thisWeekEarnings.toFixed(2)}` },
                            { label: 'This Month',     value: `₱${stats.thisMonthEarnings.toFixed(2)}` },
                        ].map((e) => (
                            <div key={e.label} className="stat-card" style={{ textAlign: 'center' }}>
                                <div className="stat-label">{e.label}</div>
                                <div className="stat-value">{e.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header"><span className="card-title">Deliveries This Week</span></div>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                        {weeklyData.map((d) => (
                            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                <span style={{ fontSize: 10, color: '#6b7e68', marginBottom: 4 }}>{d.deliveries}</span>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                    <div style={{ width: '100%', background: '#2d5a27', borderRadius: '4px 4px 0 0', height: `${Math.max((d.deliveries / maxDeliveries) * 100, 4)}%`, transition: 'height .6s cubic-bezier(.4,0,.2,1)' }} />
                                </div>
                                <span style={{ fontSize: 10, color: '#6b7e68', marginTop: 6 }}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid-2">
                {/* Feedback */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Star className="h-4 w-4" /> Recent Customer Feedback
                        </span>
                    </div>
                    <div className="card-body">
                        {recentFeedback.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon"><Star className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div><div className="empty-state-text">No feedback yet</div></div>
                        ) : recentFeedback.map((f) => (
                            <div key={f.id} style={{ border: '1px solid #d4ddd2', padding: 12, marginBottom: 8, borderRadius: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: '#6b7e68' }}>#{f.order_number}</span>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="h-3.5 w-3.5" style={{ color: i <= f.rating ? '#f59e0b' : '#d4ddd2', fill: i <= f.rating ? '#f59e0b' : 'none' }} />
                                        ))}
                                    </div>
                                </div>
                                {f.comment && <p style={{ fontSize: 13, color: '#4a6741', fontStyle: 'italic', marginBottom: 4 }}>"{f.comment}"</p>}
                                <div style={{ fontSize: 11, color: '#6b7e68' }}>{new Date(f.created_at).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shifts */}
                <div className="card">
                    <div className="card-header"><span className="card-title">Recent Shifts</span></div>
                    <div className="card-body">
                        {shifts.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon"><BarChart2 className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div><div className="empty-state-text">No shift data available</div></div>
                        ) : shifts.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e8f0e6' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                    <div style={{ fontSize: 11, color: '#6b7e68' }}>{s.start} – {s.end}</div>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#2d5a27' }}>{s.deliveries} deliveries</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
}
