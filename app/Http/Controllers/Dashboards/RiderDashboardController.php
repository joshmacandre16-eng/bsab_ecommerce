<?php

namespace App\Http\Controllers\Dashboards;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Rider\RiderController;

class RiderDashboardController extends Controller
{
    public function index()
    {
        return app(RiderController::class)->dashboard();
    }
}
