
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../common/Spinner'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return <Spinner center size="lg" />

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
