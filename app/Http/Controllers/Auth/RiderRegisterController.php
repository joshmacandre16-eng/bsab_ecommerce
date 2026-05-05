<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\RiderApplicationMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RiderRegisterController extends Controller
{
    public function create(string $token): Response|RedirectResponse
    {
        if (! $this->validToken($token)) {
            abort(403, 'Invalid or missing registration token.');
        }

        return Inertia::render('auth/rider-register', ['token' => $token]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        if (! $this->validToken($token)) {
            abort(403, 'Invalid or missing registration token.');
        }
        $request->validate([
            // Account
            'first_name'               => 'required|string|max:255',
            'last_name'                => 'required|string|max:255',
            'email'                    => 'required|email|lowercase|max:255|unique:users,email',
            'password'                 => ['required', 'confirmed', Rules\Password::defaults()],
            // Personal
            'date_of_birth'            => 'required|date|before:-18 years',
            'phone'                    => 'required|string|max:20',
            'address'                  => 'required|string|max:500',
            'emergency_contact_name'   => 'required|string|max:255',
            'emergency_contact_phone'  => 'required|string|max:20',
            // Documents
            'id_document'              => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'tin'                      => 'required|string|max:50',
            'bank_account'             => 'required|string|max:255',
            'nbi_clearance'            => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            // Vehicle
            'vehicle_type'             => 'required|in:motorcycle,scooter,bicycle,car',
            'license_number'           => 'required|string|max:50',
            'vehicle_registration'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'proof_of_insurance'       => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'or_cr'                    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'has_helmet'               => 'required|boolean',
            'has_phone_mount'          => 'required|boolean',
        ]);

        $user = User::create([
            'name'       => trim($request->first_name . ' ' . $request->last_name),
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'phone'      => $request->phone,
            'role'       => 'rider',
        ]);

        $user->assignRole('rider');

        $store = fn($file, $folder) => $file ? $file->store("rider-docs/{$folder}", 'public') : null;

        $user->riderProfile()->create([
            'date_of_birth'           => $request->date_of_birth,
            'phone'                   => $request->phone,
            'address'                 => $request->address,
            'emergency_contact_name'  => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'vehicle_type'            => $request->vehicle_type,
            'license_number'          => $request->license_number,
            'id_document'             => $store($request->file('id_document'), 'id'),
            'vehicle_registration'    => $store($request->file('vehicle_registration'), 'vehicle'),
            'proof_of_insurance'      => $store($request->file('proof_of_insurance'), 'insurance'),
            'nbi_clearance'           => $store($request->file('nbi_clearance'), 'nbi'),
            'tin'                     => $request->tin,
            'bank_account'            => $request->bank_account,
            'or_cr'                   => $store($request->file('or_cr'), 'orcr'),
            'has_helmet'              => $request->boolean('has_helmet'),
            'has_phone_mount'         => $request->boolean('has_phone_mount'),
            'status'                  => 'pending',
        ]);

        try {
            Mail::to($user->email)->send(new RiderApplicationMail($user, 'pending'));
        } catch (\Exception $e) {
            logger()->error('Rider application mail failed: ' . $e->getMessage());
        }

        return redirect()->route('login')
            ->with('status', 'Application submitted! Check your email for confirmation.');
    }

    private function validToken(string $token): bool
    {
        $secret = config('auth.rider_register_token');
        return $secret && hash_equals($secret, $token);
    }

    /** Called by admin to approve a rider application */
    public function approve(User $user): RedirectResponse
    {
        $user->riderProfile()->update(['status' => 'approved']);
        $user->update(['is_active' => true]);

        try {
            Mail::to($user->email)->send(new RiderApplicationMail($user, 'approved'));
        } catch (\Exception $e) {
            logger()->error('Rider approval mail failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Rider approved.');
    }

    /** Called by admin to decline a rider application */
    public function decline(Request $request, User $user): RedirectResponse
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $user->riderProfile()->update([
            'status'         => 'declined',
            'decline_reason' => $request->reason,
        ]);

        try {
            Mail::to($user->email)->send(new RiderApplicationMail($user, 'declined', $request->reason));
        } catch (\Exception $e) {
            logger()->error('Rider decline mail failed: ' . $e->getMessage());
        }

        return back()->with('success', 'Rider application declined.');
    }
}
