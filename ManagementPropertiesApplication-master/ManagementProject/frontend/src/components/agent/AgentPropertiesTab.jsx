import { Info, Upload, ToggleLeft, ToggleRight, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'

export const AgentPropertiesTab = ({ 
    properties, 
    onView, 
    onImageUpload, 
    onFetchBookings, 
    onToggle, 
    onEdit, 
    onDelete 
}) => {
    if (properties.length === 0) {
        return <div className="text-center py-20 text-gray-400">No properties yet. Add one above!</div>
    }

    return (
        <div className="space-y-4">
            {properties.map(p => {
                const imageUrl = p.mainImageUrl
                    ? p.mainImageUrl.startsWith('http') ? p.mainImageUrl : `http://localhost:8080${p.mainImageUrl}`
                    : 'https://via.placeholder.com/80x80?text=No+Image'

                return (
                    <div key={p.id} className="card flex items-center gap-4">
                        <img src={imageUrl} alt={p.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-title">{p.title}</h3>
                                <Badge status={p.status} />
                            </div>
                            <p className="text-sm text-muted">
                                {p.city}, {p.country} · ${p.pricePerNight}/night · {p.type}
                            </p>
                            {!p.mainImageUrl && (
                                <p className="text-xs text-amber-500 mt-1">⚠ No image — click upload to add one</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => onView(p)} className="p-2 text-muted hover:bg-surface-hover rounded-lg transition-colors" title="View Property Details">
                                <Info size={16} />
                            </button>

                            <label className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors" title="Upload image">
                                <Upload size={16} />
                                <input type="file" accept="image/*" hidden onChange={(e) => onImageUpload(p.id, e.target.files[0])} />
                            </label>

                            <button onClick={() => onFetchBookings(p.id)} className="btn-secondary text-xs py-1 px-3">
                                Bookings
                            </button>

                            <button onClick={() => onToggle(p.id)} className={`p-2 rounded-lg transition-colors ${p.available ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-surface-hover'}`} title={p.available ? "Disable property" : "Enable property"}>
                                {p.available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                            </button>

                            <button onClick={() => onEdit(p)} className="p-2 text-[#9e6b4a] hover:bg-surface-hover rounded-lg transition-colors" title="Edit property">
                                <Pencil size={16} />
                            </button>

                            <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete property">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
