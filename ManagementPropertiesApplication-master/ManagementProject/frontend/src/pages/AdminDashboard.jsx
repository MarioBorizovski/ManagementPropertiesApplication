import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDetailsModal } from '../components/admin/UserDetailsModal'
import { userAPI, propertyAPI, bookingAPI } from '../api/services'
import { BookingDetailModal } from '../components/admin/BookingDetailModal'
import { Layout } from '../components/ProtectedRoute'
import { Users, Building2, BookOpen, Trash2, AlertTriangle, ExternalLink } from 'lucide-react'
import { Modal } from '../components/ui/Modal'
import toast from 'react-hot-toast'
import PropertyDetailModal from '../components/PropertyDetailModal'

import { StatCard } from '../components/ui/StatCard'
import { UserManagementTab } from '../components/admin/UserManagementTab'
import { BookingManagementTab } from '../components/admin/BookingManagementTab'
import { PropertyManagementTab } from '../components/admin/PropertyManagementTab'

const TABS = ['users', 'bookings', 'properties']

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [users, setUsers]               = useState([])
    const [bookings, setBookings]         = useState([])
    const [properties, setProperties]     = useState([])
    const [pending, setPending]           = useState([])
    const [loading, setLoading]           = useState(true)
    const [activeTab, setActiveTab]       = useState('users')
    const [page, setPage]                 = useState(0)
    const [totalPages, setTotalPages]     = useState(0)
    const [selectedProperty, setSelectedProperty] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [confirmModal, setConfirmModal] = useState({ 
        isOpen: false, 
        type: '', 
        id: null, 
        title: '', 
        message: '' 
    })

    useEffect(() => {
        Promise.all([userAPI.getAll(), bookingAPI.getAll(), propertyAPI.getAllAdmin()])
            .then(([u, b, p]) => {
                setUsers(u.data)
                setBookings(b.data.content)
                setProperties(p.data.content)
            })
            .catch(() => toast.error('Failed to load dashboard data'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        propertyAPI.getPending({ page, size: 10 })
            .then(res => {
                setPending(res.data.content)
                setTotalPages(res.data.totalPages)
            })
            .catch(() => toast.error('Failed to load pending properties'))
    }, [page])

    const handleDeleteUser = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'USER',
            id,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? All their data will be permanently removed.'
        })
    }

    const deleteUser = async (id) => {
        try {
            await userAPI.delete(id)
            setUsers(prev => prev.filter(u => u.id !== id))
            toast.success('User deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot delete user')
        }
    }

    const handleRoleChange = async (id, role) => {
        try {
            await userAPI.changeRole(id, role)
            const { data: freshUser } = await userAPI.getById(id)
            setUsers(prev => prev.map(u => u.id === id ? freshUser : u))
            toast.success('Role updated')
        } catch {
            toast.error('Failed to update role')
        }
    }

    const handleToggleVerify = async (id) => {
        try {
            await userAPI.verify(id)
            const { data: freshUser } = await userAPI.getById(id)
            setUsers(prev => prev.map(u => u.id === id ? freshUser : u))
            toast.success(freshUser.verified ? 'Agent verified' : 'Verification removed')
        } catch {
            toast.error('Failed to toggle verification')
        }
    }

    const handleViewUser = async (id) => {
        try {
            const { data } = await userAPI.getById(id)
            setSelectedUser(data)
            setIsUserModalOpen(true)
        } catch {
            toast.error('Failed to load user details')
        }
    }

    const handleDeleteBooking = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'BOOKING',
            id,
            title: 'Delete Booking',
            message: 'Are you sure you want to delete this booking? This action cannot be undone.'
        })
    }

    const deleteBooking = async (id) => {
        try {
            await bookingAPI.delete(id)
            setBookings(prev => prev.filter(b => b.id !== id))
            toast.success('Booking deleted')
        } catch {
            toast.error('Failed to delete booking')
        }
    }

    const handleRejectBooking = async (id) => {
        try {
            const { data: freshBooking } = await bookingAPI.reject(id)
            setBookings(prev => prev.map(b => b.id === id ? freshBooking : b))
            // Sync modal state if open
            if (selectedBooking?.id === id) setSelectedBooking(freshBooking)
            toast.success('Booking rejected')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject booking')
        }
    }

    const handleViewBooking = async (id) => {
        const booking = bookings.find(b => b.id === id)
        if (booking) {
            setSelectedBooking(booking)
            setIsBookingModalOpen(true)
        }
    }

    const handleBookingCardAction = async (id, type) => {
        if (type === 'confirm') await handleConfirmBooking(id)
        if (type === 'reject')  await handleRejectBooking(id)
        if (type === 'cancel')  await handleDeleteBooking(id)
    }

    const handleConfirmBooking = async (id) => {
        try {
            const { data: freshBooking } = await bookingAPI.confirm(id)
            setBookings(prev => prev.map(b => b.id === id ? freshBooking : b))
            // Sync modal state if open
            if (selectedBooking?.id === id) setSelectedBooking(freshBooking)
            toast.success('Booking confirmed')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to confirm booking')
        }
    }

    const handleApprove = async (id) => {
        try {
            const { data } = await propertyAPI.approve(id)
            setPending(prev => prev.filter(p => p.id !== id))
            toast.success(`"${data.title}" approved`)
            if (activeTab === 'properties') {
                setProperties(prev => {
                    const exists = prev.find(p => p.id === data.id);
                    if (exists) return prev.map(p => p.id === data.id ? data : p);
                    return [...prev, data];
                });
            }
        } catch {
            toast.error('Failed to approve property')
        }
    }

    const handleReject = async (id) => {
        try {
            await propertyAPI.reject(id)
            setPending(prev => prev.filter(p => p.id !== id))
            toast.success('Property rejected')
        } catch {
            toast.error('Failed to reject property')
        }
    }

    const handleDeleteProperty = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'PROPERTY',
            id,
            title: 'Delete Property',
            message: 'Are you sure you want to delete this property listing? It will be removed from all searches.'
        })
    }

    const deleteProperty = async (id) => {
        try {
            await propertyAPI.delete(id)
            setProperties(prev => prev.filter(p => p.id !== id))
            setPending(prev => prev.filter(p => p.id !== id))
            toast.success('Property deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete property')
        }
    }

    const handleConfirmedDelete = async () => {
        const { type, id } = confirmModal
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        
        if (type === 'USER')     await deleteUser(id)
        if (type === 'BOOKING')  await deleteBooking(id)
        if (type === 'PROPERTY') await deleteProperty(id)
    }

    return (
        <Layout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-title">Admin dashboard</h1>
                    <p className="text-sm text-muted mt-1">Manage users, bookings and properties</p>
                </div>
                <button 
                    onClick={() => navigate('/agent/dashboard')}
                    className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand text-sm font-semibold rounded-xl hover:bg-brand hover:text-white transition-all transform active:scale-95 group"
                >
                    <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Switch to Agent View
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <StatCard label="Total users"      value={users.length}      icon={Users}     color="bg-brand" />
                <StatCard label="Total properties" value={properties.length} icon={Building2} color="bg-green-600" />
                <StatCard label="Total bookings"   value={bookings.length}   icon={BookOpen}  color="bg-amber-500" />
            </div>

            <div className="flex gap-0 border-b border-border mb-5">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                            activeTab === tab
                                ? 'border-brand text-brand'
                                : 'border-transparent text-muted hover:text-gray-800'
                        }`}
                    >
                        {tab}
                        {tab === 'properties' && pending.length > 0 && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                                {pending.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-surface-hover rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {activeTab === 'users' && (
                        <UserManagementTab 
                            users={users} 
                            onDeleteUser={handleDeleteUser} 
                            onRoleChange={handleRoleChange} 
                            onToggleVerify={handleToggleVerify}
                            onViewUser={handleViewUser}
                        />
                    )}

                    {activeTab === 'bookings' && (
                        <BookingManagementTab 
                            bookings={bookings} 
                            onDeleteBooking={handleDeleteBooking} 
                            onConfirmBooking={handleConfirmBooking}
                            onRejectBooking={handleRejectBooking}
                            onViewBooking={handleViewBooking}
                        />
                    )}

                    {activeTab === 'properties' && (
                        <PropertyManagementTab 
                            properties={properties} 
                            pending={pending}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onSelectProperty={setSelectedProperty}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDelete={handleDeleteProperty}
                        />
                    )}
                </>
            )}

            <PropertyDetailModal
                property={selectedProperty}
                onClose={() => setSelectedProperty(null)}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <UserDetailsModal 
                user={selectedUser} 
                isOpen={isUserModalOpen} 
                onClose={() => setIsUserModalOpen(false)} 
            />

            <BookingDetailModal
                booking={selectedBooking}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onAction={handleBookingCardAction}
            />

            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                maxWidth="max-w-md"
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-title mb-2">{confirmModal.title}</h3>
                    <p className="text-muted text-sm mb-8 leading-relaxed">
                        {confirmModal.message}
                    </p>
                    <div className="flex gap-3 mt-8">
                        <button 
                            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmedDelete}
                            className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                        >
                            Delete Now
                        </button>
                    </div>
                </div>
            </Modal>
        </Layout>
    )
}