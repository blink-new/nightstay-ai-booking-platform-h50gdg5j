import { useState, useEffect } from 'react'
import { customAuthService, SignUpData, SignInData, AuthResponse } from '../services/customAuthService'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useCustomAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = customAuthService.onAuthStateChanged((user) => {
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: user !== null
      })
    })

    return unsubscribe
  }, [])

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    return await customAuthService.signUp(data)
  }

  const signIn = async (data: SignInData): Promise<AuthResponse> => {
    return await customAuthService.signIn(data)
  }

  const signOut = async (): Promise<void> => {
    await customAuthService.signOut()
  }

  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    return await customAuthService.updateProfile(updates)
  }

  const uploadIdDocument = async (file: File): Promise<string | null> => {
    return await customAuthService.uploadIdDocument(file)
  }

  const hasRole = (role: User['role']): boolean => {
    return customAuthService.hasRole(role)
  }

  const getDefaultRoute = (): string => {
    if (!authState.user) return '/'
    
    switch (authState.user.role) {
      case 'super_admin':
        return '/super-admin'
      case 'property_owner':
        return '/owner-dashboard'
      case 'guest':
      default:
        return '/user-dashboard'
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadIdDocument,
    hasRole,
    getDefaultRoute
  }
}