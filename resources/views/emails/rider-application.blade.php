@component('mail::message')

@if ($status === 'approved')
# 🎉 Congratulations — You're Hired!

Hi **{{ $user->name }}**,

We are thrilled to inform you that your rider application to **{{ config('app.name') }}** has been **approved**. Welcome to the team!

You can now log in to your rider account and start accepting delivery orders right away.

@component('mail::button', ['url' => url('/login'), 'color' => 'success'])
Log In & Start Delivering
@endcomponent

**What's next?**
- Log in using your registered email and password
- Complete your vehicle checklist before your first delivery
- Head to your dashboard to view available pickups

If you have any questions, feel free to reach out to our support team.

@elseif ($status === 'declined')
# Application Update

Hi **{{ $user->name }}**,

Thank you for your interest in joining **{{ config('app.name') }}** as a delivery rider.

After reviewing your application, we regret to inform you that we are **unable to move forward** with your application at this time.

@if ($declineReason)
**Reason provided:**
> {{ $declineReason }}

@endif
If you believe this decision was made in error or you would like to address the concerns above, please don't hesitate to contact our support team. You are also welcome to reapply in the future once the issues have been resolved.

We appreciate the time you took to apply and wish you all the best.

@else
# Application Received

Hi **{{ $user->name }}**,

Thank you for submitting your rider application to **{{ config('app.name') }}**.

We have received your application and our team will review it shortly. You will receive another email once a decision has been made — usually within 1–3 business days.

@endif

Thanks,
**{{ config('app.name') }} Team**
@endcomponent
