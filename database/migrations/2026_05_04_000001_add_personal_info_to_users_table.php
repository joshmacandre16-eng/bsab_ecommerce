<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'first_name'))    $table->string('first_name')->nullable()->after('name');
            if (!Schema::hasColumn('users', 'last_name'))     $table->string('last_name')->nullable()->after('first_name');
            if (!Schema::hasColumn('users', 'middle_name'))   $table->string('middle_name')->nullable()->after('last_name');
            if (!Schema::hasColumn('users', 'date_of_birth')) $table->date('date_of_birth')->nullable()->after('middle_name');
            if (!Schema::hasColumn('users', 'gender'))        $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable()->after('date_of_birth');
        });

        Schema::table('addresses', function (Blueprint $table) {
            if (!Schema::hasColumn('addresses', 'is_profile_address'))
                $table->boolean('is_profile_address')->default(false)->after('is_default');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'middle_name', 'date_of_birth', 'gender']);
        });
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn('is_profile_address');
        });
    }
};
