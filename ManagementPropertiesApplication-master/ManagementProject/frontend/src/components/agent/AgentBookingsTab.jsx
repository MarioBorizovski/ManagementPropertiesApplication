import { BookingCard } from '../booking/BookingCard'

export const AgentBookingsTab = ({ 
    bookings, 
    expandedBooking, 
    onToggleExpand, 
    onBookingAction 
}) => {
    if (bookings.length === 0) {
        return (
            <div className="card flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-brand-300 bg-transparent shadow-none">
                <p className="text-muted font-medium italic">No bookings received for your properties yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {bookings.map(b => (
                <BookingCard 
                    key={b.id} 
                    booking={b} 
                    isAgent={true}
                    onAction={onBookingAction}
                />
            ))}
        </div>
    )
}
