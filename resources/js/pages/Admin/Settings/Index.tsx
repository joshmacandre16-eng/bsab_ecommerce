import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Upload, X } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { useRef, useState, FormEvent } from 'react';

interface Settings {
    site_name: string;
    site_tagline: string;
    banner_subtitle: string;
    banner_title: string;
    banner_description: string;
    banner_badge: string;
    banner_shop_btn: string;
    banner_image: string;
    dashboard_banner_title: string;
    dashboard_banner_subtitle: string;
    dashboard_banner_description: string;
    dashboard_banner_btn: string;
    flash_title: string;
    categories_title: string;
    products_title: string;
    footer_brand: string;
    footer_tagline: string;
    footer_col2_title: string;
    footer_col3_title: string;
    footer_payments: string;
    footer_col4_title: string;
    footer_copyright: string;
    footer_contact: string;
    gcash_qr_image: string;
    gcash_number: string;
    gcash_name: string;
    [key: string]: string;
}

const TEXT_SECTIONS = [
    {
        title: 'Header',
        fields: [
            { key: 'site_name', label: 'Site Name' },
            { key: 'site_tagline', label: 'Site Tagline' },
        ],
    },
    {
        title: 'Welcome Page Banner',
        fields: [
            { key: 'banner_subtitle', label: 'Subtitle (small text above title)' },
            { key: 'banner_title', label: 'Main Title' },
            { key: 'banner_description', label: 'Description' },
            { key: 'banner_badge', label: 'Badge Text' },
            { key: 'banner_shop_btn', label: 'Shop Button Text' },
        ],
    },
    {
        title: 'Customer Dashboard Banner',
        fields: [
            { key: 'dashboard_banner_subtitle', label: 'Subtitle (small text above title)' },
            { key: 'dashboard_banner_title', label: 'Main Title' },
            { key: 'dashboard_banner_description', label: 'Description' },
            { key: 'dashboard_banner_btn', label: 'Button Text' },
        ],
    },
    {
        title: 'Section Headings',
        fields: [
            { key: 'flash_title', label: 'Flash Sale Title' },
            { key: 'categories_title', label: 'Featured Categories Title' },
            { key: 'products_title', label: 'Latest Products Title' },
        ],
    },
    {
        title: 'Footer',
        fields: [
            { key: 'footer_brand', label: 'Brand Name' },
            { key: 'footer_tagline', label: 'Tagline' },
            { key: 'footer_col2_title', label: 'Column 2 Title' },
            { key: 'footer_col3_title', label: 'Column 3 Title' },
            { key: 'footer_payments', label: 'Payment Methods (comma-separated)' },
            { key: 'footer_col4_title', label: 'Column 4 Title' },
            { key: 'footer_copyright', label: 'Copyright Text' },
            { key: 'footer_contact', label: 'Contact Link Text' },
        ],
    },
] as const;

function ImageUploadField({
    label,
    fieldKey,
    currentPath,
    preview,
    onPreviewChange,
    onFileChange,
}: {
    label: string;
    fieldKey: string;
    currentPath: string;
    preview: string | null;
    onPreviewChange: (v: string | null) => void;
    onFileChange: (f: File | null) => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const displayed = preview ?? (currentPath ? `/storage/${currentPath}` : null);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-start gap-4">
                <div className="relative h-32 w-56 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    {displayed ? (
                        <>
                            <img src={displayed} alt="banner preview" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => { onPreviewChange(null); onFileChange(null); if (ref.current) ref.current.value = ''; }}
                                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                            <Upload className="h-6 w-6" />
                            <span className="text-xs">No image</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Upload className="h-4 w-4" /> Choose Image
                    </button>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP — max 4 MB.<br />Replaces the gradient background.</p>
                    <input
                        ref={ref}
                        type="file"
                        name={fieldKey}
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0] ?? null;
                            onFileChange(file);
                            onPreviewChange(file ? URL.createObjectURL(file) : null);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function SettingsIndex() {
    const { settings, flash } = usePage<{ settings: Settings; flash?: { success?: string } }>().props;

    const { data, setData, post, processing } = useForm<Settings & { banner_image: File | string; dashboard_banner_image: File | string }>(
        { ...settings } as any
    );
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        settings.banner_image ? `/storage/${settings.banner_image}` : null
    );
    const [gcashQrPreview, setGcashQrPreview] = useState<string | null>(
        settings.gcash_qr_image ? `/storage/${settings.gcash_qr_image}` : null
    );
    const set = (key: string, value: string) => setData(key as any, value);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true });
    };

    const bannerBg = bannerPreview ?? (data.banner_image ? `/storage/${data.banner_image}` : null);

    return (
        <AdminLayout breadcrumb="Settings">
            <Head title="System Settings" />
            <div className="max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Page Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">Edit banner images, text content, and footer for all pages.</p>
                </div>

                {flash?.success && (
                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <Check className="h-4 w-4" /> {flash.success}
                    </div>
                )}

                {/* Welcome Banner Preview */}
                <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Welcome Page Banner Preview</p>
                    <div
                        className="relative flex min-h-[140px] items-center overflow-hidden rounded-2xl p-8 text-white"
                        style={bannerBg
                            ? { backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : { background: 'linear-gradient(to right, #1a4d1a, #2d6a2d, #4a9e4a)' }
                        }
                    >
                        {bannerBg && <div className="absolute inset-0 bg-black/30" />}
                        <div className="relative z-10 max-w-lg">
                            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-green-200">{data.banner_subtitle}</p>
                            <h1 className="mb-1 text-2xl font-bold">{data.banner_title}</h1>
                            <p className="mb-4 text-sm text-green-100">{data.banner_description}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#f59e0b] px-4 py-1.5 text-xs font-bold">{data.banner_badge}</span>
                                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#2d6a2d]">{data.banner_shop_btn}</span>
                            </div>
                        </div>
                        {!bannerBg && <div className="absolute right-0 top-0 bottom-0 flex w-1/3 items-center justify-center select-none text-[80px] opacity-10">🌾</div>}
                    </div>
                </div>

                {/* Dashboard Banner Preview — shares the same banner_image */}
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Customer Dashboard Banner Preview</p>
                    <div
                        className="relative flex min-h-[120px] items-center overflow-hidden rounded-2xl p-6 text-white"
                        style={bannerBg
                            ? { backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : { background: 'linear-gradient(to right, #1a4d1a, #2d6a2d, #4a9e4a)' }
                        }
                    >
                        {bannerBg && <div className="absolute inset-0 bg-black/30" />}
                        <div className="relative z-10">
                            <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-green-200">{data.dashboard_banner_subtitle}</p>
                            <h1 className="mb-1 text-xl font-bold">{data.dashboard_banner_title}</h1>
                            <p className="mb-3 text-xs text-green-100">{data.dashboard_banner_description}</p>
                            <span className="rounded-full bg-[#f59e0b] px-4 py-1.5 text-xs font-bold">{data.dashboard_banner_btn}</span>
                        </div>
                        {!bannerBg && <div className="absolute right-0 top-0 bottom-0 flex w-1/3 items-center justify-center select-none text-[80px] opacity-10">🌾</div>}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Single Banner Image Upload */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">Banner Image</h2>
                        <p className="text-xs text-gray-400">This image is shared across both the Welcome page and Customer Dashboard banners.</p>
                        <ImageUploadField
                            label="Banner Image (Welcome & Dashboard)"
                            fieldKey="banner_image"
                            currentPath={typeof data.banner_image === 'string' ? data.banner_image : ''}
                            preview={bannerPreview}
                            onPreviewChange={setBannerPreview}
                            onFileChange={f => setData('banner_image' as any, f as any)}
                        />
                    </div>

                    {/* GCash QR Section */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">GCash Payment</h2>
                        <ImageUploadField
                            label="GCash QR Code Image"
                            fieldKey="gcash_qr_image"
                            currentPath={typeof data.gcash_qr_image === 'string' ? data.gcash_qr_image : ''}
                            preview={gcashQrPreview}
                            onPreviewChange={setGcashQrPreview}
                            onFileChange={f => setData('gcash_qr_image' as any, f as any)}
                        />
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">GCash Number</label>
                            <input
                                type="text"
                                value={data.gcash_number ?? ''}
                                onChange={e => set('gcash_number', e.target.value)}
                                placeholder="e.g. 09XX-XXX-XXXX"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">GCash Account Name</label>
                            <input
                                type="text"
                                value={data.gcash_name ?? ''}
                                onChange={e => set('gcash_name', e.target.value)}
                                placeholder="e.g. Juan D."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d]"
                            />
                        </div>
                    </div>

                    {/* Text Sections */}
                    {TEXT_SECTIONS.map(section => (
                        <div key={section.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                            <h2 className="border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{section.title}</h2>
                            {section.fields.map(({ key, label }) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
                                    <input
                                        type="text"
                                        value={data[key] ?? ''}
                                        onChange={e => set(key, e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a2d]"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-[#2d6a2d] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245724] disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : 'Save All Settings'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
