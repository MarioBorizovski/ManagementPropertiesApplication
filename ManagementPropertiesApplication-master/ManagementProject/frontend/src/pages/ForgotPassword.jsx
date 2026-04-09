import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Building2 } from 'lucide-react'
import AuthSidebar from '../components/ui/AuthSidebar'
import AuthThemeToggle from '../components/ui/AuthThemeToggle'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authAPI.forgotPassword({ email })
            setSubmitted(true)
            toast.success('Reset link sent to your email')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-surface w-full overflow-hidden relative">
            <AuthThemeToggle />
            <div className="flex w-full">

                <AuthSidebar />

                {/* Right Side - Forgot Password Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-title mb-2">Reset Password</h2>
                            <p className="text-muted text-sm">Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        {submitted ? (
                            <div className="text-center space-y-6 bg-surface-hover p-8 rounded-2xl border border-gray-100">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Mail className="text-green-600 w-6 h-6" />
                                </div>
                                <div className="text-gray-800 text-sm leading-relaxed">
                                    If an account exists for <strong className="text-title">{email}</strong>, you will receive a reset link shortly.
                                </div>
                                <Link to="/login" className="w-full flex justify-center items-center gap-2 bg-surface border hover:bg-surface-hover text-title font-medium py-2.5 px-4 rounded-lg transition-colors">
                                    <ArrowLeft size={18} /> Back to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-title mb-1.5">Email address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm transition-colors"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand flex justify-center items-center gap-2"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <Mail size={18} />}
                                </button>

                                <div className="text-center mt-6">
                                    <Link to="/login" className="text-sm hover:text-brand font-medium inline-flex items-center gap-1 transition-colors">
                                        <ArrowLeft size={16} /> Back to login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
