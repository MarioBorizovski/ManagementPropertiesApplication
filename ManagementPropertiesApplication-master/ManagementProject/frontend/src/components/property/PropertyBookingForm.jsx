import { Calendar, Star, ChevronDown } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const PropertyBookingForm = ({ 
    property, 
    booking, 
    setBooking, 
    handleBooking, 
    submitting, 
    isUser, 
    isAdmin, 
    bookedRanges 
}) => {
    
    const parseDate = (str) => {
        const [y, m, d] = str.split('-').map(Number)
        return new Date(y, m - 1, d)
    }
    
    const formatLocalDate = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    const nights = booking.checkInDate && booking.checkOutDate
        ? Math.max(0, (parseDate(booking.checkOutDate) - parseDate(booking.checkInDate)) / 86400000)
        : 0

    const nightlyTotal = nights * property.pricePerNight
    const cleaningFee  = nightlyTotal > 0 ? 50 : 0
    const serviceFee   = nightlyTotal * 0.12
    const grandTotal   = nightlyTotal + cleaningFee + serviceFee

    const getBookedDates = () => {
        const dates = []
        bookedRanges.forEach(range => {
            const [sy, sm, sd] = range.checkIn.split('-').map(Number)
            const [ey, em, ed] = range.checkOut.split('-').map(Number)
            const current = new Date(sy, sm - 1, sd)
            const end     = new Date(ey, em - 1, ed)
            while (current < end) {
                dates.push(new Date(current))
                current.setDate(current.getDate() + 1)
            }
        })
        return dates
    }

    const getMaxCheckout = () => {
        if (!booking.checkInDate) return undefined
        const checkIn = parseDate(booking.checkInDate)
        const next = bookedRanges
            .map(r => parseDate(r.checkIn))
            .filter(d => d > checkIn)
            .sort((a, b) => a - b)[0]
        return next || undefined
    }

    if (!(isUser() || isAdmin()) || !property.available) {
        return (
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-2xl text-center space-y-4">
                <p className="text-gray-500 font-bold">
                    {!property.available
                        ? 'This property is currently unavailable.'
                        : 'Login to see pricing and availability.'}
                </p>
                {!isUser() && !isAdmin() && (
                    <button className="btn-primary w-full !rounded-xl">Log In</button>
                )}
            </div>
        )
    }

    return (
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-baseline mb-8">
                <div>
                    <span className="text-3xl font-black text-title tracking-tight">${property.pricePerNight}</span>
                    <span className="text-base text-muted ml-1.5 font-medium">night</span>
                </div>
                {property.reviewCount > 0 && (
                    <div className="flex items-center gap-1.5 text-sm font-bold text-title">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span>{property.averageRating?.toFixed(1)}</span>
                        <span className="text-muted font-medium hover:text-brand transition-colors cursor-pointer underline underline-offset-4 decoration-border-color">
                            {property.reviewCount} reviews
                        </span>
                    </div>
                )}
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
                {/* Unified Date Selection Box */}
                <div className="border border-border-color dark:border-border-color/50 rounded-2xl overflow-hidden bg-surface/50">
                    <div className="flex border-b border-border-color dark:border-border-color/50">
                        <div className="flex-1 p-4 border-r border-border-color dark:border-border-color/50 hover:bg-surface/80 transition-colors group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 mb-1 group-hover:text-brand transition-colors">Check-in</label>
                            <DatePicker
                                selected={booking.checkInDate ? new Date(booking.checkInDate) : null}
                                onChange={date => setBooking({
                                    ...booking,
                                    checkInDate: formatLocalDate(date),
                                    checkOutDate: ''
                                })}
                                excludeDates={getBookedDates()}
                                minDate={new Date()}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Add date"
                                className="w-full bg-transparent text-[15px] font-bold text-title placeholder:text-muted/40 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1 p-4 hover:bg-surface/80 transition-colors group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 mb-1 group-hover:text-brand transition-colors">Checkout</label>
                            <DatePicker
                                selected={booking.checkOutDate ? new Date(booking.checkOutDate) : null}
                                onChange={date => setBooking({
                                    ...booking,
                                    checkOutDate: formatLocalDate(date)
                                })}
                                excludeDates={getBookedDates()}
                                minDate={booking.checkInDate
                                    ? new Date(parseDate(booking.checkInDate).getTime() + 86400000)
                                    : new Date()}
                                maxDate={getMaxCheckout()}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Add date"
                                className="w-full bg-transparent text-[15px] font-bold text-title placeholder:text-muted/40 focus:outline-none"
                                disabled={!booking.checkInDate}
                                required
                            />
                        </div>
                    </div>
                    <div className="p-4 relative hover:bg-surface/80 transition-colors group">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 mb-1 group-hover:text-brand transition-colors">Guests</label>
                        <input 
                            type="number" 
                            className="w-full bg-transparent text-[15px] font-extrabold text-title focus:outline-none" 
                            min={1} 
                            max={property.maxGuests}
                            value={booking.guests}
                            onChange={e => setBooking({ ...booking, guests: e.target.value })} 
                            required 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-brand to-brand-700 text-white py-4 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-brand/20 active:scale-[0.98] transition-all disabled:opacity-50" 
                    disabled={submitting}
                >
                    <span className="relative z-10">{submitting ? 'Requesting...' : 'Reserve'}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                <p className="text-center text-xs font-bold text-muted/60 uppercase tracking-widest">
                    You won't be charged yet
                </p>

                {nights > 0 && (
                    <div className="space-y-4 mt-8 animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className="flex justify-between text-[15px] text-muted font-medium">
                            <span className="underline decoration-border-color underline-offset-4">${property.pricePerNight} × {nights} nights</span>
                            <span className="text-title font-bold">${nightlyTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[15px] text-muted font-medium">
                            <span className="underline decoration-border-color underline-offset-4">Cleaning fee</span>
                            <span className="text-title font-bold">${cleaningFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[15px] text-muted font-medium">
                            <span className="underline decoration-border-color underline-offset-4">Service fee</span>
                            <span className="text-title font-bold">${serviceFee.toFixed(2)}</span>
                        </div>
                        
                        <div className="pt-6 border-t border-border-warm flex justify-between items-center mt-6">
                            <span className="text-lg font-black text-title">Total</span>
                            <span className="text-2xl font-black text-title">${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
