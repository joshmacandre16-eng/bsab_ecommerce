import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import {
    BarChart2, BookOpen, FolderOpen, Folder, LayoutGrid, LogOut,
    Package, Percent, Settings, ShoppingBag, ShoppingCart,
    Tag, Ticket, Truck, Users, Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

function useNavItems(): NavItem[] {
    const { auth } = usePage<{ auth: { user: { role: string } | null } }>().props;
    const role = auth?.user?.role ?? 'guest';

    const dashboard: NavItem = { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid };

    const adminItems: NavItem[] = [
        dashboard,
        { title: 'Users',      url: '/admin/users',      icon: Users },
        { title: 'Orders',     url: '/admin/orders',     icon: ShoppingCart },
        { title: 'Products',   url: '/products',         icon: Package },
        { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
        { title: 'Brands',     url: '/admin/brands',     icon: Tag },
        { title: 'Coupons',    url: '/admin/coupons',    icon: Percent },
        { title: 'Tickets',    url: '/support/tickets',  icon: Ticket },
        { title: 'Settings',   url: '/settings/profile', icon: Settings },
    ];

    const vendorItems: NavItem[] = [
        dashboard,
        { title: 'My Products', url: '/vendor/products',       icon: Package },
        { title: 'Add Product', url: '/vendor/products/create', icon: Package },
        { title: 'Orders',      url: '/vendor/orders',          icon: ShoppingCart },
        { title: 'Analytics',   url: '/vendor/analytics',       icon: BarChart2 },
        { title: 'Payouts',     url: '/vendor/payouts',         icon: Wallet },
        { title: 'Settings',    url: '/settings/profile',       icon: Settings },
    ];

    const customerItems: NavItem[] = [
        dashboard,
        { title: 'Shop',      url: '/customer/products',       icon: ShoppingBag },
        { title: 'My Orders', url: '/customer/orders',         icon: Truck },
        { title: 'Cart',      url: '/cart',                    icon: ShoppingCart },
        { title: 'Profile',   url: '/customer/profile',        icon: Users },
        { title: 'Addresses', url: '/customer/addresses',      icon: FolderOpen },
        { title: 'Support',   url: '/customer/tickets',        icon: Ticket },
        { title: 'Settings',  url: '/settings/profile',        icon: Settings },
    ];

    const supportItems: NavItem[] = [
        dashboard,
        { title: 'All Tickets', url: '/support/tickets', icon: Ticket },
        { title: 'Settings',    url: '/settings/profile', icon: Settings },
    ];

    switch (role) {
        case 'super_admin':
        case 'admin':
            return adminItems;
        case 'vendor':
            return vendorItems;
        case 'customer':
            return customerItems;
        case 'support_agent':
            return supportItems;
        default:
            return [dashboard];
    }
}

const footerNavItems: NavItem[] = [
    { title: 'Documentation', url: 'https://laravel.com/docs/starter-kits', icon: BookOpen },
];

export function AppSidebar() {
    const navItems = useNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
