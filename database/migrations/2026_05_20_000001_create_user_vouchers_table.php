<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('coupon_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_used')->default(false);
            $table->timestamps();
            $table->unique(['user_id', 'coupon_id']);
        });

        Schema::table('coupons', function (Blueprint $table) {
            $table->unsignedInteger('claim_limit')->nullable()->after('usage_limit')
                ->comment('Max number of users who can claim this voucher');
            $table->unsignedInteger('claimed_count')->default(0)->after('claim_limit');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_vouchers');
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['claim_limit', 'claimed_count']);
        });
    }
};
