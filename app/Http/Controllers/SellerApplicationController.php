<?php

namespace App\Http\Controllers;

use App\Models\SellerApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SellerApplicationController extends Controller
{
    /** Show the application form (customer) */
    public function create()
    {
        $user = Auth::user();

        $existing = SellerApplication::where('user_id', $user->id)->latest()->first();

        return Inertia::render('Customer/SellerApplication/Create', [
            'user'     => $user,
            'existing' => $existing,
        ]);
    }

    /** Store the application (customer) */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Prevent duplicate pending/approved applications
        $existing = SellerApplication::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return back()->with('error', 'You already have a pending or approved application.');
        }

        $validated = $request->validate([
            'full_name'                  => 'required|string|max:255',
            'date_of_birth'              => 'required|date|before:today',
            'contact_number'             => 'required|string|max:20',
            'email'                      => 'required|email|max:255',
            'government_id_type'         => 'required|string|max:100',
            'government_id'              => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'business_name'              => 'nullable|string|max:255',
            'business_type'              => 'nullable|string|max:100',
            'business_registration'      => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'tin'                        => 'nullable|string|max:50',
            'business_address'           => 'nullable|string|max:500',
        ]);

        $govIdPath = $request->file('government_id')->store('seller-applications/gov-ids', 'public');

        $bizRegPath = null;
        if ($request->hasFile('business_registration')) {
            $bizRegPath = $request->file('business_registration')->store('seller-applications/biz-docs', 'public');
        }

        SellerApplication::create([
            'user_id'                    => $user->id,
            'full_name'                  => $validated['full_name'],
            'date_of_birth'              => $validated['date_of_birth'],
            'contact_number'             => $validated['contact_number'],
            'email'                      => $validated['email'],
            'government_id_type'         => $validated['government_id_type'],
            'government_id_path'         => $govIdPath,
            'business_name'              => $validated['business_name'] ?? null,
            'business_type'              => $validated['business_type'] ?? null,
            'business_registration_path' => $bizRegPath,
            'tin'                        => $validated['tin'] ?? null,
            'business_address'           => $validated['business_address'] ?? null,
            'status'                     => 'pending',
        ]);

        return redirect()->route('dashboard')->with('success', 'Your seller application has been submitted! We will review it shortly.');
    }

    /** Admin: list all applications */
    public function index()
    {
        $applications = SellerApplication::with('user:id,name,email')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/SellerApplications/Index', [
            'applications' => $applications,
        ]);
    }

    /** Admin: show single application */
    public function show(SellerApplication $sellerApplication)
    {
        $sellerApplication->load(['user:id,name,email', 'reviewer:id,name']);

        return Inertia::render('Admin/SellerApplications/Show', [
            'application' => $sellerApplication,
        ]);
    }

    /** Admin: approve */
    public function approve(Request $request, SellerApplication $sellerApplication)
    {
        $request->validate(['admin_notes' => 'nullable|string|max:500']);

        $sellerApplication->update([
            'status'      => 'approved',
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // Assign seller role (keep customer role too)
        $user = $sellerApplication->user;
        if (!$user->hasRole('seller')) {
            $user->assignRole('seller');
        }
        if (!$user->hasRole('customer')) {
            $user->assignRole('customer');
        }
        if (!$user->sellerProfile) {
            $user->sellerProfile()->create([
                'store_name'        => $sellerApplication->business_name ?? $sellerApplication->full_name . "'s Store",
                'store_description' => '',
                'store_logo'        => null,
                'commission_rate'   => 0.10,
                'balance'           => 0.00,
                'payout_details'    => [],
            ]);
        }

        return back()->with('success', 'Application approved. User is now a seller.');
    }

    /** Admin: decline */
    public function decline(Request $request, SellerApplication $sellerApplication)
    {
        $request->validate(['admin_notes' => 'nullable|string|max:500']);

        $sellerApplication->update([
            'status'      => 'declined',
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Application declined.');
    }
}
