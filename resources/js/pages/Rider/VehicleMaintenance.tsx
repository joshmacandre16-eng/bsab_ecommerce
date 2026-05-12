import { Head } from '@inertiajs/react';
import RiderLayout from './Layout';

export default function VehicleMaintenance({ lastChecklist }: { lastChecklist: Record<string, boolean> }) {
    return (
        <RiderLayout title="Vehicle Maintenance">
            <Head title="Vehicle Maintenance" />
        </RiderLayout>
    );
}
