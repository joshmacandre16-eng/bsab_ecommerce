<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('system_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('system_logs', 'user_id'))     $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            if (!Schema::hasColumn('system_logs', 'action'))      $table->string('action');
            if (!Schema::hasColumn('system_logs', 'model_type'))  $table->string('model_type')->nullable();
            if (!Schema::hasColumn('system_logs', 'model_id'))    $table->unsignedBigInteger('model_id')->nullable();
            if (!Schema::hasColumn('system_logs', 'old_values'))  $table->json('old_values')->nullable();
            if (!Schema::hasColumn('system_logs', 'new_values'))  $table->json('new_values')->nullable();
            if (!Schema::hasColumn('system_logs', 'ip_address'))  $table->string('ip_address', 45)->nullable();
            if (!Schema::hasColumn('system_logs', 'user_agent'))  $table->text('user_agent')->nullable();
            if (!Schema::hasColumn('system_logs', 'url'))         $table->string('url')->nullable();
            if (!Schema::hasColumn('system_logs', 'method'))      $table->string('method', 10)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('system_logs', function (Blueprint $table) {
            $table->dropColumn(['user_id','action','model_type','model_id','old_values','new_values','ip_address','user_agent','url','method']);
        });
    }
};
