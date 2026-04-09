import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI, bookingAPI, reviewAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { ArrowLeft, Share2, Heart, MapPin, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

import { PropertyGallery }     from '../components/property/PropertyGallery'
import { PropertyMap }         from '../components/property/PropertyMap'
import { PropertyReviews }     from '../components/property/PropertyReviews'
import { PropertyBookingForm } from '../components/property/PropertyBookingForm'
import { PropertyHeader }      from '../components/property/PropertyHeader'
import { PropertyFeatures }    from '../components/property/PropertyFeatures'
import { PropertyAgentCard }   from '../components/property/PropertyAgentCard'

export default function PropertyDetail() {
    const { id }                    = useParams()
    const navigate                  = useNavigate()
    const { isUser, isAdmin, user } = useAuth()
    const { setActiveChat, loadHistory, setIsLauncherOpen } = useChat()
    
    const handleOpenChat = () => {
        if (!user) return toast.error('Please login to message agents')
        if (user.userId === property.agentId) return toast.error('You cannot message yourself')
        
        const roomId = [Math.min(user.userId, property.agentId), Math.max(user.userId, property.agentId)].join('_')
        setActiveChat({
            roomId,
            recipientId: property.agentId,
            recipientName: property.agentName
        })
        loadHistory(user.userId, property.agentId)
        setIsLauncherOpen(true)
    }

    const [property, setProperty]               = useState(null)
    const [loading, setLoading]                 = useState(true)
    const [booking, setBooking]                 = useState({ checkInDate: '', checkOutDate: '', guests: 1, specialRequests: '' })
    const [submitting, setSubmitting]           = useState(false)
    const [reviews, setReviews]                 = useState([])
    const [reviewMeta, setReviewMeta]           = useState({ totalElements: 0, totalPages: 0 })
    const [reviewPage, setReviewPage]           = useState(0)
    const [canReview, setCanReview]             = useState(false)
    const [reviewReason, setReviewReason]       = useState('OK')
    const [newReview, setNewReview]             = useState({ rating: 5, comment: '' })
    const [submittingReview, setSubmittingReview] = useState(false)
    const [bookedRanges, setBookedRanges]       = useState([])

    // ─── Data fetching ────────────────────────────────────────────────────────

    const fetchProperty = () => {
        propertyAPI.getById(id)
            .then(({ data }) => setProperty(data))
            .catch(() => toast.error('Property not found'))
    }

    useEffect(() => {
        setLoading(true)
        propertyAPI.getById(id)
            .then(({ data }) => setProperty(data))
            .catch(() => toast.error('Property not found'))
            .finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        if (!id) return
        reviewAPI.getByProperty(id, { page: reviewPage, size: 5 })
            .then(({ data }) => {
                setReviews(data.content)
                setReviewMeta({ totalElements: data.totalElements, totalPages: data.totalPages })
            })
            .catch(() => {})
    }, [id, reviewPage])

    useEffect(() => {
        if (!user) {
            setCanReview(false)
            setReviewReason('NOT_LOGGED_IN')
            return
        }
        reviewAPI.canReview(id)
            .then(({ data }) => {
                setCanReview(data.canReview)
                setReviewReason(data.reason)
            })
            .catch(() => {
                setCanReview(false)
                setReviewReason('ERROR')
            })
    }, [id, user])

    useEffect(() => {
        if (!id) return
        bookingAPI.getBookedDates(id)
            .then(({ data }) => setBookedRanges(data))
            .catch(() => {})
    }, [id])

    // ─── Date helpers ─────────────────────────────────────────────────────────

    const parseDate = (str) => {
        const [y, m, d] = str.split('-').map(Number)
        return new Date(y, m - 1, d)
    }

    const isRangeBlocked = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return false
        const start = parseDate(checkIn)
        const end   = parseDate(checkOut)
        return bookedRanges.some(range => {
            const bookedStart = parseDate(range.checkIn)
            const bookedEnd   = parseDate(range.checkOut)
            return bookedStart < end && bookedEnd > start
        })
    }

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleBooking = async (e) => {
        e.preventDefault()
        const nights = booking.checkInDate && booking.checkOutDate
            ? Math.max(0, (parseDate(booking.checkOutDate) - parseDate(booking.checkInDate)) / 86400000)
            : 0
        if (nights <= 0)
            return toast.error('Check-out must be after check-in')
        if (isRangeBlocked(booking.checkInDate, booking.checkOutDate))
            return toast.error('Your selected dates overlap a booked period')

        setSubmitting(true)
        try {
            await bookingAPI.create({ propertyId: Number(id), ...booking, guests: Number(booking.guests) })
            toast.success('Booking submitted! Awaiting confirmation.')
            navigate('/my-bookings')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        setSubmittingReview(true)
        try {
            await reviewAPI.create({ propertyId: Number(id), ...newReview })
            toast.success('Review submitted!')
            setCanReview(false)
            setNewReview({ rating: 5, comment: '' })
            const { data } = await reviewAPI.getByProperty(id, { page: 0, size: 5 })
            setReviews(data.content)
            setReviewMeta({ totalElements: data.totalElements, totalPages: data.totalPages })
            setReviewPage(0)
            fetchProperty()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmittingReview(false)
        }
    }

    // ─── Render guards ────────────────────────────────────────────────────────

    if (loading) return (
        <Layout>
            <div className="animate-pulse space-y-5 mt-8">
                <div className="h-7 bg-brand-100 rounded-lg w-1/3" />
                <div className="h-[420px] bg-brand-100 rounded-2xl" />
                <div className="h-5 bg-brand-100 rounded w-2/3" />
                <div className="h-5 bg-brand-100 rounded w-1/2" />
            </div>
        </Layout>
    )

    if (!property) return (
        <Layout>
            <div className="text-center py-32 text-muted">Property not found.</div>
        </Layout>
    )

    // ─── Main render ──────────────────────────────────────────────────────────

    return (
        <Layout>
            <style>{`
                .react-datepicker-wrapper { width: 100%; }
                .react-datepicker__input-container { width: 100%; }
                .react-datepicker-popper { z-index: 9999 !important; }
                .react-datepicker__day--excluded {
                    background-color: #fee2e2 !important;
                    color: #ef4444 !important;
                    text-decoration: line-through;
                    border-radius: 4px;
                }
                /* Fading ornamental divider */
                .pd-divider {
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--border-warm, #f5ede3) 15%, var(--border-warm, #f5ede3) 85%, transparent);
                }
                .section-entry {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* ── Top navigation ── */}
            <div className="flex items-center justify-between mb-8 section-entry" style={{ animationDelay: '0.1s' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2.5 text-sm font-bold text-muted hover:text-title transition-all group"
                >
                    <span className="w-10 h-10 rounded-full border border-border-color bg-surface flex items-center justify-center group-hover:border-brand-300 group-hover:bg-brand-50 transition-all">
                        <ArrowLeft size={16} />
                    </span>
                    Back
                </button>

                <div className="flex items-center gap-3">
                    {user?.userId === property.agentId && (
                        <button
                            onClick={() => navigate(`/property/${property.id}/edit`)}
                            className="px-6 py-2.5 bg-surface border-2 border-border-color text-title text-sm font-bold rounded-xl hover:bg-brand-50 hover:border-brand-300 transition-all"
                        >
                            Edit Listing
                        </button>
                    )}
                </div>
            </div>

            {/* ── Header ── */}
            <div className="mb-8 section-entry" style={{ animationDelay: '0.2s' }}>
                <PropertyHeader property={property} />
            </div>

            {/* ── Gallery ── */}
            <div className="section-entry" style={{ animationDelay: '0.3s' }}>
                <PropertyGallery property={property} />
            </div>

            {/* ── Two-column body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">

                {/* ── Left column ── */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-12 section-entry" style={{ animationDelay: '0.4s' }}>

                    {/* Bundle 1: Content & Highlights */}
                    <div className="bg-surface p-8 rounded-[32px] border border-border-warm shadow-sm space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-title tracking-tight mb-4">
                                About this space
                            </h2>
                            <p className="text-[17px] text-gray-600 dark:text-gray-400 leading-[1.8] whitespace-pre-wrap font-medium">
                                {property.description}
                            </p>
                        </div>
                        
                        <div className="pt-8 border-t border-border-warm/50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted/60 mb-6">What this place offers</h3>
                            <PropertyFeatures
                                bedrooms={property.bedrooms}
                                bathrooms={property.bathrooms}
                                maxGuests={property.maxGuests}
                            />
                        </div>
                    </div>

                    {/* Bundle 2: Trust Card */}
                    <div className="section-entry" style={{ animationDelay: '0.45s' }}>
                        <PropertyAgentCard
                            agentId={property.agentId}
                            agentName={property.agentName}
                            agentVerified={property.agentVerified}
                            showMessageButton={user && user.userId !== property.agentId}
                            onMessageClick={handleOpenChat}
                        />
                    </div>

                    {/* Reviews - Refined Layout */}
                    <div className="bg-surface rounded-[32px] border border-border-warm shadow-sm overflow-hidden">
                        <div className="p-8 md:p-12">
                            <PropertyReviews
                                property={property}
                                reviews={reviews}
                                reviewMeta={reviewMeta}
                                reviewPage={reviewPage}
                                setReviewPage={setReviewPage}
                                canReview={canReview}
                                reviewReason={reviewReason}
                                newReview={newReview}
                                setNewReview={setNewReview}
                                submittingReview={submittingReview}
                                handleReviewSubmit={handleReviewSubmit}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Right column: booking form & Map ── */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-8 section-entry" style={{ animationDelay: '0.5s' }}>
                    <PropertyBookingForm
                        property={property}
                        booking={booking}
                        setBooking={setBooking}
                        handleBooking={handleBooking}
                        submitting={submitting}
                        isUser={isUser}
                        isAdmin={isAdmin}
                        bookedRanges={bookedRanges}
                    />

                    {/* Map moved under booking form */}
                    <div className="bg-surface rounded-[32px] border border-border-warm shadow-sm overflow-hidden">
                        <PropertyMap property={property} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}