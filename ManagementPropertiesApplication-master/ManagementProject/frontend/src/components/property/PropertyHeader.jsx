import { Star, MapPin, ShieldCheck } from 'lucide-react'

/**
 * Top section of PropertyDetail — title, rating, location meta row.
 */
export const PropertyHeader = ({ property }) => {
    return (
        <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-title leading-[1.15] tracking-tight">
                {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-[15px]">
                {/* Rating */}
                {property.averageRating ? (
                    <div className="flex items-center gap-1.5 font-bold text-title">
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <span>{property.averageRating.toFixed(1)}</span>
                        <span className="font-medium text-muted underline decoration-border-color underline-offset-4 cursor-pointer hover:text-brand transition-colors">
                            {property.reviewCount || 0} reviews
                        </span>
                    </div>
                ) : (
                    <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">New Listing</span>
                )}

                <Dot />

                {/* Location */}
                <div className="flex items-center gap-1.5 text-title font-medium">
                    <MapPin size={16} className="text-brand-500" />
                    <span className="underline underline-offset-4 decoration-border-color cursor-pointer hover:text-brand transition-colors">
                        {property.city}{property.country ? `, ${property.country}` : ''}
                    </span>
                </div>
                <Dot />
                
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[13px] font-bold ${property.agentVerified ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    <ShieldCheck size={14} className={property.agentVerified ? 'fill-blue-600/10' : 'text-slate-400'} />
                    <span>{property.agentVerified ? 'Verified' : 'Unverified'}</span>
                </div>

                {/* Property type pill */}
                {property.type && (
                    <div className="ml-auto hidden sm:flex items-center gap-2">
                        <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-surface border border-border-warm text-muted uppercase tracking-widest shadow-sm">
                            {property.type}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

const Dot = () => <span className="text-border-base select-none">·</span>