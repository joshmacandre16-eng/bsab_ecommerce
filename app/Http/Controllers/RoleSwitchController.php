<?php

namespace App\Http\Controllers;

use App\Models\SellerApplication;
use Illuminate\Http\Request;

class RoleSwitchController extends Controller
{
    public function switch(Request $request)
    {
        $user = auth()->user();

        // Check if user has an approved seller application
        $approved = SellerApplication::where('user_id', $user->id)
            ->where('status', 'approved')
            ->exists();

        // Ensure user always has the customer role
        if (!$user->hasRole('customer')) {
            $user->assignRole('customer');
        }

        // Ensure approved sellers always have the seller role
        if ($approved && !$user->hasRole('seller')) {
            $user->assignRole('seller');
        }

        $activeRole = session('active_role', null);
        if (!$activeRole) {
            session(['active_role' => 'customer']);
            $activeRole = 'customer';
        }

        if ($activeRole === 'seller' && $user->hasRole('seller')) {
            // Switch to customer
            session(['active_role' => 'customer']);
            return redirect()->route('dashboard')->with('success', 'Switched to Customer mode.');
        }

        if ($activeRole === 'customer' && $approved && $user->hasRole('seller')) {
            // Switch to seller
            session(['active_role' => 'seller']);
            return redirect()->route('seller.dashboard')->with('success', 'Switched to Seller mode.');
        }

        if (!$approved) {
            return redirect()->route('seller.application.create')
                ->with('error', 'You need an approved seller application to switch to Seller mode.');
        }

        return back()->with('error', 'Cannot switch roles.');
    }
}
