import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
}

export interface Brand {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id: number;
    brand_id: number;
    vendor_id: number;
    status: 'active' | 'inactive';
    category?: Category;
    brand?: Brand;
    vendor?: User;
}
