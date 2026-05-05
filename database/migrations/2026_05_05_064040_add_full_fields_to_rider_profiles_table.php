<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rider_profiles', function (Blueprint $table) {
            // Personal
            $table->date('date_of_birth')->nullable()->after('user_id');
            $table->string('phone')->nullable()->after('date_of_birth');
            $table->text('address')->nullable()->after('phone');
            $table->string('emergency_contact_name')->nullable()->after('address');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');

            // Documents
            $table->string('id_document')->nullable()->after('license_number');   // path
            $table->string('vehicle_registration')->nullable()->after('id_document');
            $table->string('proof_of_insurance')->nullable()->after('vehicle_registration');
            $table->string('nbi_clearance')->nullable()->after('proof_of_insurance');
            $table->string('tin')->nullable()->after('nbi_clearance');
            $table->string('bank_account')->nullable()->after('tin');  // account/e-wallet

            // Vehicle
            $table->string('or_cr')->nullable()->after('bank_account');
            $table->boolean('has_helmet')->default(false)->after('or_cr');
            $table->boolean('has_phone_mount')->default(false)->after('has_helmet');

            // Status
            $table->enum('status', ['pending', 'approved', 'declined'])->default('pending')->after('has_phone_mount');
            $table->text('decline_reason')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('rider_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth','phone','address','emergency_contact_name','emergency_contact_phone',
                'id_document','vehicle_registration','proof_of_insurance','nbi_clearance','tin','bank_account',
                'or_cr','has_helmet','has_phone_mount','status','decline_reason',
            ]);
        });
    }
};
