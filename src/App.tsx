import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { useCustomAuth } from './hooks/useCustomAuth'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
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
  const { isLoading, isAuthenticated, hasRole } = useCustomAuth()

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
  const { isLoading } = useCustomAuth()

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

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes - Always accessible */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
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