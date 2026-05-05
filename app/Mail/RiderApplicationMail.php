<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RiderApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $status,          // 'pending' | 'approved' | 'declined'
        public ?string $declineReason = null,
    ) {}

    public function envelope(): Envelope
    {
        $subject = match ($this->status) {
            'approved' => 'Your Rider Application Has Been Approved!',
            'declined' => 'Update on Your Rider Application',
            default    => 'Rider Application Received',
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.rider-application');
    }
}
