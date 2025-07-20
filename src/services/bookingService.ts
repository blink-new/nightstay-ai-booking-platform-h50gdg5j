import { blink } from '../blink/client'
import type { Booking, Property } from '../types'
import { AuthService } from './authService'
import { PropertyService } from './propertyService'

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: {
    propertyId: string
    roomId?: string
    checkIn: string
    checkOut: string
    guestsCount: number
    stayType: 'daily' | 'weekly' | 'monthly'
    specialRequests?: string
  }) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile || !userProfile.isVerified) {
        throw new Error('Identity verification required to make bookings')
      }

      // Get property details
      const property = await PropertyService.getPropertyById(bookingData.propertyId)
      if (!property || !property.isActive || !property.isApproved) {
        throw new Error('Property not available for booking')
      }

      // Check availability
      const isAvailable = await this.checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut,
        bookingData.roomId
      )

      if (!isAvailable) {
        throw new Error('Property not available for selected dates')
      }

      // Calculate total price
      const totalPrice = this.calculateTotalPrice(
        property,
        bookingData.checkIn,
        bookingData.checkOut,
        bookingData.stayType
      )

      const bookingId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newBooking = await blink.db.bookings.create({
        id: bookingId,
        propertyId: bookingData.propertyId,
        roomId: bookingData.roomId,
        guestId: user.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guestsCount: bookingData.guestsCount,
        stayType: bookingData.stayType,
        totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: bookingData.specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Send confirmation emails
      await this.sendBookingNotifications(bookingId, 'created')

      return this.formatBooking(newBooking)
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  // Get bookings for current user
  static async getMyBookings(): Promise<Booking[]> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const bookings = await blink.db.bookings.list({
        where: { guestId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return bookings.map(this.formatBooking)
    } catch (error) {
      console.error('Error getting user bookings:', error)
      throw error
    }
  }

  // Get bookings for property owner
  static async getPropertyBookings(propertyId?: string): Promise<Booking[]> {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile || userProfile.role !== 'property_owner') {
        throw new Error('Only property owners can view property bookings')
      }

      let whereConditions: any

      if (propertyId) {
        // Check if user owns this property
        const property = await PropertyService.getPropertyById(propertyId)
        if (!property || property.ownerId !== user.id) {
          throw new Error('Property not found or access denied')
        }
        whereConditions = { propertyId }
      } else {
        // Get all bookings for user's properties
        const userProperties = await PropertyService.getMyProperties()
        const propertyIds = userProperties.map(p => p.id)
        
        if (propertyIds.length === 0) return []
        
        whereConditions = { propertyId: { in: propertyIds } }
      }

      const bookings = await blink.db.bookings.list({
        where: whereConditions,
        orderBy: { createdAt: 'desc' }
      })

      return bookings.map(this.formatBooking)
    } catch (error) {
      console.error('Error getting property bookings:', error)
      throw error
    }
  }

  // Update booking status
  static async updateBookingStatus(
    bookingId: string, 
    status: Booking['status'],
    paymentStatus?: Booking['paymentStatus']
  ) {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const booking = await this.getBookingById(bookingId)
      if (!booking) throw new Error('Booking not found')

      const userProfile = await AuthService.getCurrentUserProfile()
      if (!userProfile) throw new Error('User profile not found')

      // Check permissions
      const canUpdate = 
        booking.guestId === user.id || // Guest can cancel
        userProfile.role === 'super_admin' || // Admin can update any
        (userProfile.role === 'property_owner' && await this.isPropertyOwner(booking.propertyId, user.id))

      if (!canUpdate) {
        throw new Error('Insufficient permissions to update booking')
      }

      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      }

      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus
      }

      await blink.db.bookings.update(bookingId, updateData)

      // Send notification emails
      await this.sendBookingNotifications(bookingId, status)

      return await this.getBookingById(bookingId)
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  // Check availability for dates
  static async checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    roomId?: string
  ): Promise<boolean> {
    try {
      // Check for overlapping bookings
      const overlappingBookings = await blink.db.bookings.list({
        where: {
          propertyId,
          roomId: roomId || null,
          status: { in: ['confirmed', 'checked_in'] },
          OR: [
            {
              AND: [
                { checkIn: { lte: checkIn } },
                { checkOut: { gt: checkIn } }
              ]
            },
            {
              AND: [
                { checkIn: { lt: checkOut } },
                { checkOut: { gte: checkOut } }
              ]
            },
            {
              AND: [
                { checkIn: { gte: checkIn } },
                { checkOut: { lte: checkOut } }
              ]
            }
          ]
        }
      })

      return overlappingBookings.length === 0
    } catch (error) {
      console.error('Error checking availability:', error)
      return false
    }
  }

  // Calculate total price for booking
  static calculateTotalPrice(
    property: Property,
    checkIn: string,
    checkOut: string,
    stayType: 'daily' | 'weekly' | 'monthly'
  ): number {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    switch (stayType) {
      case 'daily':
        return diffDays * property.pricePerNight
      case 'weekly': {
        const weeks = Math.ceil(diffDays / 7)
        return weeks * (property.pricePerWeek || property.pricePerNight * 7 * 0.9) // 10% weekly discount
      }
      case 'monthly': {
        const months = Math.ceil(diffDays / 30)
        return months * (property.pricePerMonth || property.pricePerNight * 30 * 0.8) // 20% monthly discount
      }
      default:
        return diffDays * property.pricePerNight
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookings = await blink.db.bookings.list({
        where: { id: bookingId },
        limit: 1
      })

      if (bookings.length === 0) return null
      return this.formatBooking(bookings[0])
    } catch (error) {
      console.error('Error getting booking by ID:', error)
      return null
    }
  }

  // Send booking notification emails
  private static async sendBookingNotifications(bookingId: string, status: string) {
    try {
      const booking = await this.getBookingById(bookingId)
      if (!booking) return

      const property = await PropertyService.getPropertyById(booking.propertyId)
      if (!property) return

      // Get guest and owner details
      const [guestProfile, ownerProfile] = await Promise.all([
        blink.db.users.list({ where: { id: booking.guestId }, limit: 1 }),
        blink.db.users.list({ where: { id: property.ownerId }, limit: 1 })
      ])

      if (guestProfile.length === 0 || ownerProfile.length === 0) return

      const guest = guestProfile[0]
      const owner = ownerProfile[0]

      // Email templates based on status
      const getEmailContent = (recipient: 'guest' | 'owner') => {
        const baseInfo = `
          <h2>Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Check-in:</strong> ${booking.checkIn}</p>
          <p><strong>Check-out:</strong> ${booking.checkOut}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        `

        switch (status) {
          case 'created':
            return recipient === 'guest' 
              ? `${baseInfo}<p>Your booking request has been submitted and is pending confirmation.</p>`
              : `${baseInfo}<p>You have a new booking request from ${guest.display_name || guest.email}.</p>`
          case 'confirmed':
            return `${baseInfo}<p>Your booking has been confirmed!</p>`
          case 'cancelled':
            return `${baseInfo}<p>This booking has been cancelled.</p>`
          default:
            return baseInfo
        }
      }

      // Send emails
      await Promise.all([
        blink.notifications.email({
          to: guest.email,
          subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${property.title}`,
          html: getEmailContent('guest')
        }),
        blink.notifications.email({
          to: owner.email,
          subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - ${property.title}`,
          html: getEmailContent('owner')
        })
      ])
    } catch (error) {
      console.error('Error sending booking notifications:', error)
    }
  }

  // Check if user is property owner
  private static async isPropertyOwner(propertyId: string, userId: string): Promise<boolean> {
    try {
      const property = await PropertyService.getPropertyById(propertyId)
      return property?.ownerId === userId
    } catch (error) {
      return false
    }
  }

  // Helper function to format booking data
  private static formatBooking(dbBooking: any): Booking {
    return {
      id: dbBooking.id,
      propertyId: dbBooking.property_id,
      roomId: dbBooking.room_id,
      guestId: dbBooking.guest_id,
      checkIn: dbBooking.check_in,
      checkOut: dbBooking.check_out,
      guestsCount: dbBooking.guests_count,
      stayType: dbBooking.stay_type,
      totalPrice: dbBooking.total_price,
      status: dbBooking.status,
      paymentStatus: dbBooking.payment_status,
      paymentIntentId: dbBooking.payment_intent_id,
      specialRequests: dbBooking.special_requests,
      createdAt: dbBooking.created_at,
      updatedAt: dbBooking.updated_at
    }
  }
}