import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2, LogOut, User, LayoutDashboard, BookOpen, Home } from 'lucide-react'

export default function Navbar() {
    const { user, logout, isAdmin, isAgent } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
                        <Building2 size={24} />
                        <span>PropManager</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        <Link to="/properties" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <Home size={16} /> Properties
                        </Link>

                        {(isAdmin() || isAgent()) && (
                            <Link to={isAdmin() ? '/admin/dashboard' : '/agent/dashboard'}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>
                        )}

                        <Link to="/my-bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <BookOpen size={16} /> My Bookings
                        </Link>

                        <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <User size={16} /> Profile
                        </Link>
                    </div>

                    {/* User + Logout */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.role?.replace('ROLE_', '')}</p>
                        </div>
                        <button onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}