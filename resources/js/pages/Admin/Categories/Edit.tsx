import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FolderOpen, Save } from 'lucide-react';
import { FormEvent } from 'react';

interface Category {
    id: number;
    name: string;
    parent_category_id?: number;
    image?: string;
}

interface Props {
    category: Category;
    parentCategories: Category[];
}

export default function CategoryEdit({ category, parentCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: category.name,
        parent_category_id: category.parent_category_id?.toString() ?? '',
        image: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.categories.update', category.id), { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Category" />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 flex items-center gap-4">
                        <Link href={route('admin.categories.index')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                            <p className="text-sm text-gray-500">Update category information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FolderOpen className="h-5 w-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Category Details</h2>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Category
                            </label>
                            <select
                                id="parent_category_id"
                                value={data.parent_category_id}
                                onChange={(e) => setData('parent_category_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">None (Top-level category)</option>
                                {parentCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.parent_category_id && <p className="mt-1 text-sm text-red-500">{errors.parent_category_id}</p>}
                        </div>

                        {category.image && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Current Image</p>
                                <img src={`/storage/${category.image}`} alt={category.name} className="h-20 w-20 rounded-lg object-cover border border-gray-200" />
                            </div>
                        )}

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                {category.image ? 'Replace Image' : 'Image'}
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700"
                            />
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                            <Link
                                href={route('admin.categories.index')}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Update Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
