import React from 'react';
import { MapPin, BedDouble, Users, Star, Building2 } from 'lucide-react';
import { resolveImageUrl, formatCurrency } from '../../utils/formatters';

/**
 * A compact property card used in profiles and listings.
 */
export const PropertyMiniCard = ({ property: p, onClick }) => {
    const imgSrc = resolveImageUrl(p.mainImageUrl);
    const showStars = p.reviewCount > 0 && p.averageRating;

    return (
        <div onClick={onClick}
             className="group relative bg-surface border border-border-warm rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300 cursor-pointer">
            <div className="aspect-[16/10] overflow-hidden relative">
                {imgSrc ? (
                    <img src={imgSrc} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-950 text-brand-200">
                        <Building2 size={32} />
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-brand dark:text-brand-300 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm border border-brand-100 dark:border-white/10 uppercase tracking-wider">
                        {p.type}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-title truncate flex-1 group-hover:text-brand transition-colors">{p.title}</h3>
                    <div className="text-right">
                        <p className="text-sm font-black text-brand">{formatCurrency(p.pricePerNight)}</p>
                        <p className="text-[10px] text-muted font-bold mt-[-2px]">per night</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-muted mb-4">
                    <MapPin size={12} className="text-brand/40" />
                    <span className="truncate">{p.city}, {p.country}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-warm">
                    <div className="flex items-center gap-3 text-[11px] text-muted font-bold">
                        <span className="flex items-center gap-1"><BedDouble size={14} className="text-brand/40" /> {p.bedrooms}</span>
                        <span className="flex items-center gap-1"><Users size={14} className="text-brand/40" /> {p.maxGuests}</span>
                    </div>

                    {showStars ? (
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/30">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{p.averageRating}</span>
                            <span className="text-[10px] text-amber-600/60 dark:text-amber-500/50 font-medium">({p.reviewCount})</span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-muted font-bold italic opacity-40">
                            {p.reviewCount === 1 ? 'New Listing' : 'No reviews'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
