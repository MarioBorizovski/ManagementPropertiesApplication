import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Building2, LogIn } from 'lucide-react'

export default function Login() {
    const { login, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await login(form.email, form.password)
            toast.success(`Welcome back, ${data.fullName}!`)
            const role = data.role
            if (role === 'ROLE_ADMIN')       navigate('/admin/dashboard')
            else if (role === 'ROLE_AGENT')  navigate('/agent/dashboard')
            else                             navigate('/properties')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <div className="card">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-blue-600 p-3 rounded-xl mb-3">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
                        <p className="text-gray-500 mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                            <LogIn size={18} />
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}