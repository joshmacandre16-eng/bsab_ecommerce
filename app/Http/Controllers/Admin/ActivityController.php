<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $logs = SystemLog::with('user:id,name,email')
            ->when($request->user_id,  fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->method,   fn($q) => $q->where('method', strtoupper($request->method)))
            ->when($request->search,   fn($q) => $q->where('action', 'like', "%{$request->search}%")
                                                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%")))
            ->when($request->date,     fn($q) => $q->whereDate('created_at', $request->date))
            ->latest()
            ->paginate(50)
            ->withQueryString();

        $counts = [
            'total'   => SystemLog::count(),
            'today'   => SystemLog::whereDate('created_at', today())->count(),
            'gets'    => SystemLog::where('method', 'GET')->count(),
            'writes'  => SystemLog::whereIn('method', ['POST', 'PUT', 'PATCH', 'DELETE'])->count(),
        ];

        return Inertia::render('Admin/Activity/Index', [
            'logs'    => $logs,
            'counts'  => $counts,
            'filters' => $request->only(['search', 'method', 'date', 'user_id']),
        ]);
    }
}
