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
        $input = $request->validate([
            'search'  => 'nullable|string|max:255',
            'method'  => 'nullable|in:GET,POST,PUT,PATCH,DELETE',
            'date'    => 'nullable|date',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $logs = SystemLog::with('user:id,name,email')
            ->when($input['user_id'] ?? null,  fn($q, $v) => $q->where('user_id', $v))
            ->when($input['method'] ?? null,   fn($q, $v) => $q->where('method', $v))
            ->when($input['search'] ?? null,   fn($q, $v) => $q->where('action', 'like', '%' . $v . '%')
                                                               ->orWhereHas('user', fn($u) => $u->where('name', 'like', '%' . $v . '%')))
            ->when($input['date'] ?? null,     fn($q, $v) => $q->whereDate('created_at', $v))
            ->latest()
            ->paginate(50)
            ->withQueryString();

        $counts = [
            'total'  => SystemLog::count(),
            'today'  => SystemLog::whereDate('created_at', today())->count(),
            'gets'   => SystemLog::where('method', 'GET')->count(),
            'writes' => SystemLog::whereIn('method', ['POST', 'PUT', 'PATCH', 'DELETE'])->count(),
        ];

        return Inertia::render('Admin/Activity/Index', [
            'logs'    => $logs,
            'counts'  => $counts,
            'filters' => array_merge(['search' => '', 'method' => '', 'date' => '', 'user_id' => ''], array_filter($input, fn($v) => $v !== null)),
        ]);
    }
}
