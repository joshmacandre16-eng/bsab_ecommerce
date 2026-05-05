<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use Inertia\Inertia;

class PaymentMonitoringController extends Controller
{
    public function index()
    {
        $transactions = PaymentTransaction::with(['order.user'])
            ->latest()
            ->paginate(25);

        $stats = [
            'total'   => PaymentTransaction::count(),
            'paid'    => PaymentTransaction::where('status', 'paid')->count(),
            'pending' => PaymentTransaction::where('status', 'pending')->count(),
            'failed'  => PaymentTransaction::where('status', 'failed')->count(),
            'revenue' => (float) PaymentTransaction::where('status', 'paid')->sum('amount'),
        ];

        return Inertia::render('Admin/Payments/Index', compact('transactions', 'stats'));
    }
}
