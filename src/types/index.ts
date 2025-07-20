// User types
export interface User {
  id: string
  email: string
  displayName?: string
  role: 'guest' | 'property_owner' | 'super_admin'
  phone?: string
  profilePhoto?: string
  isVerified: boolean
  idDocumentUrl?: string
  createdAt: string
  updatedAt: string
}

// Property types
export interface Property {
  id: string
  ownerId: string
  title: string
  description?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  latitude?: number
  longitude?: number
  propertyType: 'motel' | 'hotel' | 'extended_stay' | 'apartment'
  totalRooms: number
  amenities: string[] // Parsed from JSON string
  photos: string[] // Parsed from JSON string
  pricePerNight: number
  pricePerWeek?: number
  pricePerMonth?: number
  isActive: boolean
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

// Room types
export interface Room {
  id: string
  propertyId: string
  roomNumber?: string
  roomType: string
  description?: string
  maxOccupancy: number
  pricePerNight: number
  pricePerWeek?: number
  pricePerMonth?: number
  amenities: string[] // Parsed from JSON string
  photos: string[] // Parsed from JSON string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

// Booking types
export interface Booking {
  id: string
  propertyId: string
  roomId?: string
  guestId: string
  checkIn: string
  checkOut: string
  guestsCount: number
  stayType: 'daily' | 'weekly' | 'monthly'
  totalPrice: number
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentIntentId?: string
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

// Review types
export interface Review {
  id: string
  bookingId: string
  propertyId: string
  guestId: string
  rating: number
  comment?: string
  createdAt: string
}

// Message types
export interface Message {
  id: string
  bookingId?: string
  senderId: string
  recipientId: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
}

// Availability types
export interface Availability {
  id: string
  propertyId: string
  roomId?: string
  date: string
  isAvailable: boolean
  priceOverride?: number
  minimumStay: number
  createdAt: string
}

// Search and filter types
export interface PropertySearchFilters {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  propertyType?: Property['propertyType']
  amenities?: string[]
  stayType?: 'daily' | 'weekly' | 'monthly'
}

// Dashboard analytics types
export interface PropertyOwnerStats {
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  occupancyRate: number
  recentBookings: Booking[]
}

export interface SuperAdminStats {
  totalUsers: number
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  pendingApprovals: number
  recentActivity: any[]
}