import { ReactNode } from 'react';
import AppShell from './AppShell';
import { Link } from '@inertiajs/react';

const NAV = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard',     routeName: 'seller.dashboard',        icon: '⊞' },
        ],
    },
    {
        label: 'Commerce',
        items: [
            { name: 'Products',      routeName: 'seller.products.index',   icon: '📦' },
            { name: 'Inventory',     routeName: 'seller.inventory.index',  icon: '🗃' },
            { name: 'Orders',        routeName: 'seller.orders.index',     icon: '🛒' },
            { name: 'Returns',       routeName: 'seller.returns.index',    icon: '↩' },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { name: 'Promotions',    routeName: 'seller.promotions.index', icon: '🎟' },
        ],
    },
    {
        label: 'Insights',
        items: [
            { name: 'Performance',   routeName: 'seller.performance.index', icon: '📈' },
            { name: 'Reviews',       routeName: 'seller.reviews.index',     icon: '⭐' },
            { name: 'Payouts',       routeName: 'seller.payouts',           icon: '💳' },
        ],
    },
    {
        label: 'Account',
        items: [
            { name: 'Store Profile', routeName: 'seller.profile.index',    icon: '🏪' },
        ],
    },
];

interface Props { children: ReactNode; breadcrumb?: string }

export default function SellerLayout({ children, breadcrumb }: Props) {
    return (
        <AppShell nav={NAV} breadcrumb={breadcrumb} roleLabel="Seller" accentClass="seller">
            {children}
        </AppShell>
    );
}
