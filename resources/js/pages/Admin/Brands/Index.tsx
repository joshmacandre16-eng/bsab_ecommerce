import { Head, Link, router } from '@inertiajs/react';
import { Tag, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Brand {
    id: number;
    name: string;
    logo?: string;
    products_count: number;
    created_at: string;
}

interface BrandsIndexProps {
    brands: {
        data: Brand[];
        links: any[];
        meta: any;
    };
}

export default function BrandsIndex({ brands }: BrandsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (brandId: number) => {
        if (confirm('Are you sure you want to delete this brand?')) {
            router.delete(route('admin.brands.destroy', brandId));
        }
    };

    return (
        <AdminLayout breadcrumb="Brands">
            <Head title="Brand Management" />
            <div>
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                        <p className="text-gray-600">Manage product brands</p>
                    </div>
                    <Link
                        href={route('admin.brands.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Brand
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Tag className="h-8 w-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Brands</p>
                                <p className="text-2xl font-bold text-gray-900">{brands.meta?.total ?? brands.data.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Tag className="h-8 w-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Brands</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {brands.data.filter(b => b.products_count > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <Tag className="h-8 w-8 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Empty Brands</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {brands.data.filter(b => b.products_count === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {brands.data.map((brand) => (
                        <div key={brand.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Brand Logo */}
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                {brand.logo ? (
                                    <img
                                        src={`/storage/${brand.logo}`}
                                        alt={brand.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Tag className="h-16 w-16 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Brand Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-600">{brand.products_count} products</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(brand.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between space-x-2">
                                    <Link
                                        href={route('admin.brands.edit', brand.id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        disabled={brand.products_count > 0}
                                        className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                
                                {brand.products_count > 0 && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Cannot delete: has products
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {brands.data.length === 0 && (
                    <div className="text-center py-12">
                        <Tag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No brands</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first brand.</p>
                        <div className="mt-6">
                            <Link
                                href={route('admin.brands.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Brand
                            </Link>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {brands.links && brands.data.length > 0 && (
                    <div className="mt-8 flex items-center justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            {brands.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}