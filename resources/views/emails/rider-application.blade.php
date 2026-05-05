@component('mail::message')
# {{ $status === 'approved' ? '🎉 Application Approved!' : ($status === 'declined' ? 'Application Update' : 'Application Received') }}

Hi **{{ $user->name }}**,

@if ($status === 'pending')
Thank you for submitting your rider application to **{{ config('app.name') }}**.

We have received your application and our team will review it shortly. You will receive another email once a decision has been made.

@elseif ($status === 'approved')
Congratulations! Your rider application has been **approved**. You can now log in and start accepting delivery orders.

@component('mail::button', ['url' => url('/login'), 'color' => 'success'])
Log In Now
@endcomponent

@elseif ($status === 'declined')
We regret to inform you that your rider application has been **declined**.

@if ($declineReason)
**Reason:** {{ $declineReason }}
@endif

If you believe this is a mistake or would like to reapply, please contact our support team.
@endif

Thanks,<br>
{{ config('app.name') }} Team
@endcomponent
