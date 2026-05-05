import { Head, router } from '@inertiajs/react';
import SellerLayout from '@/layouts/SellerLayout';

interface Review {
    id: number; rating: number; comment?: string; approved: boolean;
    product?: { name: string }; user?: { name: string }; created_at: string;
}
interface Props {
    reviews: { data: Review[]; links: any[]; meta: any };
    stats: { avg: number; total: number };
}

const M = { fontFamily: "'DM Mono', monospace" };
const S = { fontFamily: "'DM Serif Display', serif" };

const Stars = ({ rating }: { rating: number }) => (
    <span style={{ color: '#f59e0b', fontSize: 14 }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
);

export default function ReviewsIndex({ reviews, stats }: Props) {
    const filterByRating = (r: number | '') => {
        router.get(route('seller.reviews.index'), r !== '' ? { rating: r } : {}, { preserveScroll: true, replace: true });
    };

    return (
        <SellerLayout breadcrumb="Reviews">
            <Head title="Reviews" />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ ...S, fontSize: 26, letterSpacing: '-0.5px', marginBottom: 4 }}>Reviews</div>
                    <div style={{ ...M, fontSize: 13, color: '#b0afa8' }}>Customer feedback on your products</div>
                </div>
                <div style={{ border: '1px solid #e8e8e4', padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ ...S, fontSize: 32 }}>{stats.avg ? stats.avg.toFixed(1) : '—'}</div>
                    <Stars rating={Math.round(stats.avg ?? 0)} />
                    <div style={{ ...M, fontSize: 11, color: '#b0afa8', marginTop: 4 }}>{stats.total} reviews</div>
                </div>
            </div>

            {/* Rating filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <button onClick={() => filterByRating('')}
                    style={{ padding: '6px 14px', border: '1px solid #e8e8e4', background: '#fff', fontSize: 12, ...M, cursor: 'pointer' }}>All</button>
                {[5, 4, 3, 2, 1].map(r => (
                    <button key={r} onClick={() => filterByRating(r)}
                        style={{ padding: '6px 14px', border: '1px solid #e8e8e4', background: '#fff', fontSize: 12, ...M, cursor: 'pointer' }}>
                        {'★'.repeat(r)} {r}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.data.length === 0 ? (
                    <div style={{ border: '2px dashed #e8e8e4', padding: '60px 0', textAlign: 'center', color: '#b0afa8', fontSize: 13 }}>No reviews found.</div>
                ) : reviews.data.map((review) => (
                    <div key={review.id} style={{ border: '1px solid #e8e8e4', padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                            <div>
                                <Stars rating={review.rating} />
                                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{review.user?.name ?? 'Anonymous'}</div>
                                <div style={{ ...M, fontSize: 11, color: '#b0afa8' }}>on {review.product?.name ?? '—'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ ...M, fontSize: 11, color: '#b0afa8' }}>{new Date(review.created_at).toLocaleDateString()}</div>
                                <span style={{ ...M, fontSize: 10, textTransform: 'uppercase', padding: '2px 8px', background: review.approved ? '#f0fdf4' : '#fef9c3', color: review.approved ? '#16a34a' : '#ca8a04', border: `1px solid ${review.approved ? '#bbf7d0' : '#fde68a'}` }}>
                                    {review.approved ? 'Approved' : 'Pending'}
                                </span>
                            </div>
                        </div>
                        {review.comment && (
                            <p style={{ fontSize: 13, color: '#6e6d67', lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
                        )}
                    </div>
                ))}
            </div>

            {reviews.meta?.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 20 }}>
                    {reviews.links.map((link: any, i: number) =>
                        link.url ? (
                            <a key={i} href={link.url}
                                style={{ padding: '5px 10px', border: '1px solid #e8e8e4', fontSize: 12, ...M, background: link.active ? '#0d0d0d' : '#fff', color: link.active ? '#fff' : '#6e6d67', textDecoration: 'none', marginLeft: -1 }}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={i} style={{ padding: '5px 10px', border: '1px solid #e8e8e4', fontSize: 12, ...M, color: '#e8e8e4', marginLeft: -1 }}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    )}
                </div>
            )}
        </SellerLayout>
    );
}
