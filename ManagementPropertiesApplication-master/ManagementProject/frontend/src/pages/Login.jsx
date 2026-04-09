import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthSidebar from '../components/ui/AuthSidebar'
import AuthThemeToggle from '../components/ui/AuthThemeToggle'

export default function Login() {
    const { login, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await login(form.email, form.password)
            toast.success(`Welcome back, ${data.fullName}!`)
            const role = data.role
            if (role === 'ROLE_ADMIN') navigate('/admin/dashboard')
            else if (role === 'ROLE_AGENT') navigate('/agent/dashboard')
            else navigate('/home')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex bg-surface w-full overflow-hidden relative">
            <AuthThemeToggle />
            <div className="flex w-full">

                <AuthSidebar />

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-title mb-2">Welcome back</h2>
                            <p className="text-muted">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-title mb-1.5">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-title">Password</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold hover:text-brand transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm">
                                    Remember me for 30 days
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Log in'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-title hover:text-brand transition-colors">Sign up for free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}