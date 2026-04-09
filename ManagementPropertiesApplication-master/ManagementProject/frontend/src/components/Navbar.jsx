import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Leaf, LogOut, User, LayoutDashboard, BookOpen, Home, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const { user, logout, isAdmin, isAgent } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const navigate = useNavigate()

    const confirmLogout = () => {
        logout()
        toast.success("Logged out successfully")
        navigate('/login')
    }

    const linkCls = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors text-brand-200 hover:text-white hover:bg-brand-800"

    return (
        <>
        <nav className="sticky top-0 z-50 bg-brand-900 border-b border-brand-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-600 shadow-md">
                            <Leaf className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">PropManager</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        <Link to="/properties" className={linkCls}>
                            <Home size={15} /> Properties
                        </Link>

                        {(isAdmin() || isAgent()) && (
                            <Link to={isAdmin() ? '/admin/dashboard' : '/agent/dashboard'} className={linkCls}>
                                <LayoutDashboard size={15} /> Dashboard
                            </Link>
                        )}

                        <Link to="/my-bookings" className={linkCls}>
                            <BookOpen size={15} /> My Bookings
                        </Link>

                        <Link to="/profile" className={linkCls}>
                            <User size={15} /> Profile
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-brand-200 hover:text-white hover:bg-brand-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        
                        {user ? (
                            <>
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                                    <p className="text-xs text-brand-300">{user?.role?.replace('ROLE_', '')}</p>
                                </div>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className={linkCls}
                                >
                                    <LogOut size={15} /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>

        {showLogoutModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#000] bg-opacity-40 z-50">
                <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border">
                    <h2 className="text-lg font-semibold text-title mb-2">Confirm Logout</h2>
                    <p className="text-sm text-muted mb-6">Are you sure you want to log out?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowLogoutModal(false)} className="btn-secondary text-sm">
                            Cancel
                        </button>
                        <button onClick={confirmLogout} className="btn-danger text-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}