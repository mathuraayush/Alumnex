import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedAdmin = localStorage.getItem('adminUser')
    if (savedToken && savedAdmin) {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
    }
    setLoading(false)
  }, [])

  const login = (adminData, authToken) => {
    setAdmin(adminData)
    setToken(authToken)
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('adminUser', JSON.stringify(adminData))
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('adminUser')
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
