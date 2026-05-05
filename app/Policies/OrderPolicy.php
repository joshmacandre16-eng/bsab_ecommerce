<?php

namespace App\Policies;

use App\Models\{Order, User};
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        // Customers can view their own orders list, admins all
        return $user->hasRole(['customer', 'admin']);
    }

    public function view(User $user, Order $order): bool
    {
        // Own order or admin
        return $user->id === $order->user_id || $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('customer');
    }

    // For sellers: view their sold orders?
    public function viewSellerOrders(User $user, Order $order): bool
    {
        if (!$user->hasRole('seller')) return false;
        return $order->items->contains(fn($item) => $item->product->vendor_id === $user->sellerProfile->id);
    }
}
?>

