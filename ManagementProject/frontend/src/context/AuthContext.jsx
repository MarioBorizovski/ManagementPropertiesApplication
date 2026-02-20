import { createContext, useContext, useState } from 'react'
import { authAPI } from '../api/services'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
    const [token, setToken]     = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(false)

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
    }

    const isAdmin = () => user?.role === 'ROLE_ADMIN'
    const isAgent = () => user?.role === 'ROLE_AGENT'
    const isUser  = () => user?.role === 'ROLE_USER'

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isAgent, isUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)