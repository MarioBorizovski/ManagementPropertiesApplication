import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

// Wraps pages that need auth
export function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth()

    // If not logged in → go to login
    if (!user) return <Navigate to="/login" replace />

    // If roles are restricted and user doesn't match → go to home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    // Otherwise render the protected content
    return children
}

// Main layout with navbar
export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
