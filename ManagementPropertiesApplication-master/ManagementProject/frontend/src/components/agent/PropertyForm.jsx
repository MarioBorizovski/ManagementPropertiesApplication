import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export const PropertyForm = ({ 
    form, 
    setForm, 
    editingProperty, 
    onSubmit, 
    onCancel,
    imagePreviews,
    onImageSelect,
    onRemoveImage
}) => {
    return (
        <div className="card mb-8">
            <h2 className="text-lg font-semibold mb-4">{editingProperty ? 'Edit Property' : 'New Property'}</h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-title mb-1">Title</label>
                    <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-title mb-1">Description</label>
                    <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-title mb-1">Address</label>
                    <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">City</label>
                    <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Country</label>
                    <input className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Type</label>
                    <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="APARTMENT">Apartment</option>
                        <option value="HOUSE">House</option>
                        <option value="VILLA">Villa</option>
                        <option value="OFFICE">Office</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Price/Night ($)</label>
                    <input type="number" className="input" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} required min={1} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Bedrooms</label>
                    <input type="number" className="input" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Bathrooms</label>
                    <input type="number" className="input" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-title mb-1">Max Guests</label>
                    <input type="number" className="input" value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: e.target.value })} min={1} />
                </div>


                {/* Image Upload section */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-title mb-2">Property Images</label>
                    <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-brand-200 rounded-lg px-4 py-4 hover:border-[#b8896a] hover:bg-surface-hover transition-colors w-full mb-3">
                        <Upload size={18} className="text-gray-400" />
                        <span className="text-sm text-muted">Click to add images (multiple allowed)</span>
                        <input type="file" accept="image/*" multiple hidden onChange={onImageSelect} />
                    </label>
                    {imagePreviews.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img src={src} className="w-20 h-20 object-cover rounded-lg" />
                                    {i === 0 && <span className="absolute top-1 left-1 bg-[#9e6b4a] text-white text-xs px-1 rounded">Main</span>}
                                    <button type="button" onClick={() => onRemoveImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs items-center justify-center hidden group-hover:flex">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" className="btn-primary">{editingProperty ? 'Update' : 'Create'} Property</button>
                    <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
