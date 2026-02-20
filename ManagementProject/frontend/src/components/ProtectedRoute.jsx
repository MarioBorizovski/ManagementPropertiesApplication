import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

// Wraps pages that need auth
export function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/properties" replace />
    }

    return children
}

// Main layout with navbar
export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}