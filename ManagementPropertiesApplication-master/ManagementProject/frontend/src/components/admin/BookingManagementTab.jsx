import { Trash2, Check, X, Eye } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { toast } from 'react-hot-toast'

export const BookingManagementTab = ({ bookings, onDeleteBooking, onConfirmBooking, onRejectBooking, onViewBooking }) => {
    const thCls = 'text-left px-4 py-2.5 text-xs font-medium text-muted bg-surface-hover border-b border-gray-100'
    const tdCls = 'px-4 py-3 text-sm text-title'
    const trCls = 'border-b border-gray-50 hover:bg-surface-hover transition-colors'

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-surface">
            <table className="w-full">
                <thead>
                    <tr>
                        {['Property', 'User', 'Dates', 'Guests', 'Total', 'Status', 'Actions'].map(h => (
                            <th key={h} className={thCls}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No bookings found</td></tr>
                    )}
                    {bookings.map(b => (
                        <tr key={b.id} className={trCls}>
                            <td className={`${tdCls} font-medium`}>{b.propertyTitle}</td>
                            <td className={`${tdCls} text-muted`}>{b.userName}</td>
                            <td className={`${tdCls} text-muted whitespace-nowrap`}>{b.checkInDate} → {b.checkOutDate}</td>
                            <td className={`${tdCls} text-muted`}>{b.guests}</td>
                            <td className={`${tdCls} font-medium`}>${b.totalPrice?.toFixed(2)}</td>
                            <td className={tdCls}><Badge status={b.status} /></td>
                            <td className={tdCls}>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => onViewBooking(b.id)} 
                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                        title="View details"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    {b.status === 'PENDING' && (
                                        <>
                                            <button 
                                                onClick={() => onConfirmBooking(b.id)} 
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                title="Confirm booking"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button 
                                                onClick={() => onRejectBooking(b.id)} 
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                title="Reject booking"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        onClick={() => onDeleteBooking(b.id)} 
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 transition-colors" 
                                        title="Delete booking"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
