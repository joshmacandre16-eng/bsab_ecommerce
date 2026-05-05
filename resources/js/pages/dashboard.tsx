import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketplace', href: '/dashboard' },
];

interface Props {
    products?: PaginatedProducts;
    categories?: Category[];
    brands?: Brand[];
    filters?: Filters;
}

export default function Dashboard({ products, categories = [], brands = [], filters = {} }: Props) {
    const emptyProducts: PaginatedProducts = { data: [], links: [], meta: { total: 0, current_page: 1, last_page: 1 } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketplace" />
            <div className="flex h-full flex-1 flex-col">
                <ShopGrid
                    products={products ?? emptyProducts}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="dashboard"
                    title="Marketplace"
                    subtitle="Browse all available products"
                />
            </div>
        </AppLayout>
    );
}
