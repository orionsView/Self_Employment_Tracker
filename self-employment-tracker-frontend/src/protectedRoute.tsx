import { Navigate } from 'react-router-dom'
import { useAuth } from './authProvider'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth()

    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />

    return <>{children}</>
}

export default ProtectedRoute
