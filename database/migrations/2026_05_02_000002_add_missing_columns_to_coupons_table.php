<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->date('valid_from')->nullable()->after('used_count');
            $table->date('valid_to')->nullable()->after('valid_from');
            $table->decimal('max_discount', 10, 2)->nullable()->after('min_order_amount');
            $table->json('applicable_products')->nullable()->after('valid_to');
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['valid_from', 'valid_to', 'max_discount', 'applicable_products']);
        });
    }
};
