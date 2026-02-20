import { useState, useEffect } from 'react'
import { propertyAPI, bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, CheckCircle, XCircle, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AgentDashboard() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [bookings, setBookings]     = useState([])
    const [loading, setLoading]       = useState(true)
    const [activeTab, setActiveTab]   = useState('properties')
    const [showForm, setShowForm]     = useState(false)
    const [editingProperty, setEditingProperty] = useState(null)
    const [form, setForm] = useState({ title: '', description: '', address: '', city: '', country: '', type: 'APARTMENT', pricePerNight: '', bedrooms: '', bathrooms: '', maxGuests: '', available: true })
    const [imageFile, setImageFile] = useState(null)
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const fetchData = async () => {
        try {
            const [propRes] = await Promise.all([propertyAPI.getMyListings()])
            setProperties(propRes.data.content)
        } catch {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const fetchBookingsForProperty = async (propertyId) => {
        try {
            const { data } = await bookingAPI.getByProperty(propertyId)
            setBookings(data.content)
            setActiveTab('bookings')
        } catch {
            toast.error('Failed to load bookings')
        }
    }
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files)
        setImageFiles(prev => [...prev, ...files])
        const previews = files.map(f => URL.createObjectURL(f))
        setImagePreviews(prev => [...prev, ...previews])
    }

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...form, pricePerNight: Number(form.pricePerNight), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), maxGuests: Number(form.maxGuests) }
            let savedProperty
            if (editingProperty) {
                const { data } = await propertyAPI.update(editingProperty.id, payload)
                savedProperty = data
                toast.success('Property updated!')
            } else {
                const { data } = await propertyAPI.create(payload)
                savedProperty = data
                toast.success('Property created!')
            }
            // Upload image if selected
            if (imageFiles.length > 0) {
                await propertyAPI.uploadImages(savedProperty.id, imageFiles)
                setImageFiles([])
                setImagePreviews([])
            }
            setShowForm(false)
            setEditingProperty(null)
            setForm({ title: '', description: '', address: '', city: '', country: '', type: 'APARTMENT', pricePerNight: '', bedrooms: '', bathrooms: '', maxGuests: '', available: true })
            fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save property')
        }
    }

    const handleEdit = (p) => {
        setEditingProperty(p)
        setForm({ title: p.title, description: p.description || '', address: p.address, city: p.city, country: p.country, type: p.type, pricePerNight: p.pricePerNight, bedrooms: p.bedrooms, bathrooms: p.bathrooms, maxGuests: p.maxGuests, available: p.available })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this property?')) return
        try {
            await propertyAPI.delete(id)
            setProperties(properties.filter(p => p.id !== id))
            toast.success('Property deleted')
        } catch {
            toast.error('Failed to delete property')
        }
    }

    const handleToggle = async (id) => {
        try {
            const { data } = await propertyAPI.toggleAvail(id)
            setProperties(properties.map(p => p.id === id ? { ...p, available: data.available } : p))
            toast.success(`Property ${data.available ? 'enabled' : 'disabled'}`)
        } catch {
            toast.error('Failed to toggle availability')
        }
    }

    const handleBookingAction = async (id, action) => {
        try {
            action === 'confirm' ? await bookingAPI.confirm(id) : await bookingAPI.reject(id)
            setBookings(bookings.map(b => b.id === id ? { ...b, status: action === 'confirm' ? 'CONFIRMED' : 'REJECTED' } : b))
            toast.success(`Booking ${action}ed`)
        } catch {
            toast.error('Action failed')
        }
    }
    const handleImageUpload = async (propertyId, file) => {
        if (!file) return

        try {
            await propertyAPI.uploadImage(propertyId, file)
            toast.success('Image uploaded successfully')
            fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed')
        }
    }

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Agent Dashboard</h1>
                    <p className="text-gray-500">Manage your property listings</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditingProperty(null) }} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Property
                </button>
            </div>

            {/* Property Form */}
            {showForm && (
                <div className="card mb-8">
                    <h2 className="text-lg font-semibold mb-4">{editingProperty ? 'Edit Property' : 'New Property'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="APARTMENT">Apartment</option>
                                <option value="HOUSE">House</option>
                                <option value="VILLA">Villa</option>
                                <option value="OFFICE">Office</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night ($)</label>
                            <input type="number" className="input" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} required min={1} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                            <input type="number" className="input" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} min={0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                            <input type="number" className="input" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} min={0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                            <input type="number" className="input" value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: e.target.value })} min={1} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Images
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-4 hover:border-blue-400 transition-colors w-full mb-3">
                                <Upload size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-500">Click to add images (multiple allowed)</span>
                                <input type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
                            </label>
                            {imagePreviews.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="relative group">
                                            <img src={src} className="w-20 h-20 object-cover rounded-lg" />
                                            {i === 0 && (
                                                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">Main</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs items-center justify-center hidden group-hover:flex"
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="sm:col-span-2 flex gap-3 pt-2">
                            <button type="submit" className="btn-primary">{editingProperty ? 'Update' : 'Create'} Property</button>
                            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setImageFile(null) }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {['properties', 'bookings'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card animate-pulse h-16 bg-gray-100" />)}</div>
            ) : activeTab === 'properties' ? (
                <div className="space-y-4">
                    {properties.map(p => {
                        const imageUrl = p.mainImageUrl
                            ? p.mainImageUrl.startsWith('http')
                                ? p.mainImageUrl
                                : `http://localhost:8080${p.mainImageUrl}`
                            : 'https://via.placeholder.com/80x80?text=No+Image'

                        return (
                            <div key={p.id} className="card flex items-center gap-4">
                                <img
                                    src={imageUrl}
                                    alt={p.title}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {p.city}, {p.country} · ${p.pricePerNight}/night · {p.type}
                                    </p>
                                    {!p.mainImageUrl && (
                                        <p className="text-xs text-amber-500 mt-1">
                                            ⚠ No image — click upload to add one
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <label className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors">
                                        <Upload size={16} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleImageUpload(p.id, e.target.files[0])}
                                        />
                                    </label>

                                    <button
                                        onClick={() => fetchBookingsForProperty(p.id)}
                                        className="btn-secondary text-xs py-1 px-3"
                                    >
                                        Bookings
                                    </button>

                                    <button
                                        onClick={() => handleToggle(p.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            p.available
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {p.available ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                    </button>

                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">No bookings found for this property.</div>
                    ) : bookings.map(b => (
                        <div key={b.id} className="card flex items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900">{b.userName}</p>
                                    <span className={`badge-${b.status?.toLowerCase()}`}>{b.status}</span>
                                </div>
                                <p className="text-sm text-gray-500">{b.checkInDate} → {b.checkOutDate} · {b.guests} guests · ${b.totalPrice?.toFixed(2)}</p>
                            </div>
                            {b.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleBookingAction(b.id, 'confirm')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={20} /></button>
                                    <button onClick={() => handleBookingAction(b.id, 'reject')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={20} /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}