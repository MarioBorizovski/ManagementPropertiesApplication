import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import AuthSidebar from '../components/ui/AuthSidebar'
import AuthThemeToggle from '../components/ui/AuthThemeToggle'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    if (!token) {
        return (
            <div className="min-h-screen flex bg-surface w-full overflow-hidden relative">
                <AuthThemeToggle />
                <div className="flex w-full">
                    <AuthSidebar />
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                        <div className="w-full max-w-md text-center">
                            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
                                <p className="text-red-600 font-medium">Invalid or missing reset token.</p>
                            </div>
                            <Link to="/forgot-password" className="text-brand hover:text-brand-hover font-medium text-sm">
                                ← Request a new reset link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authAPI.resetPassword({ token, newPassword: password })
            toast.success('Password successfully reset!')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. The token may be expired.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-surface w-full overflow-hidden relative">
            <AuthThemeToggle />
            <div className="flex w-full">
                <AuthSidebar />

                {/* Right Side */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-title mb-2">Set New Password</h2>
                            <p className="text-muted">Please enter your new password below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-title mb-1.5">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword
                                            ? <EyeOff className="h-4 w-4 text-gray-400" />
                                            : <Eye className="h-4 w-4 text-gray-400" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5">Must be at least 6 characters.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || password.length < 6}
                                className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand flex items-center justify-center gap-2"
                            >
                                {loading ? 'Saving...' : <><KeyRound size={16} /> Save New Password</>}
                            </button>

                            <p className="text-center text-sm text-muted">
                                Remember it?{' '}
                                <Link to="/login" className="font-semibold text-brand hover:text-brand-hover">
                                    Back to Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
