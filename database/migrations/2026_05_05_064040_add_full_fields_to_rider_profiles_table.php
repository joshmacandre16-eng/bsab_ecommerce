<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rider_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('rider_profiles', 'date_of_birth'))             $table->date('date_of_birth')->nullable()->after('user_id');
            if (!Schema::hasColumn('rider_profiles', 'phone'))                     $table->string('phone')->nullable()->after('date_of_birth');
            if (!Schema::hasColumn('rider_profiles', 'address'))                   $table->text('address')->nullable()->after('phone');
            if (!Schema::hasColumn('rider_profiles', 'emergency_contact_name'))    $table->string('emergency_contact_name')->nullable()->after('address');
            if (!Schema::hasColumn('rider_profiles', 'emergency_contact_phone'))   $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            if (!Schema::hasColumn('rider_profiles', 'id_document'))               $table->string('id_document')->nullable()->after('license_number');
            if (!Schema::hasColumn('rider_profiles', 'vehicle_registration'))      $table->string('vehicle_registration')->nullable()->after('id_document');
            if (!Schema::hasColumn('rider_profiles', 'proof_of_insurance'))        $table->string('proof_of_insurance')->nullable()->after('vehicle_registration');
            if (!Schema::hasColumn('rider_profiles', 'nbi_clearance'))             $table->string('nbi_clearance')->nullable()->after('proof_of_insurance');
            if (!Schema::hasColumn('rider_profiles', 'tin'))                       $table->string('tin')->nullable()->after('nbi_clearance');
            if (!Schema::hasColumn('rider_profiles', 'bank_account'))              $table->string('bank_account')->nullable()->after('tin');
            if (!Schema::hasColumn('rider_profiles', 'or_cr'))                     $table->string('or_cr')->nullable()->after('bank_account');
            if (!Schema::hasColumn('rider_profiles', 'has_helmet'))                $table->boolean('has_helmet')->default(false)->after('or_cr');
            if (!Schema::hasColumn('rider_profiles', 'has_phone_mount'))           $table->boolean('has_phone_mount')->default(false)->after('has_helmet');
            if (!Schema::hasColumn('rider_profiles', 'status'))                    $table->enum('status', ['pending', 'approved', 'declined'])->default('pending')->after('has_phone_mount');
            if (!Schema::hasColumn('rider_profiles', 'decline_reason'))            $table->text('decline_reason')->nullable()->after('status');
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
