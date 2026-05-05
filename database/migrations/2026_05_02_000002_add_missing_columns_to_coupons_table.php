<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            if (!Schema::hasColumn('coupons', 'valid_from'))           $table->date('valid_from')->nullable()->after('used_count');
            if (!Schema::hasColumn('coupons', 'valid_to'))             $table->date('valid_to')->nullable()->after('valid_from');
            if (!Schema::hasColumn('coupons', 'max_discount'))         $table->decimal('max_discount', 10, 2)->nullable()->after('min_order_amount');
            if (!Schema::hasColumn('coupons', 'applicable_products'))  $table->json('applicable_products')->nullable()->after('valid_to');
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['valid_from', 'valid_to', 'max_discount', 'applicable_products']);
        });
    }
};
