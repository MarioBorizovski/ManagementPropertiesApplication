import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/ProtectedRoute'
import { Home as HomeIcon, User } from 'lucide-react'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="bg-border p-4 rounded-2xl mb-6">
                    <HomeIcon className="text-brand w-10 h-10" />
                </div>
                <h1 className="text-4xl font-bold text-title mb-3">
                    Welcome back, {user?.fullName || 'Guest'}
                </h1>
                <p className="text-lg text-muted mb-8 max-w-lg">
                    Manage your properties, bookings, and profile all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/properties')}
                        className="btn-primary px-8 py-3 text-base"
                    >
                        View Properties
                    </button>

                    {user && (
                        <button
                            onClick={() => navigate('/profile')}
                            className="btn-secondary px-8 py-3 text-base flex items-center justify-center gap-2"
                        >
                            <User size={18} /> My Profile
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    )
}

