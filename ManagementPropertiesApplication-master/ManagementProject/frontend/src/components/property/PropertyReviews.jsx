import { Star } from 'lucide-react'

const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button"
                    onClick={() => onChange && onChange(star)}
                    className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}>
                <Star size={20} className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-border'} />
            </button>
        ))}
    </div>
)

export const PropertyReviews = ({
    property,
    reviews,
    reviewMeta,
    reviewPage,
    setReviewPage,
    canReview,
    reviewReason,
    newReview,
    setNewReview,
    submittingReview,
    handleReviewSubmit
}) => {
    return (
        <div className="card">
            <div className="mb-8 border-b border-border-warm/50 pb-6">
                <h2 className="text-xl font-black text-title tracking-tight">
                    Guest Reviews
                    {property.reviewCount > 0 && (
                        <span className="ml-3 px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 text-sm font-bold">
                            {property.reviewCount}
                        </span>
                    )}
                </h2>
            </div>

            {canReview ? (
                <form onSubmit={handleReviewSubmit}
                        className="mb-10 p-6 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <p className="text-sm font-bold text-brand uppercase tracking-wider">Leave a review</p>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-muted uppercase tracking-widest mb-2">Rating</label>
                        <StarRating value={newReview.rating}
                                    onChange={r => setNewReview({ ...newReview, rating: r })} />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-muted uppercase tracking-widest mb-2">Your Experience</label>
                        <textarea className="input bg-white" rows={3} placeholder="Tell others about your stay..."
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            ) : reviewReason === 'ALREADY_REVIEWED' ? (
                <div className="mb-10 p-6 bg-surface border border-border rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-title">Review Submitted</h3>
                        <p className="text-sm text-muted">You have already shared your thoughts on this property. Thank you!</p>
                    </div>
                </div>
            ) : reviewReason === 'NO_BOOKING' ? (
                <div className="mb-10 p-6 bg-surface border border-border border-dashed rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <Star size={24} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-title">Write a Review</h3>
                        <p className="text-sm text-muted">Only guests with a confirmed booking can leave a review.</p>
                    </div>
                </div>
            ) : null}

            {reviews.length === 0 ? (
                <p className="text-muted text-sm text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="group pb-8 mb-8 border-b border-border-warm/30 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-title leading-tight">
                                            {review.userName}
                                        </span>
                                        <span className="text-[11px] font-bold text-muted uppercase tracking-widest mt-0.5">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <StarRating value={review.rating} />
                            </div>
                            {review.comment && (
                                <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl italic pl-14">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {reviewMeta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button className="btn-secondary text-sm" disabled={reviewPage === 0}
                            onClick={() => setReviewPage(p => p - 1)}>Previous</button>
                    <span className="text-sm text-muted self-center">
                        Page {reviewPage + 1} of {reviewMeta.totalPages}
                    </span>
                    <button className="btn-secondary text-sm"
                            disabled={reviewPage >= reviewMeta.totalPages - 1}
                            onClick={() => setReviewPage(p => p + 1)}>Next</button>
                </div>
            )}
        </div>
    )
}
