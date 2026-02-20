import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Building2, UserPlus } from 'lucide-react'

export default function Register() {
    const { register, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'USER'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await register(form)
            toast.success('Account created successfully!')
            navigate('/properties')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <div className="card">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-blue-600 p-3 rounded-xl mb-3">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-1">Join Property Management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input className="input" placeholder="John" value={form.firstName}
                                       onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input className="input" placeholder="Doe" value={form.lastName}
                                       onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="input" placeholder="you@example.com" value={form.email}
                                   onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" className="input" placeholder="Min. 8 characters" value={form.password}
                                   onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                            <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="USER">User (Book properties)</option>
                                <option value="AGENT">Agent (List properties)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                            <UserPlus size={18} />
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}