import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ImagePlus, Package, Save, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface Category { id: number; name: string }
interface Brand { id: number; name: string }

export default function AdminProductCreate({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string; description: string; price: string;
        stock_quantity: string; category_id: string; brand_id: string;
        status: string; slug: string; weight: string; weight_unit: string; sku: string; images: File[];
    }>({
        name: '', description: '', price: '', 
        stock_quantity: '', category_id: '', brand_id: '',
        status: 'active', slug: '', weight: '', weight_unit: 'kg', sku: '', images: [],
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImages = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).slice(0, 8 - data.images.length);
        setData('images', [...data.images, ...newFiles]);
        setPreviews((p) => [...p, ...newFiles.map((f) => URL.createObjectURL(f))]);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setData('images', data.images.filter((_, i) => i !== index));
        setPreviews((p) => p.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'), { forceFormData: true });
    };

    return (
        <>
            <Head title="Add New Product" />
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
                    <div className="flex items-center">
                        <Link href={route('dashboard')} className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-sm text-gray-500">Create a new product listing</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href={route('dashboard')} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button type="submit" form="product-form" disabled={processing}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl px-8 py-8">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                        {Object.keys(errors).length > 0 && (
                            <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4">
                                <AlertCircle className="mt-0.5 mr-3 h-5 w-5 text-red-500" />
                                <ul className="list-inside list-disc text-sm text-red-600">
                                    {Object.values(errors).map((error, i) => <li key={i}>{error}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                                <Package className="mr-2 h-5 w-5 text-blue-500" /> Basic Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.name}
                                        onChange={(e) => { setData('name', e.target.value); setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter product name" required />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4}
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Describe your product..." required />
                                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                        <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}
                                            className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`} required>
                                            <option value="">Select a category</option>
                                            {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Brand</label>
                                        <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                            <option value="">Select a brand (optional)</option>
                                            {brands.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
                                        <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)}
                                            step="0.01" min="0"
                                            className={`w-full rounded-lg border py-2 pr-4 pl-8 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="0.00" required />
                                    </div>
                                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                                    <input type="number" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)}
                                        min="0"
                                        className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0" required />
                                    {errors.stock_quantity && <p className="mt-1 text-sm text-red-500">{errors.stock_quantity}</p>}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Weight</label>
                                    <div className="flex gap-2">
                                        <input type="number" value={data.weight} onChange={(e) => setData('weight', e.target.value)}
                                            min="0" step="0.01"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00" />
                                        <select value={data.weight_unit} onChange={(e) => setData('weight_unit', e.target.value)}
                                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="ton">ton</option>
                                            <option value="lb">lb</option>
                                            <option value="oz">oz</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">SKU</label>
                                    <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. PROD-001" />
                                    {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Product Images</h2>
                            {previews.length > 0 && (
                                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {previews.map((src, i) => (
                                        <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                                            <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                                            {i === 0 && <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">Primary</span>}
                                            <button type="button" onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 hidden rounded-full bg-red-500 p-0.5 text-white group-hover:flex">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.images.length < 8 && (
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-8 text-gray-500 hover:border-blue-400 hover:text-blue-500">
                                    <ImagePlus className="h-8 w-8" />
                                    <span className="text-sm font-medium">Click to upload images</span>
                                    <span className="text-xs text-gray-400">JPEG, PNG, WebP — max 2MB ({data.images.length}/8)</span>
                                </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                                onChange={(e) => handleImages(e.target.files)} />
                        </div>

                        {/* Status */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Status</h2>
                            <div className="flex items-center space-x-6">
                                {['active', 'inactive'].map((s) => (
                                    <label key={s} className="flex cursor-pointer items-center">
                                        <input type="radio" name="status" value={s} checked={data.status === s}
                                            onChange={() => setData('status', s)}
                                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pb-8">
                            <Link href={route('dashboard')} className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
