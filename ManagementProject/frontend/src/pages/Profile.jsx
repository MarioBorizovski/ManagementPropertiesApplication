import { useState, useEffect } from 'react'
import { userAPI } from '../api/services'
import { Layout } from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user: authUser } = useAuth()
    const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', phone: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving]   = useState(false)

    useEffect(() => {
        userAPI.getMe()
            .then(({ data }) => setForm({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone || '' }))
            .catch(() => toast.error('Failed to load profile'))
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await userAPI.updateMe(form)
            toast.success('Profile updated successfully!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your account information</p>
                </div>

                {/* Role Badge */}
                <div className="card mb-6 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <User size={28} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{authUser?.fullName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Shield size={13} /> {authUser?.role?.replace('ROLE_', '')}
                        </p>
                    </div>
                </div>

                <div className="card">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input className="input" value={form.firstName}
                                           onChange={e => setForm({ ...form, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input className="input" value={form.lastName}
                                           onChange={e => setForm({ ...form, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Mail size={14} /> Email</label>
                                <input type="email" className="input" value={form.email}
                                       onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone size={14} /> Phone</label>
                                <input className="input" placeholder="+1 234 567 8900" value={form.phone}
                                       onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}