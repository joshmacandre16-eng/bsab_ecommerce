<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_profiles', 'wishlist'))
                $table->json('wishlist')->nullable()->after('total_spent');
        });
    }

    public function down(): void
    {
        Schema::table('customer_profiles', function (Blueprint $table) {
            $table->dropColumn('wishlist');
        });
    }
};
