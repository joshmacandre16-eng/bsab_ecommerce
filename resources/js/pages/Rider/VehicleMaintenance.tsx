import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { useState } from 'react';
import RiderLayout from './Layout';

const CHECKLIST_ITEMS = [
    { id: 'fuel',      label: 'Fuel level is sufficient',           category: 'Pre-Ride' },
    { id: 'tires',     label: 'Tires are properly inflated',        category: 'Pre-Ride' },
    { id: 'brakes',    label: 'Brakes are working properly',        category: 'Pre-Ride' },
    { id: 'lights',    label: 'Headlights and tail lights working', category: 'Pre-Ride' },
    { id: 'horn',      label: 'Horn is functional',                 category: 'Pre-Ride' },
    { id: 'helmet',    label: 'Helmet is available and undamaged',  category: 'Safety Gear' },
    { id: 'license',   label: "Driver's license is with you",       category: 'Documents' },
    { id: 'reg',       label: 'Vehicle registration is valid',      category: 'Documents' },
    { id: 'insurance', label: 'Insurance documents are ready',      category: 'Documents' },
    { id: 'bag',       label: 'Delivery bag is clean and intact',   category: 'Equipment' },
    { id: 'phone',     label: 'Phone is charged (>50%)',            category: 'Equipment' },
    { id: 'charger',   label: 'Portable charger is available',      category: 'Equipment' },
];
const CATEGORIES = [...new Set(CHECKLIST_ITEMS.map((i) => i.category))];

export default function VehicleMaintenance({ lastChecklist }: { lastChecklist: Record<string, boolean> }) {
    const [checked, setChecked] = useState<Record<string, boolean>>(lastChecklist ?? {});
    const [saving, setSaving] = useState(false);

    const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

    const saveChecklist = () => {
        setSaving(true);
        router.post(route('rider.vehicle.checklist'), { checklist: checked }, {
            preserveScroll: true, onFinish: () => setSaving(false),
        });
    };

    const checkedCount = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
    const allChecked = checkedCount === CHECKLIST_ITEMS.length;

    return (
        <RiderLayout title="Vehicle Maintenance">
            <Head title="Vehicle Maintenance" />

            <div className="pg-header">
                <div className="pg-title">Vehicle Maintenance</div>
                <div className="pg-subtitle">Complete your pre-ride checklist before every shift.</div>
            </div>

            {/* Checklist */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                    <span className="card-title">Pre-Ride Checklist</span>
                    <span style={{ fontSize: 12, color: allChecked ? '#15803d' : '#6b7e68', fontWeight: 600 }}>
                        {checkedCount}/{CHECKLIST_ITEMS.length} Complete
                    </span>
                </div>
                <div className="card-body">
                    {/* Progress bar */}
                    <div style={{ marginBottom: 16 }}>
                        <div className="ap-prog-track">
                            <div className="ap-prog-fill" style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }} />
                        </div>
                    </div>

                    {allChecked && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #bbf7d0', background: '#f0fdf4', padding: 12, marginBottom: 16, borderRadius: 8 }}>
                            <CheckCircle className="h-5 w-5" style={{ color: '#15803d' }} />
                            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>All checks passed! You're ready to ride.</span>
                        </div>
                    )}

                    {CATEGORIES.map((cat) => (
                        <div key={cat} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7e68', marginBottom: 8, fontWeight: 600 }}>{cat}</div>
                            {CHECKLIST_ITEMS.filter((i) => i.category === cat).map((item) => (
                                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid #d4ddd2', marginBottom: 4, cursor: 'pointer', background: checked[item.id] ? '#f4f8f3' : '#fff', transition: 'background .15s', borderRadius: 6 }}>
                                    <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)}
                                        style={{ width: 14, height: 14, accentColor: '#2d5a27', flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, flex: 1, color: checked[item.id] ? '#6b7e68' : '#1a2e1a', textDecoration: checked[item.id] ? 'line-through' : 'none' }}>
                                        {item.label}
                                    </span>
                                    {checked[item.id] && <CheckCircle className="h-4 w-4" style={{ color: '#15803d', flexShrink: 0 }} />}
                                </label>
                            ))}
                        </div>
                    ))}

                    <button onClick={saveChecklist} disabled={saving} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.6 : 1 }}>
                        {saving ? 'Saving…' : '💾 Save Checklist'}
                    </button>
                </div>
            </div>

            {/* Maintenance Tips */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Wrench className="h-4 w-4" /> Maintenance Reminders
                    </span>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                        { icon: '🔧', title: 'Oil Change',       desc: 'Change engine oil every 1,000–2,000 km or as recommended by manufacturer.', urgent: false },
                        { icon: '🛞', title: 'Tire Replacement', desc: 'Replace tires when tread depth is below 1.6mm or if there are visible cracks.', urgent: false },
                        { icon: '🔋', title: 'Battery Check',    desc: 'Have your battery tested every 6 months. Replace if it fails to hold charge.', urgent: false },
                        { icon: '⚠️', title: 'Report Damage',    desc: 'Report any vehicle damage or mechanical issues to your supervisor immediately.', urgent: true },
                    ].map((r) => (
                        <div key={r.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, border: r.urgent ? '1px solid #e8c8c8' : '1px solid #d4ddd2', background: r.urgent ? '#fdf5f5' : '#f4f8f3', padding: 14, borderRadius: 8 }}>
                            <span style={{ fontSize: 18 }}>{r.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, color: r.urgent ? '#b91c1c' : '#1a2e1a' }}>{r.title}</div>
                                <div style={{ fontSize: 12, color: r.urgent ? '#b91c1c' : '#6b7e68' }}>{r.desc}</div>
                            </div>
                            {r.urgent && <AlertTriangle className="h-4 w-4" style={{ color: '#b91c1c', flexShrink: 0 }} />}
                        </div>
                    ))}
                </div>
            </div>
        </RiderLayout>
    );
}
