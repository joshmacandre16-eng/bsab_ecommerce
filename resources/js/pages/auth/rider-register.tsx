import { Head, useForm } from '@inertiajs/react';
import { Bike, Eye, EyeOff, FileText, LoaderCircle, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type VehicleType = 'motorcycle' | 'scooter' | 'bicycle' | 'car';

interface RiderForm {
    first_name: string; last_name: string;
    email: string; password: string; password_confirmation: string;
    date_of_birth: string; phone: string; address: string;
    emergency_contact_name: string; emergency_contact_phone: string;
    tin: string; bank_account: string;
    id_document: File | null; nbi_clearance: File | null;
    vehicle_type: VehicleType; license_number: string;
    vehicle_registration: File | null; proof_of_insurance: File | null;
    or_cr: File | null; has_helmet: boolean; has_phone_mount: boolean;
}

const inp = (err?: string) =>
    `w-full rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all px-3 py-2.5 ${err ? 'border-red-400 bg-red-50' : 'border-[#b8d890] bg-[#f4faea]'}`;

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: '#4a7a4a' }}>
        {children}
    </label>
);

const Err = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-0.5 text-xs text-red-500">{msg}</p> : null;

const FileInput = ({ name, label, error, onChange }: {
    name: string; label: string; error?: string;
    onChange: (f: File | null) => void;
}) => (
    <div>
        <Label>{label}</Label>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf"
            className={`${inp(error)} file:mr-2 file:rounded file:border-0 file:bg-green-100 file:text-green-800 file:text-xs file:px-2 file:py-1`}
            onChange={e => onChange(e.target.files?.[0] ?? null)} />
        <Err msg={error} />
    </div>
);

const STEPS = ['Account', 'Personal', 'Documents', 'Vehicle'];

export default function RiderRegister({ token }: { token: string }) {
    const [step, setStep] = useState(0);
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);

    const { data, setData, post, processing, errors } = useForm<RiderForm>({
        first_name: '', last_name: '', email: '', password: '', password_confirmation: '',
        date_of_birth: '', phone: '', address: '',
        emergency_contact_name: '', emergency_contact_phone: '',
        tin: '', bank_account: '',
        id_document: null, nbi_clearance: null,
        vehicle_type: 'motorcycle', license_number: '',
        vehicle_registration: null, proof_of_insurance: null,
        or_cr: null, has_helmet: false, has_phone_mount: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('rider.register', token));
    };

    const stepHasError = (s: number) => {
        const map: Record<number, (keyof typeof errors)[]> = {
            0: ['first_name', 'last_name', 'email', 'password', 'password_confirmation'],
            1: ['date_of_birth', 'phone', 'address', 'emergency_contact_name', 'emergency_contact_phone'],
            2: ['id_document', 'tin', 'bank_account'],
            3: ['vehicle_type', 'license_number', 'has_helmet', 'has_phone_mount'],
        };
        return map[s]?.some(k => errors[k]);
    };

    return (
        <>
            <Head title="Rider Registration" />
            <div className="min-h-screen flex" style={{ background: '#f4f7f0' }}>

                {/* Left panel */}
                <div className="hidden lg:flex flex-col justify-center items-center w-5/12 sticky top-0 h-screen px-12"
                    style={{ background: 'linear-gradient(160deg, #f0f5e8 0%, #e8f0dc 100%)' }}>
                    <div className="text-center z-10">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <path d="M22 6C14 6 8 13 8 22c0 4 1.5 7.5 4 10l10-10-4 14c1.2.6 2.6 1 4 1 8 0 14-7 14-15S30 6 22 6z" fill="#2d6a2d"/>
                                <path d="M22 6c0 0-2 8 2 14s10 8 10 8" stroke="#4a9e4a" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-3xl font-bold" style={{ color: '#1a4a1a' }}>
                                BSAB<span style={{ color: '#3a8a3a' }}>Shop</span>
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight mb-4" style={{ color: '#1a4a1a' }}>
                            Become a<br />Delivery Rider
                        </h2>
                        <p className="text-sm text-green-700 mb-6">Join our growing fleet and earn on your schedule.</p>
                        <div className="space-y-3 text-left">
                            {['Flexible working hours', 'Competitive delivery pay', 'Fast application process'].map(t => (
                                <div key={t} className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-sm text-green-800">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex flex-1 items-start justify-center px-4 py-8 overflow-y-auto"
                    style={{ background: 'linear-gradient(160deg, #f8faf4 0%, #eef4e4 100%)', minHeight: '100vh' }}>
                    <div className="w-full max-w-lg">

                        {/* Logo (mobile) */}
                        <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                            <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
                                <path d="M22 6C14 6 8 13 8 22c0 4 1.5 7.5 4 10l10-10-4 14c1.2.6 2.6 1 4 1 8 0 14-7 14-15S30 6 22 6z" fill="#2d6a2d"/>
                            </svg>
                            <span className="text-xl font-bold" style={{ color: '#1a4a1a' }}>BSAB<span style={{ color: '#3a8a3a' }}>Shop</span></span>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border px-8 py-8" style={{ borderColor: '#c8dba8' }}>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 mb-2">
                                    <Bike className="h-5 w-5" style={{ color: '#3a8a3a' }} />
                                    <h1 className="text-lg font-extrabold tracking-widest uppercase" style={{ color: '#1a4a1a' }}>
                                        Rider Registration
                                    </h1>
                                </div>
                                <p className="text-xs" style={{ color: '#6a8a6a' }}>Complete all steps to submit your application</p>
                            </div>

                            {/* Step indicator */}
                            <div className="flex items-center mb-8">
                                {STEPS.map((label, i) => (
                                    <div key={i} className="flex items-center flex-1">
                                        <button type="button" onClick={() => i < step && setStep(i)}
                                            className={`flex flex-col items-center gap-1 flex-1 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                                ${i < step ? 'bg-green-600 border-green-600 text-white'
                                                : i === step ? 'bg-white border-green-600 text-green-700'
                                                : 'bg-white border-gray-200 text-gray-400'}
                                                ${stepHasError(i) ? '!border-red-400 !text-red-500' : ''}`}>
                                                {i < step ? '✓' : i + 1}
                                            </div>
                                            <span className={`text-[10px] font-semibold hidden sm:block ${i === step ? 'text-green-700' : 'text-gray-400'}`}>
                                                {label}
                                            </span>
                                        </button>
                                        {i < STEPS.length - 1 && (
                                            <div className={`h-0.5 flex-1 mx-1 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={submit}>

                                {/* ── Step 0: Account ── */}
                                {step === 0 && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>First Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                                                    <input type="text" required autoFocus value={data.first_name}
                                                        onChange={e => setData('first_name', e.target.value)}
                                                        placeholder="Juan" className={`${inp(errors.first_name)} pl-8`} />
                                                </div>
                                                <Err msg={errors.first_name} />
                                            </div>
                                            <div>
                                                <Label>Last Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                                                    <input type="text" required value={data.last_name}
                                                        onChange={e => setData('last_name', e.target.value)}
                                                        placeholder="Dela Cruz" className={`${inp(errors.last_name)} pl-8`} />
                                                </div>
                                                <Err msg={errors.last_name} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                                                <input type="email" required value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    placeholder="email@example.com" className={`${inp(errors.email)} pl-8`} />
                                            </div>
                                            <Err msg={errors.email} />
                                        </div>
                                        <div>
                                            <Label>Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                                                <input type={showPw ? 'text' : 'password'} required value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    placeholder="Password" className={`${inp(errors.password)} pl-8 pr-10`} />
                                                <button type="button" onClick={() => setShowPw(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700">
                                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <Err msg={errors.password} />
                                        </div>
                                        <div>
                                            <Label>Confirm Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                                                <input type={showCpw ? 'text' : 'password'} required value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirm Password" className={`${inp(errors.password_confirmation)} pl-8 pr-10`} />
                                                <button type="button" onClick={() => setShowCpw(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700">
                                                    {showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <Err msg={errors.password_confirmation} />
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 1: Personal ── */}
                                {step === 1 && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>Date of Birth</Label>
                                                <input type="date" required value={data.date_of_birth}
                                                    onChange={e => setData('date_of_birth', e.target.value)}
                                                    className={inp(errors.date_of_birth)} />
                                                <Err msg={errors.date_of_birth} />
                                            </div>
                                            <div>
                                                <Label>Phone Number</Label>
                                                <input type="tel" required value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    placeholder="+63 9XX XXX XXXX" className={inp(errors.phone)} />
                                                <Err msg={errors.phone} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Full Address</Label>
                                            <textarea required value={data.address} rows={2}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder="House No., Street, Barangay, City, Province"
                                                className={inp(errors.address)} />
                                            <Err msg={errors.address} />
                                        </div>
                                        <div className="border-t pt-3" style={{ borderColor: '#e0eed0' }}>
                                            <p className="text-xs font-semibold text-green-800 mb-2">Emergency Contact</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label>Contact Name</Label>
                                                    <input type="text" required value={data.emergency_contact_name}
                                                        onChange={e => setData('emergency_contact_name', e.target.value)}
                                                        placeholder="Full Name" className={inp(errors.emergency_contact_name)} />
                                                    <Err msg={errors.emergency_contact_name} />
                                                </div>
                                                <div>
                                                    <Label>Contact Phone</Label>
                                                    <input type="tel" required value={data.emergency_contact_phone}
                                                        onChange={e => setData('emergency_contact_phone', e.target.value)}
                                                        placeholder="+63 9XX XXX XXXX" className={inp(errors.emergency_contact_phone)} />
                                                    <Err msg={errors.emergency_contact_phone} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 2: Documents ── */}
                                {step === 2 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 mb-2">
                                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                                            <p className="text-xs text-blue-700">Upload clear photos or PDFs. Max 5MB each.</p>
                                        </div>
                                        <FileInput name="id_document" label="Government-Issued ID *"
                                            error={errors.id_document}
                                            onChange={f => setData('id_document', f)} />
                                        <FileInput name="nbi_clearance" label="NBI / Police Clearance (optional)"
                                            error={errors.nbi_clearance}
                                            onChange={f => setData('nbi_clearance', f)} />
                                        <div>
                                            <Label>Tax Identification Number (TIN) *</Label>
                                            <input type="text" required value={data.tin}
                                                onChange={e => setData('tin', e.target.value)}
                                                placeholder="XXX-XXX-XXX" className={inp(errors.tin)} />
                                            <Err msg={errors.tin} />
                                        </div>
                                        <div>
                                            <Label>Bank Account / E-Wallet *</Label>
                                            <input type="text" required value={data.bank_account}
                                                onChange={e => setData('bank_account', e.target.value)}
                                                placeholder="GCash / Maya / Bank Account No." className={inp(errors.bank_account)} />
                                            <Err msg={errors.bank_account} />
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 3: Vehicle ── */}
                                {step === 3 && (
                                    <div className="space-y-3">
                                        <div>
                                            <Label>Vehicle Type *</Label>
                                            <select required value={data.vehicle_type}
                                                onChange={e => setData('vehicle_type', e.target.value as VehicleType)}
                                                className={inp(errors.vehicle_type)}>
                                                <option value="motorcycle">Motorcycle</option>
                                                <option value="scooter">Scooter</option>
                                                <option value="bicycle">Bicycle</option>
                                                <option value="car">Car</option>
                                            </select>
                                            <Err msg={errors.vehicle_type} />
                                        </div>
                                        <div>
                                            <Label>Driver's License Number *</Label>
                                            <input type="text" required value={data.license_number}
                                                onChange={e => setData('license_number', e.target.value)}
                                                placeholder="License No." className={inp(errors.license_number)} />
                                            <Err msg={errors.license_number} />
                                        </div>
                                        <FileInput name="vehicle_registration" label="Vehicle Registration (optional)"
                                            error={errors.vehicle_registration}
                                            onChange={f => setData('vehicle_registration', f)} />
                                        <FileInput name="or_cr" label="OR/CR (optional)"
                                            error={errors.or_cr}
                                            onChange={f => setData('or_cr', f)} />
                                        <FileInput name="proof_of_insurance" label="Proof of Insurance (optional)"
                                            error={errors.proof_of_insurance}
                                            onChange={f => setData('proof_of_insurance', f)} />
                                        <div className="flex gap-6 pt-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.has_helmet}
                                                    onChange={e => setData('has_helmet', e.target.checked)}
                                                    className="rounded border-green-400 text-green-600" />
                                                <span className="text-sm text-green-800">I have a helmet & safety gear</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.has_phone_mount}
                                                    onChange={e => setData('has_phone_mount', e.target.checked)}
                                                    className="rounded border-green-400 text-green-600" />
                                                <span className="text-sm text-green-800">I have a phone mount</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation buttons */}
                                <div className="flex gap-3 mt-6">
                                    {step > 0 && (
                                        <button type="button" onClick={() => setStep(s => s - 1)}
                                            className="flex-1 py-2.5 rounded-full text-sm font-bold border-2 transition-all"
                                            style={{ borderColor: '#3a8a3a', color: '#3a8a3a' }}>
                                            Back
                                        </button>
                                    )}
                                    {step < STEPS.length - 1 ? (
                                        <button type="button" onClick={() => setStep(s => s + 1)}
                                            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all"
                                            style={{ background: 'linear-gradient(135deg, #2d6a2d 0%, #3a8a3a 100%)' }}>
                                            Next
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={processing}
                                            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(135deg, #2d6a2d 0%, #3a8a3a 100%)' }}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Submit Application
                                        </button>
                                    )}
                                </div>
                            </form>

                            <p className="mt-5 text-center text-xs" style={{ color: '#6a8a6a' }}>
                                Already have an account?{' '}
                                <a href={route('login')} className="font-semibold hover:underline" style={{ color: '#3a8a3a' }}>
                                    Log in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
