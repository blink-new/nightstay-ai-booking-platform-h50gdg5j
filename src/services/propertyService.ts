import { blink } from '../blink/client'
import type { Property, PropertySearchFilters } from '../types'
import { AuthService } from './authService'

export class PropertyService {
  // Create a new property listing
  static async createProperty(propertyData: Omit<Property, 'id' | 'ownerId' | 'isActive' | 'isApproved' | 'createdAt' | 'updatedAt'>) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile || userProfile.role !== 'property_owner') {
        throw new Error('Only property owners can create listings')
      }

      const propertyId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newProperty = await blink.db.properties.create({
        id: propertyId,
        ownerId: user.id,
        title: propertyData.title,
        description: propertyData.description,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zipCode: propertyData.zipCode,
        country: propertyData.country || 'US',
        latitude: propertyData.latitude,
        longitude: propertyData.longitude,
        propertyType: propertyData.propertyType,
        totalRooms: propertyData.totalRooms,
        amenities: JSON.stringify(propertyData.amenities),
        photos: JSON.stringify(propertyData.photos),
        pricePerNight: propertyData.pricePerNight,
        pricePerWeek: propertyData.pricePerWeek,
        pricePerMonth: propertyData.pricePerMonth,
        isActive: true,
        isApproved: false, // Requires admin approval
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      return this.formatProperty(newProperty)
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  }

  // Get properties with search filters
  static async searchProperties(filters: PropertySearchFilters = {}): Promise<Property[]> {
    try {
      const whereConditions: any = {
        isActive: "1",
        isApproved: "1"
      }

      // Add location filter
      if (filters.location) {
        whereConditions.OR = [
          { city: { contains: filters.location } },
          { state: { contains: filters.location } },
          { address: { contains: filters.location } }
        ]
      }

      // Add property type filter
      if (filters.propertyType) {
        whereConditions.propertyType = filters.propertyType
      }

      // Add price range filters
      if (filters.minPrice) {
        whereConditions.pricePerNight = { gte: filters.minPrice }
      }
      if (filters.maxPrice) {
        if (whereConditions.pricePerNight) {
          whereConditions.pricePerNight.lte = filters.maxPrice
        } else {
          whereConditions.pricePerNight = { lte: filters.maxPrice }
        }
      }

      const properties = await blink.db.properties.list({
        where: whereConditions,
        orderBy: { createdAt: 'desc' },
        limit: 50
      })

      return properties.map(this.formatProperty)
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  }

  // Get properties owned by current user
  static async getMyProperties(): Promise<Property[]> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const properties = await blink.db.properties.list({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return properties.map(this.formatProperty)
    } catch (error) {
      console.error('Error getting user properties:', error)
      throw error
    }
  }

  // Get single property by ID
  static async getPropertyById(propertyId: string): Promise<Property | null> {
    try {
      const properties = await blink.db.properties.list({
        where: { id: propertyId },
        limit: 1
      })

      if (properties.length === 0) return null
      return this.formatProperty(properties[0])
    } catch (error) {
      console.error('Error getting property by ID:', error)
      throw error
    }
  }

  // Update property
  static async updateProperty(propertyId: string, updates: Partial<Property>) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      // Check ownership or admin rights
      const property = await this.getPropertyById(propertyId)
      if (!property) throw new Error('Property not found')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile) throw new Error('User profile not found')

      if (property.ownerId !== user.id && userProfile.role !== 'super_admin') {
        throw new Error('Insufficient permissions')
      }

      const updateData: any = {
        updatedAt: new Date().toISOString()
      }

      // Map camelCase to snake_case for database
      if (updates.title) updateData.title = updates.title
      if (updates.description) updateData.description = updates.description
      if (updates.address) updateData.address = updates.address
      if (updates.city) updateData.city = updates.city
      if (updates.state) updateData.state = updates.state
      if (updates.zipCode) updateData.zip_code = updates.zipCode
      if (updates.country) updateData.country = updates.country
      if (updates.latitude) updateData.latitude = updates.latitude
      if (updates.longitude) updateData.longitude = updates.longitude
      if (updates.propertyType) updateData.property_type = updates.propertyType
      if (updates.totalRooms) updateData.total_rooms = updates.totalRooms
      if (updates.amenities) updateData.amenities = JSON.stringify(updates.amenities)
      if (updates.photos) updateData.photos = JSON.stringify(updates.photos)
      if (updates.pricePerNight) updateData.price_per_night = updates.pricePerNight
      if (updates.pricePerWeek) updateData.price_per_week = updates.pricePerWeek
      if (updates.pricePerMonth) updateData.price_per_month = updates.pricePerMonth
      if (typeof updates.isActive === 'boolean') updateData.is_active = updates.isActive ? 1 : 0
      if (typeof updates.isApproved === 'boolean') updateData.is_approved = updates.isApproved ? 1 : 0

      await blink.db.properties.update(propertyId, updateData)
      return await this.getPropertyById(propertyId)
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  }

  // Upload property photos
  static async uploadPropertyPhotos(propertyId: string, files: File[]): Promise<string[]> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const uploadPromises = files.map(async (file, index) => {
        const { publicUrl } = await blink.storage.upload(
          file,
          `properties/${propertyId}/photo_${index}_${file.name}`,
          { upsert: true }
        )
        return publicUrl
      })

      const photoUrls = await Promise.all(uploadPromises)

      // Update property with new photos
      const property = await this.getPropertyById(propertyId)
      if (property) {
        const existingPhotos = property.photos || []
        const updatedPhotos = [...existingPhotos, ...photoUrls]
        await this.updateProperty(propertyId, { photos: updatedPhotos })
      }

      return photoUrls
    } catch (error) {
      console.error('Error uploading property photos:', error)
      throw error
    }
  }

  // Get properties pending approval (admin only)
  static async getPendingApprovals(): Promise<Property[]> {
    try {
      const hasPermission = await AuthService.hasRole('super_admin')
      if (!hasPermission) throw new Error('Insufficient permissions')

      const properties = await blink.db.properties.list({
        where: { isApproved: "0" },
        orderBy: { createdAt: 'desc' }
      })

      return properties.map(this.formatProperty)
    } catch (error) {
      console.error('Error getting pending approvals:', error)
      throw error
    }
  }

  // Approve/reject property (admin only)
  static async approveProperty(propertyId: string, approved: boolean) {
    try {
      const hasPermission = await AuthService.hasRole('super_admin')
      if (!hasPermission) throw new Error('Insufficient permissions')

      await this.updateProperty(propertyId, { isApproved: approved })

      // Send notification to property owner
      const property = await this.getPropertyById(propertyId)
      if (property) {
        const ownerProfile = await blink.db.users.list({
          where: { id: property.ownerId },
          limit: 1
        })

        if (ownerProfile.length > 0) {
          await blink.notifications.email({
            to: ownerProfile[0].email,
            subject: `Property ${approved ? 'Approved' : 'Rejected'} - ${property.title}`,
            html: `
              <h2>Property ${approved ? 'Approved' : 'Rejected'}</h2>
              <p>Your property listing "${property.title}" has been ${approved ? 'approved and is now live' : 'rejected'}.</p>
              ${approved ? '<p>Guests can now discover and book your property!</p>' : '<p>Please review our listing guidelines and resubmit.</p>'}
            `
          })
        }
      }

      return await this.getPropertyById(propertyId)
    } catch (error) {
      console.error('Error approving property:', error)
      throw error
    }
  }

  // Generate AI pricing suggestions
  static async generatePricingSuggestions(propertyData: Partial<Property>) {
    try {
      const prompt = `
        Analyze this property and suggest optimal pricing:
        
        Property Type: ${propertyData.propertyType}
        Location: ${propertyData.city}, ${propertyData.state}
        Amenities: ${propertyData.amenities?.join(', ')}
        Total Rooms: ${propertyData.totalRooms}
        
        Provide pricing suggestions for:
        1. Daily rate
        2. Weekly rate (with discount)
        3. Monthly rate (with discount)
        
        Consider local market rates, property type, and amenities.
      `

      const { text } = await blink.ai.generateText({
        prompt,
        search: true, // Get real-time market data
        maxTokens: 500
      })

      return text
    } catch (error) {
      console.error('Error generating pricing suggestions:', error)
      throw error
    }
  }

  // Helper function to format property data
  private static formatProperty(dbProperty: any): Property {
    return {
      id: dbProperty.id,
      ownerId: dbProperty.owner_id,
      title: dbProperty.title,
      description: dbProperty.description,
      address: dbProperty.address,
      city: dbProperty.city,
      state: dbProperty.state,
      zipCode: dbProperty.zip_code,
      country: dbProperty.country,
      latitude: dbProperty.latitude,
      longitude: dbProperty.longitude,
      propertyType: dbProperty.property_type,
      totalRooms: dbProperty.total_rooms,
      amenities: dbProperty.amenities ? JSON.parse(dbProperty.amenities) : [],
      photos: dbProperty.photos ? JSON.parse(dbProperty.photos) : [],
      pricePerNight: dbProperty.price_per_night,
      pricePerWeek: dbProperty.price_per_week,
      pricePerMonth: dbProperty.price_per_month,
      isActive: Number(dbProperty.is_active) > 0,
      isApproved: Number(dbProperty.is_approved) > 0,
      createdAt: dbProperty.created_at,
      updatedAt: dbProperty.updated_at
    }
  }
}