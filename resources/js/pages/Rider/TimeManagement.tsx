import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import RiderLayout from './Layout';

interface Delivery {
    id: number; order_number: string; status: string;
    customer: { name: string }; created_at: string;
    picked_up_at?: string; delivered_at?: string;
    sla_minutes: number; actual_minutes?: number; on_time: boolean;
}
interface Stats { onTimeRate: number; avgDeliveryMinutes: number; totalToday: number; lateDeliveries: number }

export default function TimeManagement({ deliveries, stats }: { deliveries: Delivery[]; stats: Stats }) {
    return (
        <RiderLayout title="Time Management">
            <Head title="Time Management" />

            <div className="pg-header">
                <div className="pg-title">Time Management</div>
                <div className="pg-subtitle">Track your delivery times and SLA compliance.</div>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                {[
                    { label: 'On-Time Rate',      value: `${stats.onTimeRate}%` },
                    { label: 'Avg Delivery Time', value: `${stats.avgDeliveryMinutes} min` },
                    { label: 'Deliveries Today',  value: stats.totalToday },
                    { label: 'Late Deliveries',   value: stats.lateDeliveries },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* SLA Guide */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock className="h-4 w-4" /> SLA Guidelines
                    </span>
                </div>
                <div className="card-body">
                    <div className="grid-2">
                        {[
                            { icon: '⚡', title: 'Express Delivery',    sla: '30–45 minutes' },
                            { icon: '🚀', title: 'Standard Delivery',   sla: '1–2 hours' },
                            { icon: '📅', title: 'Scheduled Delivery',  sla: 'As agreed' },
                            { icon: '🌙', title: 'Late Night Delivery',  sla: '45–60 minutes' },
                        ].map((s) => (
                            <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #d4ddd2', borderLeft: '3px solid #2d5a27', padding: 12, background: '#f4f8f3', borderRadius: 8 }}>
                                <span style={{ fontSize: 18 }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a2e1a' }}>{s.title}</div>
                                    <div style={{ fontSize: 11, color: '#6b7e68' }}>Target: {s.sla}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="ap-info" style={{ marginBottom: 20 }}>
                <TrendingUp className="h-5 w-5" />
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2d5a27', marginBottom: 8 }}>Tips to Stay On Time</div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                            'Plan your route before leaving the pickup point.',
                            'Group nearby deliveries together to save time.',
                            'Contact customers in advance if you anticipate a delay.',
                            'Avoid peak traffic hours when possible.',
                            'Keep your vehicle fueled and ready before your shift.',
                        ].map((tip) => (
                            <li key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#2d5a27' }}>
                                <CheckCircle className="h-4 w-4" style={{ flexShrink: 0, marginTop: 1 }} /> {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Delivery Log */}
            <div className="card">
                <div className="card-header"><span className="card-title">Today's Delivery Log</span></div>
                <div className="table-wrap">
                    {deliveries.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><Clock className="mx-auto h-10 w-10" style={{ color: '#d4ddd2' }} /></div>
                            <div className="empty-state-text">No deliveries logged today</div>
                        </div>
                    ) : (
                        <table className="ap-table" style={{ minWidth: 500 }}>
                            <thead>
                                <tr>
                                    {['Order', 'Customer', 'SLA', 'Actual', 'Status'].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map((d) => (
                                    <tr key={d.id}>
                                        <td style={{ fontWeight: 500 }}>#{d.order_number}</td>
                                        <td style={{ color: '#6b7e68' }}>{d.customer?.name}</td>
                                        <td style={{ color: '#6b7e68' }}>{d.sla_minutes} min</td>
                                        <td>{d.actual_minutes ? `${d.actual_minutes} min` : '—'}</td>
                                        <td>
                                            {d.status === 'delivered' ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: d.on_time ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                                                    {d.on_time
                                                        ? <><CheckCircle className="h-3.5 w-3.5" /> On Time</>
                                                        : <><AlertCircle className="h-3.5 w-3.5" /> Late</>}
                                                </span>
                                            ) : (
                                                <span className="badge badge-blue">{d.status.replace('_', ' ')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </RiderLayout>
    );
}
