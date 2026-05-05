<?php

namespace App\Services;

use App\Models\SystemLog;
use Illuminate\Http\Request;

class ActivityLogger
{
    public static function log(string $action, ?object $model = null, array $old = [], array $new = [], ?Request $request = null): void
    {
        $request ??= request();

        SystemLog::create([
            'user_id'    => auth()->id(),
            'action'     => $action,
            'model_type' => $model ? class_basename($model) : null,
            'model_id'   => $model?->getKey(),
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url'        => $request->fullUrl(),
            'method'     => $request->method(),
        ]);
    }
}
