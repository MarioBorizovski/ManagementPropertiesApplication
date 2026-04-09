import { useState, useEffect } from 'react'
import { propertyAPI, bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge } from '../components/ui/Badge'
import { PropertyForm } from '../components/agent/PropertyForm'
import { AgentPropertiesTab } from '../components/agent/AgentPropertiesTab'
import { AgentBookingsTab } from '../components/agent/AgentBookingsTab'
import { ChatInboxTab } from '../components/chat/ChatInboxTab'

// InfoModal removed. Navigating to PropertyDetail instead

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AgentDashboard() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState([])
    const [bookings, setBookings]     = useState([])
    const [loading, setLoading]       = useState(true)
    const [activeTab, setActiveTab]   = useState('properties')
    const [expandedBooking, setExpandedBooking] = useState(null)

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

    const handleEdit = (p) => {
        navigate(`/property/${p.id}/edit`)
    }

    const handleView = (p) => {
        navigate(`/properties/${p.id}`)
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

    const fetchAllBookings = async () => {
        try {
            const results = await Promise.all(properties.map(p => bookingAPI.getByProperty(p.id)))
            const all = results.flatMap(res => res.data.content)
            all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setBookings(all)
        } catch {
            toast.error('Failed to load bookings')
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
            await propertyAPI.uploadImages(propertyId, [file])
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
                    <h1 className="text-3xl font-bold text-title mb-1">Agent Dashboard</h1>
                    <p className="text-muted">Manage your property listings</p>
                </div>
                <button onClick={() => navigate('/property/new')} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Property
                </button>
            </div>



            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-brand-100">
                {['properties', 'bookings', 'messages'].map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'bookings') fetchAllBookings() }}
                            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-muted hover:text-title'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card animate-pulse h-16 bg-surface-hover" />)}</div>
            ) : activeTab === 'properties' ? (
                <AgentPropertiesTab 
                    properties={properties}
                    onView={handleView}
                    onImageUpload={handleImageUpload}
                    onFetchBookings={fetchBookingsForProperty}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : activeTab === 'bookings' ? (
                <AgentBookingsTab 
                    bookings={bookings}
                    expandedBooking={expandedBooking}
                    onToggleExpand={setExpandedBooking}
                    onBookingAction={handleBookingAction}
                />
            ) : (
                <ChatInboxTab />
            )}
        </Layout>
    )
}