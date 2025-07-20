import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { AuthService } from '../services/authService'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.isLoading) {
        setAuthState({
          user: null,
          isLoading: true,
          isAuthenticated: false
        })
        return
      }

      if (state.user) {
        try {
          // Get full user profile with role information
          const userProfile = await AuthService.getCurrentUserProfile()
          if (userProfile) {
            setAuthState({
              user: userProfile,
              isLoading: false,
              isAuthenticated: true
            })
          } else {
            // Profile couldn't be loaded, but user is authenticated
            // This might happen during profile creation
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: true
            })
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
          // Keep user authenticated but without profile data
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: true
          })
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    })

    return unsubscribe
  }, [])

  const login = (nextUrl?: string) => {
    blink.auth.login(nextUrl)
  }

  const logout = (redirectUrl?: string) => {
    blink.auth.logout(redirectUrl)
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const updatedUser = await AuthService.updateUserProfile(updates)
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }))
      return updatedUser
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const uploadIdDocument = async (file: File) => {
    try {
      const documentUrl = await AuthService.uploadIdDocument(file)
      // Refresh user profile to get updated verification status
      const updatedProfile = await AuthService.getCurrentUserProfile()
      setAuthState(prev => ({
        ...prev,
        user: updatedProfile
      }))
      return documentUrl
    } catch (error) {
      console.error('Error uploading ID document:', error)
      throw error
    }
  }

  const hasRole = (role: User['role']): boolean => {
    if (!authState.user) return false
    
    const roleHierarchy = {
      'guest': 1,
      'property_owner': 2,
      'super_admin': 3
    }

    return roleHierarchy[authState.user.role] >= roleHierarchy[role]
  }

  return {
    ...authState,
    login,
    logout,
    updateProfile,
    uploadIdDocument,
    hasRole
  }
}