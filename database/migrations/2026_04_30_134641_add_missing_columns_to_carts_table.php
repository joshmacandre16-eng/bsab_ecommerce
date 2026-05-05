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
            if (!Schema::hasColumn('carts', 'coupon_code')) $table->string('coupon_code')->nullable()->after('guest_token');
            if (!Schema::hasColumn('carts', 'subtotal'))    $table->decimal('subtotal', 10, 2)->default(0)->after('coupon_code');
            if (!Schema::hasColumn('carts', 'tax'))         $table->decimal('tax', 10, 2)->default(0)->after('subtotal');
            if (!Schema::hasColumn('carts', 'shipping'))    $table->decimal('shipping', 10, 2)->default(0)->after('tax');
            if (!Schema::hasColumn('carts', 'discount'))    $table->decimal('discount', 10, 2)->default(0)->after('shipping');
            if (!Schema::hasColumn('carts', 'total'))       $table->decimal('total', 10, 2)->default(0)->after('discount');
        });
    }

    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['coupon_code', 'subtotal', 'tax', 'shipping', 'discount', 'total']);
        });
    }
};
