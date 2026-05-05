<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.product.images', 'shipment'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['items.product.images', 'shipment', 'address']);

        return Inertia::render('Customer/Orders/Show', [
            'order' => [
                ...$order->toArray(),
                'shipping_cost' => (float) $order->shipping,
                'payment_status' => $order->payment_collected ? 'paid' : 'unpaid',
                'discount' => 0,
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'images' => $item->product->images->map(fn($img) => [
                            'image_path' => $img->image_path,
                            'url' => $img->url,
                            'is_primary' => $img->is_primary,
                        ])->values()->toArray(),
                    ],
                ])->values()->toArray(),
            ],
        ]);
    }

    public function cancel(Order $order)
    {
        $this->authorize('cancel', $order);

        if (!in_array($order->status, ['pending', 'processing'])) {
            return back()->withErrors(['error' => 'Order cannot be cancelled at this stage.']);
        }

        $order->update(['status' => 'cancelled']);

        return back()->with('success', 'Order cancelled successfully.');
    }

    public function requestReturn(Request $request, Order $order)
    {
        $this->authorize('return', $order);

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Create return request logic here
        
        return back()->with('success', 'Return request submitted successfully.');
    }

    public function downloadInvoice(Order $order)
    {
        $this->authorize('view', $order);

        // Generate and download invoice PDF
        
        return response()->download($invoicePath);
    }
}