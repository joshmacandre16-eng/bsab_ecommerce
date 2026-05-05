import { Head } from '@inertiajs/react';
import PromotionForm from './PromotionForm';

interface Coupon {
    id: number; code: string; type: string; value: number;
    valid_from?: string; valid_to?: string; usage_limit?: number; active: boolean;
}

export default function EditPromotion({ coupon }: { coupon: Coupon }) {
    return (
        <>
            <Head title="Edit Voucher" />
            <PromotionForm
                coupon={coupon}
                submitRoute={route('seller.promotions.update', coupon.id)}
                method="put"
                breadcrumb="Edit Voucher"
                title="Edit Voucher"
            />
        </>
    );
}
