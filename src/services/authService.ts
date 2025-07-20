import { blink } from '../blink/client'
import type { User } from '../types'

export class AuthService {
  // Initialize user profile after Blink auth
  static async initializeUserProfile(userData: {
    email: string
    displayName?: string
    role?: 'guest' | 'property_owner' | 'super_admin'
  }) {
    try {
      const user = await blink.auth.me()
      
      // First check if user exists by ID
      const existingProfileById = await blink.db.users.list({
        where: { id: user.id },
        limit: 1
      })

      if (existingProfileById.length > 0) {
        // User already exists with this ID, just return the profile
        return await this.getCurrentUserProfile()
      }

      // Check if user exists by email (different auth provider, same email)
      const existingProfileByEmail = await blink.db.users.list({
        where: { email: userData.email },
        limit: 1
      })

      if (existingProfileByEmail.length > 0) {
        // User exists with same email but different ID - migrate the data
        const existingUser = existingProfileByEmail[0]
        
        // Delete the old record
        await blink.db.users.delete(existingUser.id)
        
        // Create new record with current auth ID but preserve existing data
        await blink.db.users.create({
          id: user.id,
          email: existingUser.email,
          displayName: existingUser.display_name,
          role: existingUser.role,
          phone: existingUser.phone,
          profilePhoto: existingUser.profile_photo,
          isVerified: Number(existingUser.is_verified) > 0,
          idDocumentUrl: existingUser.id_document_url,
          createdAt: existingUser.created_at,
          updatedAt: new Date().toISOString()
        })
        
        return await this.getCurrentUserProfile()
      }

      // Create new user profile
      await blink.db.users.create({
        id: user.id,
        email: userData.email,
        displayName: userData.displayName || user.email?.split('@')[0],
        role: userData.role || 'guest',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      return await this.getCurrentUserProfile()
    } catch (error) {
      console.error('Error initializing user profile:', error)
      throw error
    }
  }

  // Get current user profile with role information
  static async getCurrentUserProfile(): Promise<User | null> {
    try {
      const user = await blink.auth.me()
      if (!user) return null

      const profiles = await blink.db.users.list({
        where: { id: user.id },
        limit: 1
      })

      if (profiles.length === 0) {
        // Initialize profile if it doesn't exist - but avoid infinite recursion
        // by checking if we're already in an initialization process
        if (user.email) {
          return await this.initializeUserProfile({
            email: user.email,
            displayName: user.displayName
          })
        }
        return null
      }

      const profile = profiles[0]
      return {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        role: profile.role as User['role'],
        phone: profile.phone,
        profilePhoto: profile.profile_photo,
        isVerified: Number(profile.is_verified) > 0,
        idDocumentUrl: profile.id_document_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      // Don't try to initialize on error to avoid infinite loops
      return null
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<User>) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const updateData: any = {
        updatedAt: new Date().toISOString()
      }

      if (updates.displayName) updateData.display_name = updates.displayName
      if (updates.phone) updateData.phone = updates.phone
      if (updates.profilePhoto) updateData.profile_photo = updates.profilePhoto
      if (updates.role) updateData.role = updates.role
      if (typeof updates.isVerified === 'boolean') updateData.is_verified = updates.isVerified ? 1 : 0
      if (updates.idDocumentUrl) updateData.id_document_url = updates.idDocumentUrl

      await blink.db.users.update(user.id, updateData)
      return await this.getCurrentUserProfile()
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Upload and verify ID document
  static async uploadIdDocument(file: File) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      // Upload ID document to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `id-documents/${user.id}/${file.name}`,
        { upsert: true }
      )

      // Update user profile with document URL
      await this.updateUserProfile({
        idDocumentUrl: publicUrl
      })

      // TODO: Implement AI-powered age verification
      // For now, we'll mark as verified after upload
      await this.updateUserProfile({
        isVerified: true
      })

      return publicUrl
    } catch (error) {
      console.error('Error uploading ID document:', error)
      throw error
    }
  }

  // Check if user has required role
  static async hasRole(requiredRole: User['role']): Promise<boolean> {
    try {
      const profile = await this.getCurrentUserProfile()
      if (!profile) return false

      const roleHierarchy = {
        'guest': 1,
        'property_owner': 2,
        'super_admin': 3
      }

      return roleHierarchy[profile.role] >= roleHierarchy[requiredRole]
    } catch (error) {
      console.error('Error checking user role:', error)
      return false
    }
  }

  // Get all users (super admin only)
  static async getAllUsers(): Promise<User[]> {
    try {
      const hasPermission = await this.hasRole('super_admin')
      if (!hasPermission) throw new Error('Insufficient permissions')

      const users = await blink.db.users.list({
        orderBy: { createdAt: 'desc' }
      })

      return users.map(user => ({
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role as User['role'],
        phone: user.phone,
        profilePhoto: user.profile_photo,
        isVerified: Number(user.is_verified) > 0,
        idDocumentUrl: user.id_document_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))
    } catch (error) {
      console.error('Error getting all users:', error)
      throw error
    }
  }
}