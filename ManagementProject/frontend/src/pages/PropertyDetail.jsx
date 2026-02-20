import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI, bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import { MapPin, BedDouble, Bath, Users, Calendar, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PropertyDetail() {
    const { id }              = useParams()
    const navigate            = useNavigate()
    const { isUser, isAdmin } = useAuth()
    const [property, setProperty]   = useState(null)
    const [loading, setLoading]     = useState(true)
    const [activeImage, setActiveImage] = useState(0)
    const [lightbox, setLightbox]   = useState(false)
    const [booking, setBooking]     = useState({ checkInDate: '', checkOutDate: '', guests: 1, specialRequests: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        propertyAPI.getById(id)
            .then(({ data }) => setProperty(data))
            .catch(() => toast.error('Property not found'))
            .finally(() => setLoading(false))
    }, [id])

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightbox) return
        const handler = (e) => {
            if (e.key === 'ArrowRight') nextImage()
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === 'Escape') setLightbox(false)
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [lightbox, activeImage, property])

    const images = property?.imageUrls || (property?.mainImageUrl ? [property.mainImageUrl] : [])

    const nextImage = () => setActiveImage(i => (i + 1) % images.length)
    const prevImage = () => setActiveImage(i => (i - 1 + images.length) % images.length)

    const nights = booking.checkInDate && booking.checkOutDate
        ? Math.max(0, (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 86400000)
        : 0

    const handleBooking = async (e) => {
        e.preventDefault()
        if (nights <= 0) return toast.error('Check-out must be after check-in')
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

    if (loading) return <Layout><div className="animate-pulse card h-96" /></Layout>
    if (!property) return <Layout><div className="text-center py-20 text-gray-400">Property not found.</div></Layout>

    return (
        <Layout>
            {/* Lightbox */}
            {lightbox && images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                     onClick={() => setLightbox(false)}>
                    <button onClick={() => setLightbox(false)}
                            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                        <X size={24} />
                    </button>
                    {images.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); prevImage() }}
                                    className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors">
                                <ChevronLeft size={28} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); nextImage() }}
                                    className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors">
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                    <img src={images[activeImage]} alt="Property"
                         className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
                         onClick={e => e.stopPropagation()} />
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImage(i) }}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? 'bg-white' : 'bg-white/40'}`} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft size={18} /> Back to properties
            </button>

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="mb-8">
                    {images.length === 1 ? (
                        // Single image
                        <div className="rounded-2xl overflow-hidden h-96 cursor-pointer"
                             onClick={() => setLightbox(true)}>
                            <img src={images[0]} alt={property.title}
                                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    ) : images.length === 2 ? (
                        // Two images side by side
                        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-96">
                            {images.slice(0, 2).map((url, i) => (
                                <div key={i} className="overflow-hidden cursor-pointer"
                                     onClick={() => { setActiveImage(i); setLightbox(true) }}>
                                    <img src={url} alt={`Image ${i + 1}`}
                                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // 3+ images: big main + grid of thumbnails
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-96">
                            {/* Main large image */}
                            <div className="col-span-2 row-span-2 overflow-hidden cursor-pointer relative group"
                                 onClick={() => { setActiveImage(0); setLightbox(true) }}>
                                <img src={images[0]} alt={property.title}
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            {/* Side thumbnails — show up to 4 */}
                            {images.slice(1, 5).map((url, i) => (
                                <div key={i} className="overflow-hidden cursor-pointer relative group"
                                     onClick={() => { setActiveImage(i + 1); setLightbox(true) }}>
                                    <img src={url} alt={`Image ${i + 2}`}
                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {/* Show +N overlay on last visible thumbnail if more images exist */}
                                    {i === 3 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">+{images.length - 5}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Thumbnail strip (shown when more than 3 images) */}
                    {images.length > 3 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                            {images.map((url, i) => (
                                <img key={i} src={url} alt={`Thumb ${i + 1}`}
                                     onClick={() => { setActiveImage(i); setLightbox(true) }}
                                     className={`w-16 h-12 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all duration-200 ${
                                         activeImage === i ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-60 hover:opacity-90'
                                     }`} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Property Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{property.type}</span>
                                <h1 className="text-2xl font-bold text-gray-900 mt-2">{property.title}</h1>
                                <p className="flex items-center gap-1 text-gray-500 mt-1">
                                    <MapPin size={15} /> {property.address}, {property.city}, {property.country}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">${property.pricePerNight}</p>
                                <p className="text-sm text-gray-400">per night</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 my-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BedDouble size={18} className="text-blue-500" /><span>{property.bedrooms} Bedrooms</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Bath size={18} className="text-blue-500" /><span>{property.bathrooms} Bathrooms</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users size={18} className="text-blue-500" /><span>Max {property.maxGuests} guests</span>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        <p className="text-sm text-gray-400 mt-4">
                            Listed by: <span className="font-medium text-gray-600">{property.agentName}</span>
                        </p>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-1">
                    {(isUser() || isAdmin()) && property.available ? (
                        <div className="card sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-blue-500" /> Book This Property
                            </h2>
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                    <input type="date" className="input" value={booking.checkInDate}
                                           min={new Date().toISOString().split('T')[0]}
                                           onChange={e => setBooking({ ...booking, checkInDate: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                    <input type="date" className="input" value={booking.checkOutDate}
                                           min={booking.checkInDate || new Date().toISOString().split('T')[0]}
                                           onChange={e => setBooking({ ...booking, checkOutDate: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                    <input type="number" className="input" min={1} max={property.maxGuests}
                                           value={booking.guests}
                                           onChange={e => setBooking({ ...booking, guests: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                    <textarea className="input" rows={3} placeholder="Any special requests..."
                                              value={booking.specialRequests}
                                              onChange={e => setBooking({ ...booking, specialRequests: e.target.value })} />
                                </div>

                                {nights > 0 && (
                                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>{nights} nights × ${property.pricePerNight}</span>
                                            <span>${(nights * property.pricePerNight).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-900 mt-1 pt-1 border-t border-blue-200">
                                            <span>Total</span>
                                            <span>${(nights * property.pricePerNight).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn-primary w-full" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Request Booking'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="card text-center text-gray-400 py-8">
                            {!property.available
                                ? 'This property is currently unavailable.'
                                : 'Login as a user to book this property.'}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}