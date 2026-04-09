import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ChatProvider } from './context/ChatContext'
import { ChatWindow } from './components/chat/ChatWindow'

import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import Properties     from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import MyBookings     from './pages/MyBookings'
import Profile        from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import PropertyEditPage from './pages/PropertyEditPage'
import Home from "./pages/Home.jsx";


export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <ChatProvider>
                        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                        <ChatWindow />
                        <Routes>
                            {/* Public */}
                            <Route path="/login"    element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password"  element={<ResetPassword />} />

                            {/* Protected */}
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

                            {/* Someone else's profile (with id) */}
                            <Route path="/profile/:id" element={
                                <ProtectedRoute><Profile /></ProtectedRoute>
                            } />
                            <Route path="/" element={<Navigate to="/login" replace />} />

                            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

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
                            <Route path="/property/new" element={
                                <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN']}>
                                    <PropertyEditPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/property/:id/edit" element={
                                <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN']}>
                                    <PropertyEditPage />
                                </ProtectedRoute>
                            } />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </ChatProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}