import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent?: { name: string };
    products_count: number;
    image?: string;
    created_at: string;
}

interface Props {
    categories: { data: Category[]; links: any[]; meta: any };
}

const CARD_COLORS = [
    'bg-green-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-lime-100',
    'bg-blue-100',
    'bg-purple-100',
    'bg-orange-100',
    'bg-teal-100',
];

export default function CategoriesIndex({ categories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    const total = categories.meta?.total ?? categories.data.length;
    const parentCount = categories.data.filter(c => !c.parent).length;
    const subCount = categories.data.filter(c => c.parent).length;

    const filtered = categories.data.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout breadcrumb="Categories">
            <Head title="Category Management" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-yellow-500">Category Management</h1>
                <p className="text-sm text-gray-500">Organize your products with categories</p>
            </div>

            {/* Stats + Search + Button row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Stat Cards */}
                {[
                    { label: 'TOTAL CATEGORIES', value: total, color: 'bg-green-100' },
                    { label: 'PARENT CATEGORIES', value: parentCount, color: 'bg-green-100' },
                    { label: 'SUB CATEGORIES', value: subCount, color: 'bg-green-100' },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.color} rounded-lg px-5 py-3 min-w-[130px]`}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}

                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400"
                    />
                </div>

                {/* Add Button */}
                <Link
                    href={route('admin.categories.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Link>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((category, i) => (
                    <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        {/* Product count badge */}
                        <div className="px-3 pt-2 flex justify-end">
                            <span className="text-xs text-gray-400">{category.products_count} products</span>
                        </div>

                        {/* Image area */}
                        <div className={`${CARD_COLORS[i % CARD_COLORS.length]} mx-3 rounded-lg flex items-center justify-center h-24 overflow-hidden`}>
                            {category.image ? (
                                <img
                                    src={`/storage/${category.image}`}
                                    alt={category.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            ) : (
                                <FolderOpen className="h-12 w-12 text-gray-400" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-3 flex flex-col gap-1 flex-1">
                            <p className="font-semibold text-sm text-gray-800 truncate">{category.name}</p>
                            <p className="text-xs text-gray-400 truncate">{category.slug}</p>
                            {category.parent && (
                                <span className="text-xs text-blue-600">{category.parent.name}</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-3 pb-3 flex gap-2">
                            <Link
                                href={route('admin.categories.edit', category.id)}
                                className="flex-1 text-center text-xs font-medium py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(category.id)}
                                disabled={category.products_count > 0}
                                className="flex-1 text-xs font-medium py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No categories found.</p>
                    <Link
                        href={route('admin.categories.create')}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                    >
                        <Plus className="h-4 w-4" /> Add Category
                    </Link>
                </div>
            )}
        </AdminLayout>
    );
}
