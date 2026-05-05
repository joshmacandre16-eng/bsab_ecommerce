import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import RiderLayout from './Layout';

const RULES = [
    { category: 'Traffic Laws',      icon: '🚦', items: ['Always obey traffic signals and road signs.', 'Never beat the red light or make illegal U-turns.', 'Follow speed limits in all zones.', 'Use designated lanes for motorcycles.', 'Never use your phone while riding.'] },
    { category: 'Safety Gear',       icon: '⛑️', items: ['Always wear a certified helmet before riding.', 'Wear your company uniform or vest if required.', 'Use reflective gear during night deliveries.', 'Wear gloves and closed-toe shoes for protection.'] },
    { category: 'Company Policies',  icon: '📋', items: ['Follow your assigned shift schedule.', 'Do not accept deliveries outside the platform.', 'Report any accidents or incidents immediately.', 'Maintain a professional appearance at all times.', 'Do not share your account credentials with anyone.'] },
    { category: 'Local Regulations', icon: '🏛️', items: ["Carry your driver's license and vehicle registration at all times.", 'Comply with local ordinances on delivery zones.', 'Follow curfew rules in restricted areas.', 'Respect no-entry zones and private properties.'] },
];

export default function ComplianceSafety({ violations }: { violations: { id: number; description: string; date: string; resolved: boolean }[] }) {
    return (
        <RiderLayout title="Compliance & Safety">
            <Head title="Compliance & Safety" />

            <div className="pg-header">
                <div className="pg-title">Compliance & Safety</div>
                <div className="pg-subtitle">Follow all rules to protect yourself, customers, and the community.</div>
            </div>

            {/* Hero */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <ShieldCheck className="h-10 w-10" style={{ color: '#2d5a27', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1a2e1a', marginBottom: 4 }}>Safety First, Always</div>
                        <div style={{ fontSize: 13, color: '#6b7e68' }}>Your safety and compliance protect you, your customers, and the community. Follow all rules at all times.</div>
                    </div>
                </div>
            </div>

            {/* Rules Grid */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
                {RULES.map((section) => (
                    <div key={section.category} className="card">
                        <div className="card-header">
                            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 16 }}>{section.icon}</span> {section.category}
                            </span>
                        </div>
                        <div className="card-body">
                            {section.items.map((item) => (
                                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#4a6741', marginBottom: 8 }}>
                                    <CheckCircle className="h-4 w-4" style={{ color: '#15803d', flexShrink: 0, marginTop: 1 }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Emergency Contacts */}
            <div className="ap-warn" style={{ flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle className="h-5 w-5" style={{ color: '#a32d2d' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#a32d2d' }}>Emergency Contacts</span>
                </div>
                <div className="grid-4">
                    {[
                        { label: 'Police',         number: '117' },
                        { label: 'Ambulance',       number: '911' },
                        { label: 'Fire Station',    number: '160' },
                        { label: 'Company Support', number: '#support' },
                    ].map((c) => (
                        <a key={c.label} href={`tel:${c.number}`}
                            style={{ display: 'block', border: '1px solid #e8c8c8', background: '#fff', padding: '12px 8px', textAlign: 'center', textDecoration: 'none', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, color: '#6b7e68', marginBottom: 4 }}>{c.label}</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#a32d2d' }}>{c.number}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Violations Log */}
            <div className="card">
                <div className="card-header"><span className="card-title">Violation / Incident Log</span></div>
                <div className="card-body">
                    {violations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><ShieldCheck className="mx-auto h-10 w-10" style={{ color: '#15803d' }} /></div>
                            <div className="empty-state-text" style={{ color: '#15803d' }}>No violations on record. Keep it up!</div>
                        </div>
                    ) : violations.map((v) => (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e8f0e6', gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 13, color: '#1a2e1a' }}>{v.description}</div>
                                <div style={{ fontSize: 11, color: '#6b7e68', marginTop: 2 }}>{new Date(v.date).toLocaleDateString()}</div>
                            </div>
                            <span className={`badge ${v.resolved ? 'badge-green' : 'badge-red'}`}>
                                {v.resolved ? 'Resolved' : 'Open'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
