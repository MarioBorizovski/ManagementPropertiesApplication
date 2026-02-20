import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import Login          from './pages/Login'
import Register       from './pages/Register'
import Properties     from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import MyBookings     from './pages/MyBookings'
import Profile        from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                <Routes>
                    {/* Public */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected - all authenticated users */}
                    <Route path="/properties" element={
                        <ProtectedRoute><Properties /></ProtectedRoute>
                    } />
                    <Route path="/properties/:id" element={
                        <ProtectedRoute><PropertyDetail /></ProtectedRoute>
                    } />
                    <Route path="/my-bookings" element={
                        <ProtectedRoute><MyBookings /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />

                    {/* Admin only */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Agent only */}
                    <Route path="/agent/dashboard" element={
                        <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN']}>
                            <AgentDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}