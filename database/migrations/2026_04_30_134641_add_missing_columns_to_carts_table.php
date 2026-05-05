<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->string('coupon_code')->nullable()->after('guest_token');
            $table->decimal('subtotal', 10, 2)->default(0)->after('coupon_code');
            $table->decimal('tax', 10, 2)->default(0)->after('subtotal');
            $table->decimal('shipping', 10, 2)->default(0)->after('tax');
            $table->decimal('discount', 10, 2)->default(0)->after('shipping');
            $table->decimal('total', 10, 2)->default(0)->after('discount');
        });
    }

    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['coupon_code', 'subtotal', 'tax', 'shipping', 'discount', 'total']);
        });
    }
};
