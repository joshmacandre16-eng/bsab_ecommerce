import { Head } from '@inertiajs/react';
import ShopLayout from '@/components/shop/ShopLayout';
import ShopGrid, { type PaginatedProducts, type Category, type Brand, type Filters } from '@/components/shop/ShopGrid';

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
}

export default function AllProducts({ products, categories, brands, filters }: Props) {
    return (
        <>
            <Head title="All Products — AgriShop" />
            <ShopLayout activeNav="All Products">
                <ShopGrid
                    products={products}
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    routeName="shop.products"
                    title="All Products"
                    subtitle="Browse our complete collection"
                />
            </ShopLayout>
        </>
    );
}
