import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/services'
import api from "../api/axios.js"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
    const [token, setToken]     = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    // Rehydrate once on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
        const storedToken = localStorage.getItem('token')
        setUser(storedUser)
        setToken(storedToken)
    }, [])

    // Optional: also rehydrate on route change
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
        const storedToken = localStorage.getItem('token')
        setUser(storedUser)
        setToken(storedToken)
    }, [location])

    // Validate token on startup
    useEffect(() => {
        if (token) {
            api.get('/auth/validate').catch(() => {
                logout()
            })
        }
    }, [token])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const { data } = await authAPI.login({ email, password })
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setToken(data.token)
            setUser(data)
            return data
        } finally {
            setLoading(false)
        }
    }

    const register = async (formData) => {
        setLoading(true)
        try {
            const { data } = await authAPI.register(formData)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setToken(data.token)
            setUser(data)
            return data
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        navigate("/login", { replace: true }) // 🚫 prevents forward navigation
    }

    const isAdmin = () => user?.role === 'ROLE_ADMIN'
    const isAgent = () => user?.role === 'ROLE_AGENT'
    const isUser  = () => user?.role === 'ROLE_USER'

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAgent,
        isUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
