import { blink } from '../blink/client'
import type { PropertyOwnerStats, SuperAdminStats } from '../types'
import { AuthService } from './authService'
import { PropertyService } from './propertyService'
import { BookingService } from './bookingService'

export class DashboardService {
  // Get property owner dashboard statistics
  static async getPropertyOwnerStats(): Promise<PropertyOwnerStats> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile || userProfile.role !== 'property_owner') {
        throw new Error('Only property owners can view these statistics')
      }

      // Get user's properties
      const properties = await PropertyService.getMyProperties()
      const propertyIds = properties.map(p => p.id)

      // Get all bookings for user's properties
      const allBookings = await BookingService.getPropertyBookings()

      // Calculate statistics
      const totalProperties = properties.length
      const totalBookings = allBookings.length
      const totalRevenue = allBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0)

      // Calculate average rating (placeholder - would need reviews implementation)
      const averageRating = 4.2 // TODO: Calculate from actual reviews

      // Calculate occupancy rate (simplified)
      const confirmedBookings = allBookings.filter(b => 
        ['confirmed', 'checked_in', 'checked_out'].includes(b.status)
      )
      const occupancyRate = totalProperties > 0 
        ? (confirmedBookings.length / (totalProperties * 30)) * 100 // Rough monthly calculation
        : 0

      // Get recent bookings (last 10)
      const recentBookings = allBookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)

      return {
        totalProperties,
        totalBookings,
        totalRevenue,
        averageRating,
        occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
        recentBookings
      }
    } catch (error) {
      console.error('Error getting property owner stats:', error)
      throw error
    }
  }

  // Get super admin dashboard statistics
  static async getSuperAdminStats(): Promise<SuperAdminStats> {
    try {
      const hasPermission = await AuthService.hasRole('super_admin')
      if (!hasPermission) throw new Error('Insufficient permissions')

      // Get all users
      const allUsers = await AuthService.getAllUsers()

      // Get all properties
      const allProperties = await blink.db.properties.list({
        orderBy: { createdAt: 'desc' }
      })

      // Get all bookings
      const allBookings = await blink.db.bookings.list({
        orderBy: { createdAt: 'desc' }
      })

      // Calculate statistics
      const totalUsers = allUsers.length
      const totalProperties = allProperties.length
      const totalBookings = allBookings.length
      const totalRevenue = allBookings
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + b.total_price, 0)

      // Count pending approvals
      const pendingApprovals = allProperties.filter(p => Number(p.is_approved) === 0).length

      // Get recent activity (last 20 items)
      const recentActivity = [
        ...allUsers.slice(0, 5).map(u => ({
          type: 'user_registered',
          data: { userName: u.displayName || u.email, userId: u.id },
          timestamp: u.createdAt
        })),
        ...allProperties.slice(0, 5).map(p => ({
          type: 'property_listed',
          data: { propertyTitle: p.title, propertyId: p.id },
          timestamp: p.created_at
        })),
        ...allBookings.slice(0, 10).map(b => ({
          type: 'booking_created',
          data: { bookingId: b.id, status: b.status },
          timestamp: b.created_at
        }))
      ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20)

      return {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
        pendingApprovals,
        recentActivity
      }
    } catch (error) {
      console.error('Error getting super admin stats:', error)
      throw error
    }
  }

  // Get monthly revenue data for charts
  static async getMonthlyRevenue(months: number = 12): Promise<Array<{ month: string; revenue: number }>> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile) throw new Error('User profile not found')

      let bookings: any[] = []

      if (userProfile.role === 'property_owner') {
        // Get bookings for property owner's properties
        const ownerBookings = await BookingService.getPropertyBookings()
        bookings = ownerBookings.map(b => ({
          created_at: b.createdAt,
          total_price: b.totalPrice,
          payment_status: b.paymentStatus
        }))
      } else if (userProfile.role === 'super_admin') {
        // Get all bookings for admin
        const allBookings = await blink.db.bookings.list({
          orderBy: { createdAt: 'desc' }
        })
        bookings = allBookings
      } else {
        throw new Error('Insufficient permissions')
      }

      // Group bookings by month
      const monthlyData: { [key: string]: number } = {}
      const now = new Date()

      // Initialize last N months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
        monthlyData[monthKey] = 0
      }

      // Sum revenue by month
      bookings
        .filter(b => b.payment_status === 'paid')
        .forEach(booking => {
          const bookingDate = new Date(booking.created_at)
          const monthKey = bookingDate.toISOString().slice(0, 7)
          if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
            monthlyData[monthKey] += booking.total_price
          }
        })

      // Convert to array format
      return Object.entries(monthlyData).map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
        revenue
      }))
    } catch (error) {
      console.error('Error getting monthly revenue:', error)
      throw error
    }
  }

  // Get booking status distribution
  static async getBookingStatusDistribution(): Promise<Array<{ status: string; count: number }>> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile) throw new Error('User profile not found')

      let bookings: any[] = []

      if (userProfile.role === 'property_owner') {
        const ownerBookings = await BookingService.getPropertyBookings()
        bookings = ownerBookings.map(b => ({ status: b.status }))
      } else if (userProfile.role === 'super_admin') {
        const allBookings = await blink.db.bookings.list()
        bookings = allBookings
      } else {
        throw new Error('Insufficient permissions')
      }

      // Count bookings by status
      const statusCounts: { [key: string]: number } = {}
      bookings.forEach(booking => {
        const status = booking.status
        statusCounts[status] = (statusCounts[status] || 0) + 1
      })

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }))
    } catch (error) {
      console.error('Error getting booking status distribution:', error)
      throw error
    }
  }

  // Generate AI insights for property owners
  static async generatePropertyInsights(propertyId?: string): Promise<string> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile || userProfile.role !== 'property_owner') {
        throw new Error('Only property owners can view property insights')
      }

      // Get property data
      let properties: any[] = []
      if (propertyId) {
        const property = await PropertyService.getPropertyById(propertyId)
        if (property && property.ownerId === user.id) {
          properties = [property]
        }
      } else {
        properties = await PropertyService.getMyProperties()
      }

      if (properties.length === 0) {
        return "No properties found to analyze."
      }

      // Get booking data
      const bookings = await BookingService.getPropertyBookings(propertyId)
      const stats = await this.getPropertyOwnerStats()

      const prompt = `
        Analyze this property portfolio and provide actionable insights:

        Properties: ${properties.length}
        Total Bookings: ${stats.totalBookings}
        Total Revenue: $${stats.totalRevenue}
        Occupancy Rate: ${stats.occupancyRate.toFixed(1)}%
        Average Rating: ${stats.averageRating}/5

        Property Details:
        ${properties.map(p => `
        - ${p.title} (${p.propertyType})
          Location: ${p.city}, ${p.state}
          Price: $${p.pricePerNight}/night
          Amenities: ${p.amenities.join(', ')}
        `).join('')}

        Recent Booking Trends:
        ${bookings.slice(0, 10).map(b => `
        - ${b.status} booking for $${b.totalPrice} (${b.stayType})
        `).join('')}

        Provide specific recommendations for:
        1. Pricing optimization
        2. Occupancy improvement
        3. Revenue growth strategies
        4. Property improvements
        5. Market positioning

        Keep insights practical and actionable.
      `

      const { text } = await blink.ai.generateText({
        prompt,
        search: true, // Get market data
        maxTokens: 800
      })

      return text
    } catch (error) {
      console.error('Error generating property insights:', error)
      throw error
    }
  }
}