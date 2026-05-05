<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        // Seed default null values so the keys exist
        Setting::firstOrCreate(['key' => 'banner_image'],           ['value' => null]);
        Setting::firstOrCreate(['key' => 'dashboard_banner_title'], ['value' => 'My Dashboard']);
        Setting::firstOrCreate(['key' => 'dashboard_banner_subtitle'], ['value' => 'Welcome back']);
        Setting::firstOrCreate(['key' => 'dashboard_banner_description'], ['value' => 'Track your orders, favorites, and more.']);
        Setting::firstOrCreate(['key' => 'dashboard_banner_btn'],   ['value' => 'Shop Now →']);
        Setting::firstOrCreate(['key' => 'dashboard_banner_image'], ['value' => null]);
    }

    public function down(): void
    {
        Setting::whereIn('key', [
            'banner_image',
            'dashboard_banner_title',
            'dashboard_banner_subtitle',
            'dashboard_banner_description',
            'dashboard_banner_btn',
            'dashboard_banner_image',
        ])->delete();
    }
};
