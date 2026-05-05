<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiderProfile extends Model
{
    protected $fillable = [
        'user_id', 'date_of_birth', 'phone', 'address',
        'emergency_contact_name', 'emergency_contact_phone',
        'vehicle_type', 'license_number',
        'id_document', 'vehicle_registration', 'proof_of_insurance',
        'nbi_clearance', 'tin', 'bank_account',
        'or_cr', 'has_helmet', 'has_phone_mount',
        'status', 'decline_reason',
    ];

    protected $casts = [
        'has_helmet'      => 'boolean',
        'has_phone_mount' => 'boolean',
        'date_of_birth'   => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
