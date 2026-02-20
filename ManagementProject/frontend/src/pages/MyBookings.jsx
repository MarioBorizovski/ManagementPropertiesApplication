import { useState, useEffect } from 'react'
import { bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { Calendar, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const StatusBadge = ({ status }) => {
    const cls = {
        PENDING:   'badge-pending',
        CONFIRMED: 'badge-confirmed',
        CANCELLED: 'badge-cancelled',
        REJECTED:  'badge-rejected',
    }
    return <span className={cls[status] || 'badge-pending'}>{status}</span>
}

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

    const handleCancel = async (id) => {
        if (!confirm('Cancel this booking?')) return
        try {
            await bookingAPI.cancel(id)
            toast.success('Booking cancelled')
            fetchBookings()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot cancel booking')
        }
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                <p className="text-gray-500">Track all your property reservations</p>
            </div>

            {loading ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card animate-pulse h-32 bg-gray-100" />)}</div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Calendar size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => (
                        <div key={b.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-900">{b.propertyTitle}</h3>
                                    <StatusBadge status={b.status} />
                                </div>
                                <p className="flex items-center gap-1 text-sm text-gray-500 mb-1"><MapPin size={14} />{b.propertyCity}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar size={14} />{b.checkInDate} → {b.checkOutDate}</span>
                                    <span className="flex items-center gap-1"><Users size={14} />{b.guests} guests</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">${b.totalPrice?.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Total</p>
                                </div>
                                {b.status === 'PENDING' && (
                                    <button onClick={() => handleCancel(b.id)} className="btn-danger text-sm">Cancel</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}