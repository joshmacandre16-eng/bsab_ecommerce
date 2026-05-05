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
        Schema::table('vendor_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('vendor_profiles', 'user_id'))            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            if (!Schema::hasColumn('vendor_profiles', 'store_name'))         $table->string('store_name');
            if (!Schema::hasColumn('vendor_profiles', 'store_description'))  $table->text('store_description')->nullable();
            if (!Schema::hasColumn('vendor_profiles', 'store_logo'))         $table->string('store_logo')->nullable();
            if (!Schema::hasColumn('vendor_profiles', 'commission_rate'))    $table->decimal('commission_rate', 8, 2)->default(0.10);
            if (!Schema::hasColumn('vendor_profiles', 'balance'))            $table->decimal('balance', 8, 2)->default(0.00);
            if (!Schema::hasColumn('vendor_profiles', 'payout_details'))     $table->json('payout_details')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'store_name', 'store_description', 'store_logo', 'commission_rate', 'balance', 'payout_details']);
        });

    }
};
