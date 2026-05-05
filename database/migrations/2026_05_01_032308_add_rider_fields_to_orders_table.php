<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'proof_photo'))   $table->string('proof_photo')->nullable()->after('address_id');
            if (!Schema::hasColumn('orders', 'return_reason')) $table->string('return_reason')->nullable()->after('proof_photo');
            if (!Schema::hasColumn('orders', 'delivered_at'))  $table->timestamp('delivered_at')->nullable()->after('return_reason');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['rider_id']);
            $table->dropColumn(['proof_photo', 'return_reason', 'delivered_at']);
        });
    }
};
