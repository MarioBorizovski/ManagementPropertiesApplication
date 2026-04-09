import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ExternalLink, MessageSquare, DollarSign } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const cls = {
        PENDING:   'bg-amber-100 text-amber-800 border-amber-200',
        CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200',
        REJECTED:  'bg-gray-100 text-gray-600 border-border',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls[status] || 'bg-amber-100 text-amber-800'}`}>
            {status}
        </span>
    );
};

export const BookingCard = ({ booking: b, onAction, isAgent = false }) => {
    const imgSrc = b.mainImageUrl
        ? (b.mainImageUrl.startsWith('http') ? b.mainImageUrl : `http://localhost:8080${b.mainImageUrl}`)
        : null;

    return (
        <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
            <div className="flex flex-col md:flex-row">
                {/* Property Image / Thumbnail Section */}
                <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden bg-background">
                    {imgSrc ? (
                        <img 
                            src={imgSrc} 
                            alt={b.propertyTitle} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-300">
                            <MapPin size={32} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[#000]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link 
                            to={`/properties/${b.propertyId}`}
                            className="bg-brand text-white text-[11px] font-black px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 scale-95 group-hover:scale-100"
                        >
                            View Property <ExternalLink size={14} />
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 md:p-6">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Link 
                                        to={`/properties/${b.propertyId}`}
                                        className="text-lg font-bold text-title hover:text-brand transition-colors"
                                    >
                                        {b.propertyTitle}
                                    </Link>
                                    <StatusBadge status={b.status} />
                                </div>
                                <p className="flex items-center gap-1.5 text-sm text-muted font-medium">
                                    <MapPin size={14} /> {b.propertyCity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-brand">${b.totalPrice?.toFixed(2)}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-background p-2.5 rounded-xl border border-border">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dates</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-title">
                                    <Calendar size={14} className="text-brand" />
                                    <span>{b.checkInDate} → {b.checkOutDate}</span>
                                </div>
                            </div>
                            <div className="bg-background p-2.5 rounded-xl border border-border">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-title">
                                    <Users size={14} className="text-brand" />
                                    <span>{b.guests} Guests</span>
                                </div>
                            </div>
                            <div className="bg-background p-2.5 rounded-xl border border-border col-span-2 sm:col-span-1">
                                {isAgent ? (
                                    <>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Booked By</p>
                                        <p className="text-xs font-bold text-title truncate">{b.userName}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Managed By</p>
                                        <Link 
                                            to={b.agentId ? `/profile/${b.agentId}` : '#'}
                                            className={`text-xs font-bold truncate block ${b.agentName ? 'text-brand hover:underline' : 'text-gray-400 italic font-normal'}`}
                                        >
                                            {b.agentName || 'Agent Info Unavailable'}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {b.specialRequests && (
                            <div className="flex items-start gap-2 bg-surface-hover p-3 rounded-xl border border-dashed border-brand-300 mb-6">
                                <MessageSquare size={14} className="text-muted mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-brand leading-relaxed italic">
                                    "{b.specialRequests}"
                                </p>
                            </div>
                        )}

                        {/* Actions Area */}
                        <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-border">
                            {b.status === 'CONFIRMED' && !isAgent && (
                                <Link 
                                    to={`/properties/${b.propertyId}`}
                                    className="px-4 py-2 text-xs font-bold text-brand hover:bg-brand-50 rounded-xl transition-colors border border-brand-100 flex items-center gap-2"
                                >
                                    <MessageSquare size={14} /> Write Review
                                </Link>
                            )}
                            {!isAgent && b.status === 'PENDING' && (
                                <button 
                                    onClick={() => onAction(b.id, 'cancel')}
                                    className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                                >
                                    Cancel Booking
                                </button>
                            )}
                            {isAgent && b.status === 'PENDING' && (
                                <>
                                    <button 
                                        onClick={() => onAction(b.id, 'reject')}
                                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:bg-gray-100 rounded-xl transition-colors border border-border"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => onAction(b.id, 'confirm')}
                                        className="px-4 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-md shadow-brand/10"
                                    >
                                        Confirm Booking
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
