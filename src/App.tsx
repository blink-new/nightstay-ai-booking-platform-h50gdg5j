import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import PropertyOwnerDashboard from './pages/PropertyOwnerDashboard'
import UserBookingDashboard from './pages/UserBookingDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import './index.css'

// Protected Route Component
function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/' 
}: { 
  children: React.ReactNode
  requiredRole?: 'guest' | 'property_owner' | 'super_admin'
  redirectTo?: string 
}) {
  const { isLoading, isAuthenticated, hasRole } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8EE0A1]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const { isLoading, isAuthenticated, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8EE0A1] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NightStay.ai...</p>
        </div>
      </div>
    )
  }

  // Auto-redirect authenticated users to their appropriate dashboard
  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return "/"
    
    switch (user.role) {
      case 'super_admin':
        return "/super-admin"
      case 'property_owner':
        return "/owner-dashboard"
      case 'guest':
      default:
        return "/user-dashboard"
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={getDefaultRoute()} replace /> : 
                <LandingPage />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute requiredRole="guest">
                <UserBookingDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner-dashboard" 
            element={
              <ProtectedRoute requiredRole="property_owner">
                <PropertyOwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute requiredRole="super_admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </div>
    </Router>
  )
}

export default App