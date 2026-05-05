<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Personal Information
            $table->string('full_name');
            $table->date('date_of_birth');
            $table->string('contact_number');
            $table->string('email');
            $table->string('government_id_type');
            $table->string('government_id_path');

            // Business Information
            $table->string('business_name')->nullable();
            $table->string('business_type')->nullable();
            $table->string('business_registration_path')->nullable();
            $table->string('tin')->nullable();
            $table->string('business_address')->nullable();

            // Status
            $table->enum('status', ['pending', 'approved', 'declined'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_applications');
    }
};
