<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $input = $request->validate([
            'search' => 'nullable|string|max:255',
            'role'   => 'nullable|exists:roles,name',
        ]);

        $users = User::with('roles')
            ->when($input['search'] ?? null, fn($q, $s) => $q->where('name', 'like', '%' . $s . '%')->orWhere('email', 'like', '%' . $s . '%'))
            ->when($input['role'] ?? null,   fn($q, $r) => $q->role($r))
            ->latest()
            ->paginate(20);

        $roles = Role::select('id', 'name')->get();

        $counts = [
            'total'    => User::count(),
            'customers'=> User::role('customer')->count(),
            'sellers'  => User::role('seller')->count(),
            'admins'   => User::role('admin')->count(),
            'active'   => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Users/Index', compact('users', 'roles', 'counts'));
    }

    public function show(User $user)
    {
        $user->load(['roles', 'sellerProfile', 'orders' => fn($q) => $q->latest()->take(5)]);
        $roles = Role::select('id', 'name')->get();
        return Inertia::render('Admin/Users/Show', compact('user', 'roles'));
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|exists:roles,name']);
        abort_if($user->id === auth()->id(), 403, 'Cannot change your own role.');
        $user->syncRoles([$request->role]);
        return back()->with('success', 'Role updated to ' . $request->role . '.');
    }

    public function toggleStatus(User $user)
    {
        abort_if($user->id === auth()->id(), 403, 'Cannot deactivate your own account.');
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "User {$status} successfully.");
    }

    public function destroy(User $user)
    {
        abort_if($user->id === auth()->id(), 403, 'Cannot delete your own account.');
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }
}
