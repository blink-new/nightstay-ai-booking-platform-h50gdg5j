import { blink } from '../blink/client'
import { User } from '../types'

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'nightstay_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const generateToken = (): string => {
  return crypto.randomUUID() + '_' + Date.now()
}

const generateUserId = (): string => {
  return 'user_' + crypto.randomUUID().replace(/-/g, '')
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  userType: 'guest' | 'property_owner'
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

class CustomAuthService {
  private currentUser: User | null = null
  private currentToken: string | null = null
  private authListeners: ((user: User | null) => void)[] = []

  constructor() {
    // Check for existing session on initialization
    this.initializeAuth()
  }

  private async initializeAuth() {
    const token = localStorage.getItem('nightstay_token')
    if (token) {
      try {
        const user = await this.validateToken(token)
        if (user) {
          this.currentUser = user
          this.currentToken = token
          this.notifyListeners()
        } else {
          localStorage.removeItem('nightstay_token')
        }
      } catch (error) {
        console.error('Error validating token:', error)
        localStorage.removeItem('nightstay_token')
      }
    }
  }

  private async validateToken(token: string): Promise<User | null> {
    try {
      const sessions = await blink.db.userSessions.list({
        where: { token },
        limit: 1
      })

      if (sessions.length === 0) {
        return null
      }

      const session = sessions[0]
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await blink.db.userSessions.delete(session.id)
        return null
      }

      // Get user data
      const users = await blink.db.users.list({
        where: { id: session.userId },
        limit: 1
      })

      if (users.length === 0) {
        return null
      }

      const user = users[0]
      
      // Update last login
      await blink.db.users.update(user.id, {
        lastLogin: new Date().toISOString()
      })

      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name || user.firstName,
        lastName: user.last_name || user.lastName,
        phone: user.phone,
        role: user.role as User['role'],
        isVerified: Number(user.is_verified || user.isVerified) > 0,
        ageVerified: Number(user.age_verified || user.ageVerified) > 0,
        idDocumentUrl: user.id_document_url || user.idDocumentUrl,
        displayName: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`.trim(),
        createdAt: user.created_at || user.createdAt,
        updatedAt: user.updated_at || user.updatedAt
      }
    } catch (error) {
      console.error('Error validating token:', error)
      return null
    }
  }

  private notifyListeners() {
    this.authListeners.forEach(listener => listener(this.currentUser))
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback)
    // Immediately call with current state
    callback(this.currentUser)
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback)
      if (index > -1) {
        this.authListeners.splice(index, 1)
      }
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUsers = await blink.db.users.list({
        where: { email: data.email },
        limit: 1
      })

      if (existingUsers.length > 0) {
        return {
          success: false,
          message: 'An account with this email already exists'
        }
      }

      // Hash password
      const passwordHash = await hashPassword(data.password)
      const userId = generateUserId()

      // Create user
      const newUser = await blink.db.users.create({
        id: userId,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.userType === 'property_owner' ? 'property_owner' : 'guest',
        isVerified: 0,
        ageVerified: 0,
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Create session
      const token = generateToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

      await blink.db.userSessions.create({
        id: 'session_' + crypto.randomUUID().replace(/-/g, ''),
        userId,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      })

      // Store token
      localStorage.setItem('nightstay_token', token)

      // Set current user
      this.currentUser = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName || newUser.first_name,
        lastName: newUser.lastName || newUser.last_name,
        phone: newUser.phone,
        role: newUser.role as User['role'],
        isVerified: Number(newUser.isVerified || newUser.is_verified) > 0,
        ageVerified: Number(newUser.ageVerified || newUser.age_verified) > 0,
        idDocumentUrl: newUser.idDocumentUrl || newUser.id_document_url,
        displayName: `${newUser.firstName || newUser.first_name} ${newUser.lastName || newUser.last_name}`.trim(),
        createdAt: newUser.createdAt || newUser.created_at,
        updatedAt: newUser.updatedAt || newUser.updated_at
      }
      this.currentToken = token

      this.notifyListeners()

      return {
        success: true,
        user: this.currentUser,
        token,
        message: 'Account created successfully'
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        success: false,
        message: 'Failed to create account. Please try again.'
      }
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      // Find user by email
      const users = await blink.db.users.list({
        where: { email: data.email },
        limit: 1
      })

      if (users.length === 0) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      const user = users[0]

      // Check if account is active
      if (Number(user.isActive) === 0) {
        return {
          success: false,
          message: 'Account is deactivated. Please contact support.'
        }
      }

      // Verify password
      const passwordHash = await hashPassword(data.password)
      if (passwordHash !== user.passwordHash) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Create new session
      const token = generateToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

      await blink.db.userSessions.create({
        id: 'session_' + crypto.randomUUID().replace(/-/g, ''),
        userId: user.id,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      })

      // Store token
      localStorage.setItem('nightstay_token', token)

      // Update last login
      await blink.db.users.update(user.id, {
        lastLogin: new Date().toISOString()
      })

      // Set current user
      this.currentUser = {
        id: user.id,
        email: user.email,
        firstName: user.first_name || user.firstName,
        lastName: user.last_name || user.lastName,
        phone: user.phone,
        role: user.role as User['role'],
        isVerified: Number(user.is_verified || user.isVerified) > 0,
        ageVerified: Number(user.age_verified || user.ageVerified) > 0,
        idDocumentUrl: user.id_document_url || user.idDocumentUrl,
        displayName: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`.trim(),
        createdAt: user.created_at || user.createdAt,
        updatedAt: user.updated_at || user.updatedAt
      }
      this.currentToken = token

      this.notifyListeners()

      return {
        success: true,
        user: this.currentUser,
        token,
        message: 'Signed in successfully'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        message: 'Failed to sign in. Please try again.'
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      // Remove session from database
      if (this.currentToken) {
        const sessions = await blink.db.userSessions.list({
          where: { token: this.currentToken },
          limit: 1
        })
        
        if (sessions.length > 0) {
          await blink.db.userSessions.delete(sessions[0].id)
        }
      }

      // Clear local storage
      localStorage.removeItem('nightstay_token')

      // Clear current user
      this.currentUser = null
      this.currentToken = null

      this.notifyListeners()
    } catch (error) {
      console.error('Sign out error:', error)
      // Still clear local state even if database operation fails
      localStorage.removeItem('nightstay_token')
      this.currentUser = null
      this.currentToken = null
      this.notifyListeners()
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  hasRole(role: User['role']): boolean {
    if (!this.currentUser) return false
    
    const roleHierarchy = {
      'guest': 1,
      'property_owner': 2,
      'super_admin': 3
    }

    return roleHierarchy[this.currentUser.role] >= roleHierarchy[role]
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) return null

    try {
      const updatedData: any = {
        updatedAt: new Date().toISOString()
      }

      if (updates.firstName) updatedData.firstName = updates.firstName
      if (updates.lastName) updatedData.lastName = updates.lastName
      if (updates.phone) updatedData.phone = updates.phone
      if (updates.idDocumentUrl) updatedData.idDocumentUrl = updates.idDocumentUrl
      if (typeof updates.isVerified === 'boolean') updatedData.isVerified = updates.isVerified ? 1 : 0
      if (typeof updates.ageVerified === 'boolean') updatedData.ageVerified = updates.ageVerified ? 1 : 0

      await blink.db.users.update(this.currentUser.id, updatedData)

      // Update current user object
      this.currentUser = {
        ...this.currentUser,
        ...updates,
        displayName: `${updates.firstName || this.currentUser.firstName} ${updates.lastName || this.currentUser.lastName}`.trim(),
        updatedAt: updatedData.updatedAt
      }

      this.notifyListeners()
      return this.currentUser
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  async uploadIdDocument(file: File): Promise<string | null> {
    if (!this.currentUser) return null

    try {
      // Upload file to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `id-documents/${this.currentUser.id}/${file.name}`,
        { upsert: true }
      )

      // Update user profile with document URL
      await this.updateProfile({ 
        idDocumentUrl: publicUrl,
        isVerified: true // Auto-verify for demo purposes
      })

      return publicUrl
    } catch (error) {
      console.error('Error uploading ID document:', error)
      return null
    }
  }
}

export const customAuthService = new CustomAuthService()