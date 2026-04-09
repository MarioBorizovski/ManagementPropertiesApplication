import { useState, useEffect } from 'react'
import { bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { Calendar } from 'lucide-react'
import { BookingCard } from '../components/booking/BookingCard'
import toast from 'react-hot-toast'

export default function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading]   = useState(true)

    const fetchBookings = async () => {
        try {
            const { data } = await bookingAPI.getMyBookings()
            setBookings(data.content)
        } catch {
            toast.error('Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchBookings() }, [])

    const handleAction = async (id, action) => {
        if (action === 'cancel') {
            if (!confirm('Cancel this booking?')) return
            try {
                await bookingAPI.cancel(id)
                toast.success('Booking cancelled')
                fetchBookings()
            } catch (err) {
                toast.error(err.response?.data?.message || 'Cannot cancel booking')
            }
        }
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-title tracking-tight mb-2">My Bookings</h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-muted font-medium">
                        <Calendar size={18} />
                        <p>Track all your luxury stays and property reservations</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 bg-surface/50 border border-border rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-brand-300 bg-transparent shadow-none">
                        <Calendar size={64} className="text-brand-300 mb-6 opacity-40 shrink-0" />
                        <h2 className="text-2xl font-bold text-title mb-2">No Bookings Yet</h2>
                        <p className="text-muted mb-8 max-w-sm">Explore our handpicked properties and start your next journey.</p>
                        <a href="/properties" className="btn-primary flex items-center gap-2">
                            Explore Properties
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(b => (
                            <BookingCard 
                                key={b.id} 
                                booking={b} 
                                onAction={handleAction} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}