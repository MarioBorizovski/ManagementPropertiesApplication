import { useState, useEffect } from 'react'
import { userAPI, propertyAPI, bookingAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { Users, Building2, BookOpen, Trash2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
)

export default function AdminDashboard() {
    const [users, setUsers]         = useState([])
    const [bookings, setBookings]   = useState([])
    const [properties, setProperties] = useState([])
    const [loading, setLoading]     = useState(true)
    const [activeTab, setActiveTab] = useState('users')

    useEffect(() => {
        Promise.all([userAPI.getAll(), bookingAPI.getAll(), propertyAPI.getAll()])
            .then(([u, b, p]) => {
                setUsers(u.data)
                setBookings(b.data.content)
                setProperties(p.data.content)
            })
            .catch(() => toast.error('Failed to load dashboard data'))
            .finally(() => setLoading(false))
    }, [])

    const handleDeleteUser = async (id) => {
        if (!confirm('Delete this user?')) return
        try {
            await userAPI.delete(id)
            setUsers(users.filter(u => u.id !== id))
            toast.success('User deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot delete user')
        }
    }

    const handleRoleChange = async (id, role) => {
        try {
            const { data } = await userAPI.changeRole(id, role)
            setUsers(users.map(u => u.id === id ? { ...u, role: data.role } : u))
            toast.success('Role updated')
        } catch {
            toast.error('Failed to update role')
        }
    }

    const handleDeleteBooking = async (id) => {
        if (!confirm('Delete this booking?')) return
        try {
            await bookingAPI.delete(id)
            setBookings(bookings.filter(b => b.id !== id))
            toast.success('Booking deleted')
        } catch {
            toast.error('Failed to delete booking')
        }
    }

    const tabs = ['users', 'bookings', 'properties']

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500">Manage the entire platform</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <StatCard label="Total Users"      value={users.length}      icon={Users}     color="bg-blue-500" />
                <StatCard label="Total Properties" value={properties.length} icon={Building2} color="bg-green-500" />
                <StatCard label="Total Bookings"   value={bookings.length}   icon={BookOpen}  color="bg-purple-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg" />)}</div>
            ) : (
                <>
                    {/* Users Table */}
                    {activeTab === 'users' && (
                        <div className="card overflow-x-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                                ))}</tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <select className="text-xs border border-gray-200 rounded px-2 py-1"
                                                    value={u.role?.replace('ROLE_', '')}
                                                    onChange={e => handleRoleChange(u.id, e.target.value)}>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="AGENT">AGENT</option>
                                                <option value="USER">USER</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Bookings Table */}
                    {activeTab === 'bookings' && (
                        <div className="card overflow-x-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Property', 'User', 'Dates', 'Guests', 'Total', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                                ))}</tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {bookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{b.propertyTitle}</td>
                                        <td className="px-4 py-3 text-gray-500">{b.userName}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.checkInDate} → {b.checkOutDate}</td>
                                        <td className="px-4 py-3 text-gray-500">{b.guests}</td>
                                        <td className="px-4 py-3 font-medium">${b.totalPrice?.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge-${b.status?.toLowerCase()}`}>{b.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleDeleteBooking(b.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Properties Table */}
                    {activeTab === 'properties' && (
                        <div className="card overflow-x-auto p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Title', 'City', 'Type', 'Price/night', 'Agent', 'Available'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                                ))}</tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {properties.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                                        <td className="px-4 py-3 text-gray-500">{p.city}</td>
                                        <td className="px-4 py-3 text-gray-500">{p.type}</td>
                                        <td className="px-4 py-3 font-medium">${p.pricePerNight}</td>
                                        <td className="px-4 py-3 text-gray-500">{p.agentName}</td>
                                        <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.available ? 'Yes' : 'No'}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </Layout>
    )
}