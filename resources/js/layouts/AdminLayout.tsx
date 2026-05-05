import { ReactNode } from 'react';
import AppShell from './AppShell';

const NAV = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard',   routeName: 'dashboard',              icon: '⊞' },
        ],
    },
    {
        label: 'Users',
        items: [
            { name: 'Users',               routeName: 'admin.users.index',                icon: '👥' },
            { name: 'Riders',              routeName: 'admin.riders.index',               icon: '🛵' },
            { name: 'Seller Applications', routeName: 'admin.seller-applications.index',  icon: '🏪' },
        ],
    },
    {
        label: 'Commerce',
        items: [
            { name: 'Products',    routeName: 'admin.products.index',   icon: '📦' },
            { name: 'Categories',  routeName: 'admin.categories.index', icon: '🗂' },
            { name: 'Brands',      routeName: 'admin.brands.index',     icon: '🏷' },
            { name: 'Orders',      routeName: 'admin.orders.index',     icon: '🛒' },
            { name: 'Returns',     routeName: 'admin.returns.index',    icon: '↩' },
        ],
    },
    {
        label: 'Finance',
        items: [
            { name: 'Payments',    routeName: 'admin.payments.index',   icon: '💳' },
            { name: 'Coupons',     routeName: 'admin.coupons.index',    icon: '🎟' },
        ],
    },
    {
        label: 'Insights',
        items: [
            { name: 'Reports',     routeName: 'admin.reports.index',    icon: '📊' },
            { name: 'Activity',    routeName: 'admin.activity.index',   icon: '📋' },
        ],
    },
    {
        label: 'System',
        items: [
            { name: 'Settings',    routeName: 'admin.settings.index',   icon: '⚙️' },
        ],
    },
];

interface Props { children: ReactNode; breadcrumb?: string }

export default function AdminLayout({ children, breadcrumb }: Props) {
    return (
        <AppShell nav={NAV} breadcrumb={breadcrumb} roleLabel="Admin" accentClass="admin">
            {children}
        </AppShell>
    );
}
