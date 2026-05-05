import { Head, Link } from '@inertiajs/react';

const messages: Record<number, { title: string; description: string }> = {
    403: { title: 'Forbidden',     description: "You don't have permission to access this page." },
    404: { title: 'Not Found',     description: 'The page you are looking for does not exist.' },
    500: { title: 'Server Error',  description: 'Something went wrong on our end.' },
    503: { title: 'Unavailable',   description: 'The service is temporarily unavailable.' },
};

export default function Error({ status }: { status: number }) {
    const { title, description } = messages[status] ?? { title: 'Error', description: 'An unexpected error occurred.' };

    return (
        <>
            <Head title={`${status} ${title}`} />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-8">
                <p className="text-6xl font-bold text-gray-300">{status}</p>
                <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-gray-500">{description}</p>
                <Link href="/" className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Go Home
                </Link>
            </div>
        </>
    );
}
