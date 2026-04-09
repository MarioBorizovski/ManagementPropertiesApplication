import { Eye, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../api/services'
import toast from 'react-hot-toast'

export const PropertyManagementTab = ({ 
    properties, 
    pending, 
    page, 
    totalPages, 
    onPageChange,
    onSelectProperty,
    onApprove,
    onReject 
}) => {
    const navigate = useNavigate()
    const thCls = 'text-left px-4 py-2.5 text-xs font-medium text-muted bg-surface-hover border-b border-gray-100'
    const tdCls = 'px-4 py-3 text-sm text-title'
    const trCls = 'border-b border-gray-50 hover:bg-surface-hover transition-colors bg-surface'

    const handleGeocodeAll = async () => {
        const tid = toast.loading('Geocoding all properties via Google Maps...')
        try {
            const { data } = await propertyAPI.geocodeAll()
            toast.success(data, { id: tid })
        } catch {
            toast.error('Geocoding failed. Check your API key.', { id: tid })
        }
    }

    return (
        <div className="space-y-5">
            {/* All Properties */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-surface">
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-surface">
                    <span className="text-sm font-medium text-title">All properties</span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleGeocodeAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95 border border-slate-600"
                            title="Geocode all properties missing lat/lng using Google Maps API"
                        >
                            <MapPin size={14} /> Fix Map Locations
                        </button>
                        <button 
                            onClick={() => navigate('/property/new')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-hover transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={14} /> Post Property
                        </button>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            {['Title', 'City', 'Type', 'Price/night', 'Agent', 'Status', 'Available'].map(h => (
                                <th key={h} className={thCls}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {properties.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No properties found</td></tr>
                        )}
                        {properties.map(p => (
                            <tr key={p.id} className={trCls}>
                                <td className={`${tdCls} font-medium`}>{p.title}</td>
                                <td className={`${tdCls} text-muted`}>{p.city}</td>
                                <td className={`${tdCls} text-muted`}>{p.type}</td>
                                <td className={`${tdCls} font-medium`}>${p.pricePerNight}</td>
                                <td className={`${tdCls} text-muted`}>{p.agentName}</td>
                                <td className={tdCls}><Badge status={p.status} /></td>
                                <td className={tdCls}><Badge status={p.available ? 'active' : 'inactive'} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pending Approvals */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-surface">
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-surface">
                    <span className="text-sm font-medium text-title">Pending review</span>
                    {pending.length > 0 && (
                        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                            {pending.length} awaiting
                        </span>
                    )}
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            {['Title', 'City', 'Agent', 'Price/night', 'Status', 'Actions'].map(h => (
                                <th key={h} className={thCls}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pending.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No pending properties</td></tr>
                        )}
                        {pending.map(p => (
                            <tr
                                key={p.id}
                                className={`${trCls} cursor-pointer hover:bg-surface-hover transition-colors`}
                                onClick={() => onSelectProperty(p)}
                            >
                                <td className={`${tdCls} font-medium`}>
                                    <div className="flex items-center gap-2">
                                        {p.mainImageUrl ? (
                                            <img src={p.mainImageUrl} alt={p.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                                        )}
                                        {p.title}
                                    </div>
                                </td>
                                <td className={`${tdCls} text-muted`}>{p.city}</td>
                                <td className={`${tdCls} text-muted`}>{p.agentName}</td>
                                <td className={`${tdCls} font-medium`}>${p.pricePerNight}</td>
                                <td className={tdCls}><Badge status={p.status} /></td>
                                <td className={tdCls} onClick={e => e.stopPropagation()}>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelectProperty(p)}
                                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1 border border-border"
                                        >
                                            <Eye size={12} /> Review
                                        </button>
                                        <button
                                            onClick={() => onApprove(p.id)}
                                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => onReject(p.id)}
                                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-surface">
                    <button 
                        disabled={page === 0} 
                        onClick={() => onPageChange(page - 1)} 
                        className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:opacity-35 hover:text-title transition-colors"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <span className="text-xs text-muted">Page {page + 1} of {totalPages || 1}</span>
                    <button 
                        disabled={page + 1 >= totalPages} 
                        onClick={() => onPageChange(page + 1)} 
                        className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:opacity-35 hover:text-title transition-colors"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
