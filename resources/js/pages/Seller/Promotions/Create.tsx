import { Head } from '@inertiajs/react';
import PromotionForm from './PromotionForm';

export default function CreatePromotion() {
    return (
        <>
            <Head title="Create Voucher" />
            <PromotionForm
                submitRoute={route('seller.promotions.store')}
                method="post"
                breadcrumb="Create Voucher"
                title="Create Voucher"
            />
        </>
    );
}
