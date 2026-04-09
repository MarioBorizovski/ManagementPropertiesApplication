import { X, MapPin, BedDouble, Bath, Users, DollarSign, Star, Calendar, User, Building2, CheckCircle, XCircle } from 'lucide-react'

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs font-medium text-title">{value ?? '—'}</span>
    </div>
)

const ImageGallery = ({ images, mainImageUrl }) => {
    if (!images?.length && !mainImageUrl) {
        return (
            <div className="w-full h-52 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building2 size={32} className="text-gray-300" />
            </div>
        )
    }

    const all = images?.length ? images : [mainImageUrl]

    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
                <img
                    src={all[0]}
                    alt="main"
                    className="w-full h-48 object-cover rounded-xl"
                    onError={e => { e.target.style.display = 'none' }}
                />
            </div>
            <div className="flex flex-col gap-2">
                {all.slice(1, 3).map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`img-${i}`}
                        className="w-full h-[calc(50%-4px)] object-cover rounded-xl flex-1"
                        style={{ height: '92px' }}
                        onError={e => { e.target.style.display = 'none' }}
                    />
                ))}
                {all.length < 2 && (
                    <div className="flex-1 bg-gray-100 rounded-xl" style={{ height: '92px' }} />
                )}
            </div>
        </div>
    )
}

export default function PropertyDetailModal({ property, onClose, onApprove, onReject }) {
    if (!property) return null

    const handleApprove = async () => {
        await onApprove(property.id)
        onClose()
    }

    const handleReject = async () => {
        await onReject(property.id)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                Pending review
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {property.type}
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold text-title">{property.title}</h2>
                        <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
                            <MapPin size={13} /> {property.city}, {property.country}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-5">

                    {/* Images */}
                    <ImageGallery images={property.imageUrls} mainImageUrl={property.mainImageUrl} />

                    {/* Price + Rating */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-hover rounded-xl p-4 border border-border">
                            <p className="text-xs text-brand mb-1">Price per night</p>
                            <p className="text-2xl font-semibold text-[#3b2210]">${property.pricePerNight}</p>
                        </div>
                        <div className="bg-surface-hover rounded-xl p-4">
                            <p className="text-xs text-muted mb-1">Rating</p>
                            {property.averageRating ? (
                                <div className="flex items-baseline gap-1.5">
                                    <p className="text-2xl font-semibold text-title">{property.averageRating}</p>
                                    <Star size={14} className="text-yellow-400 fill-yellow-400 mb-0.5" />
                                    <p className="text-xs text-gray-400">({property.reviewCount})</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 mt-1">No reviews yet</p>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: BedDouble, label: 'Bedrooms',  value: property.bedrooms },
                            { icon: Bath,      label: 'Bathrooms', value: property.bathrooms },
                            { icon: Users,     label: 'Max guests', value: property.maxGuests },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-surface-hover rounded-xl p-3 flex flex-col items-center gap-1">
                                <Icon size={16} className="text-gray-400" />
                                <p className="text-lg font-semibold text-title">{value ?? '—'}</p>
                                <p className="text-xs text-muted">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    {property.description && (
                        <div>
                            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Description</p>
                            <p className="text-sm text-title leading-relaxed">{property.description}</p>
                        </div>
                    )}

                    {/* Details */}
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Property details</p>
                        <div className="bg-surface-hover rounded-xl px-4 py-1">
                            <InfoRow label="Address"     value={property.address} />
                            <InfoRow label="City"        value={property.city} />
                            <InfoRow label="Country"     value={property.country} />
                            <InfoRow label="Type"        value={property.type} />
                            <InfoRow label="Available"   value={property.available ? 'Yes' : 'No'} />
                            <InfoRow label="Listed on"   value={property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
                        </div>
                    </div>

                    {/* Agent */}
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Agent</p>
                        <div className="flex items-center gap-3 bg-surface-hover rounded-xl p-3">
                            <div className="w-9 h-9 rounded-full bg-border text-brand-hover text-sm font-medium flex items-center justify-center flex-shrink-0">
                                {property.agentName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-title">{property.agentName}</p>
                                <p className="text-xs text-muted">Agent ID #{property.agentId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-5 border-t border-gray-100">
                    <button
                        onClick={handleReject}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                    <button
                        onClick={handleApprove}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                </div>
            </div>
        </div>
    )
}