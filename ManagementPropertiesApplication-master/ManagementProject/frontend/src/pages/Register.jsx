import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import AuthSidebar from '../components/ui/AuthSidebar'
import AuthThemeToggle from '../components/ui/AuthThemeToggle'

export default function Register() {
    const { register, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'USER'
    })
    const [showPassword, setShowPassword] = useState(false)

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
        <div className="min-h-screen flex bg-surface w-full overflow-hidden relative">
            <AuthThemeToggle />
            <div className="flex w-full">
                
                <AuthSidebar />

                {/* Right Side - Register Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-title mb-2">Create an account</h2>
                            <p className="text-muted">Join Property Management today.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-title mb-1.5">First Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                            placeholder="John"
                                            value={form.firstName}
                                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-title mb-1.5">Last Name</label>
                                    <input
                                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                        placeholder="Doe"
                                        value={form.lastName}
                                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-medium text-title mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-title mb-1.5">Register as</label>
                                <select 
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors bg-surface"
                                    value={form.role} 
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="USER">User (Book properties)</option>
                                    <option value="AGENT">Agent (List properties)</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full mt-2 bg-brand hover:bg-brand-hover text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand" 
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-title hover:text-brand transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}