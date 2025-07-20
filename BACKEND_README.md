# NightStay.ai Backend Implementation

## 🚀 Overview

NightStay.ai backend is powered by **Blink SDK** - a comprehensive full-stack solution that provides authentication, database, AI features, file storage, notifications, and analytics out of the box.

## 🏗️ Architecture

### Core Technologies
- **Blink SDK** - All-in-one backend solution
- **SQLite Database** - Automatic CRUD operations with type safety
- **JWT Authentication** - Multi-role user management
- **File Storage** - Property photos and ID document uploads
- **AI Integration** - Pricing suggestions and document verification
- **Email Notifications** - Booking confirmations and alerts
- **Real-time Analytics** - Dashboard insights and reporting

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT CHECK (role IN ('guest', 'property_owner', 'super_admin')) DEFAULT 'guest',
  phone TEXT,
  profile_photo TEXT,
  is_verified BOOLEAN DEFAULT 0,
  id_document_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Properties Table
```sql
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  latitude REAL,
  longitude REAL,
  property_type TEXT CHECK (property_type IN ('motel', 'hotel', 'extended_stay', 'apartment')),
  total_rooms INTEGER DEFAULT 1,
  amenities TEXT, -- JSON string
  photos TEXT, -- JSON string
  price_per_night REAL NOT NULL,
  price_per_week REAL,
  price_per_month REAL,
  is_active BOOLEAN DEFAULT 1,
  is_approved BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  room_id TEXT,
  guest_id TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  stay_type TEXT CHECK (stay_type IN ('daily', 'weekly', 'monthly')),
  total_price REAL NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_intent_id TEXT,
  special_requests TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Services Architecture

### AuthService
Handles user authentication, profile management, and role-based access control.

**Key Features:**
- Multi-role authentication (Guest, Property Owner, Super Admin)
- Identity verification with ID document upload
- JWT token management
- Profile updates and role checking

**Usage:**
```typescript
import { AuthService } from './services/authService'

// Get current user profile
const user = await AuthService.getCurrentUserProfile()

// Update user profile
await AuthService.updateUserProfile({ displayName: 'John Doe' })

// Upload ID document for verification
await AuthService.uploadIdDocument(file)

// Check user role
const isOwner = await AuthService.hasRole('property_owner')
```

### PropertyService
Manages property listings, search, and approval workflows.

**Key Features:**
- Property CRUD operations
- Advanced search with filters
- Photo upload and management
- Admin approval workflow
- AI-powered pricing suggestions

**Usage:**
```typescript
import { PropertyService } from './services/propertyService'

// Create new property
const property = await PropertyService.createProperty({
  title: 'Cozy Downtown Motel',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  propertyType: 'motel',
  pricePerNight: 89,
  amenities: ['WiFi', 'Parking', 'AC'],
  photos: []
})

// Search properties
const properties = await PropertyService.searchProperties({
  location: 'San Francisco',
  minPrice: 50,
  maxPrice: 200,
  propertyType: 'motel'
})

// Get AI pricing suggestions
const suggestions = await PropertyService.generatePricingSuggestions(propertyData)
```

### BookingService
Handles booking creation, management, and availability checking.

**Key Features:**
- Booking creation with availability validation
- Price calculation for different stay types
- Status management (pending, confirmed, etc.)
- Email notifications for guests and owners
- Availability calendar management

**Usage:**
```typescript
import { BookingService } from './services/bookingService'

// Create new booking
const booking = await BookingService.createBooking({
  propertyId: 'prop_123',
  checkIn: '2024-07-25',
  checkOut: '2024-07-27',
  guestsCount: 2,
  stayType: 'daily',
  specialRequests: 'Late check-in please'
})

// Check availability
const isAvailable = await BookingService.checkAvailability(
  'prop_123',
  '2024-07-25',
  '2024-07-27'
)

// Update booking status
await BookingService.updateBookingStatus('book_456', 'confirmed', 'paid')
```

### DashboardService
Provides analytics and insights for property owners and admins.

**Key Features:**
- Property owner statistics
- Super admin analytics
- Monthly revenue charts
- Booking status distribution
- AI-powered business insights

**Usage:**
```typescript
import { DashboardService } from './services/dashboardService'

// Get property owner stats
const stats = await DashboardService.getPropertyOwnerStats()

// Get monthly revenue data
const revenueData = await DashboardService.getMonthlyRevenue(12)

// Generate AI insights
const insights = await DashboardService.generatePropertyInsights()
```

## 🔐 Authentication Flow

### 1. User Registration
```typescript
// Blink handles authentication automatically
// When user signs in, we initialize their profile
await AuthService.initializeUserProfile({
  email: user.email,
  displayName: user.displayName,
  role: 'guest' // Default role
})
```

### 2. Role Management
```typescript
// Users can upgrade to property owner
await AuthService.updateUserProfile({ role: 'property_owner' })

// Check permissions
const canCreateProperty = await AuthService.hasRole('property_owner')
```

### 3. Identity Verification
```typescript
// Required for booking
await AuthService.uploadIdDocument(idFile)
// AI verification happens automatically
```

## 🤖 AI Features

### Pricing Suggestions
```typescript
const suggestions = await PropertyService.generatePricingSuggestions({
  propertyType: 'motel',
  city: 'San Francisco',
  state: 'CA',
  amenities: ['WiFi', 'Parking'],
  totalRooms: 20
})
```

### Business Insights
```typescript
const insights = await DashboardService.generatePropertyInsights()
// Returns actionable recommendations for:
// - Pricing optimization
// - Occupancy improvement
// - Revenue growth strategies
// - Property improvements
// - Market positioning
```

## 📧 Email Notifications

Automatic email notifications are sent for:
- New booking requests
- Booking confirmations
- Booking cancellations
- Property approval/rejection
- Payment confirmations

```typescript
// Emails are sent automatically via BookingService
// Custom emails can be sent using:
await blink.notifications.email({
  to: 'customer@example.com',
  subject: 'Booking Confirmed',
  html: '<h1>Your booking is confirmed!</h1>'
})
```

## 📊 Analytics & Reporting

### Property Owner Dashboard
- Total properties and bookings
- Revenue tracking
- Occupancy rates
- Recent booking activity
- Performance insights

### Super Admin Dashboard
- Platform-wide statistics
- User management
- Property approvals
- Revenue analytics
- Activity monitoring

## 🔄 Real-time Features

### Live Updates
- Booking status changes
- Property approval notifications
- Real-time availability updates

### WebSocket Integration
```typescript
// Subscribe to booking updates
const unsubscribe = await blink.realtime.subscribe('bookings', (message) => {
  if (message.type === 'booking_updated') {
    // Update UI with new booking status
    updateBookingStatus(message.data)
  }
})
```

## 🚀 Deployment & Scaling

### Automatic Scaling
- Blink SDK handles all infrastructure scaling
- Database auto-scales with usage
- File storage scales automatically
- Email delivery scales with volume

### Performance Optimization
- Automatic query optimization
- Built-in caching
- CDN for file storage
- Edge computing for global performance

## 🔧 Development Setup

### 1. Install Dependencies
```bash
npm install @blinkdotnew/sdk
```

### 2. Configure Blink Client
```typescript
// src/blink/client.ts
import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'your-project-id',
  authRequired: true
})
```

### 3. Initialize Database
```typescript
// Run SQL commands to create tables
await blink.db.sql(`CREATE TABLE IF NOT EXISTS users (...)`)
```

### 4. Use Services
```typescript
import { AuthService, PropertyService, BookingService } from './services'

// Services are ready to use!
const user = await AuthService.getCurrentUserProfile()
```

## 🛡️ Security Features

### Data Protection
- Encrypted data at rest
- Secure JWT tokens
- Role-based access control
- Input validation and sanitization

### Privacy Compliance
- GDPR compliant data handling
- User data deletion capabilities
- Audit logging
- Secure file uploads

## 📈 Monitoring & Analytics

### Built-in Analytics
- User behavior tracking
- Performance monitoring
- Error logging
- Usage analytics

### Custom Events
```typescript
// Track custom events
blink.analytics.log('property_viewed', {
  propertyId: 'prop_123',
  userId: user.id,
  source: 'search_results'
})
```

## 🔮 Future Enhancements

### Planned Features
- Advanced AI recommendations
- Dynamic pricing algorithms
- Multi-language support
- Mobile app integration
- Advanced reporting dashboards
- Integration with external booking platforms

### Extensibility
The backend is designed to be easily extensible:
- Add new property types
- Implement custom pricing rules
- Integrate with external APIs
- Add new notification channels
- Extend analytics capabilities

## 📞 Support

For backend-related questions or issues:
1. Check the Blink SDK documentation
2. Review service implementations in `/src/services/`
3. Check database schema in this README
4. Contact support for advanced customizations

---

**NightStay.ai Backend** - Powered by Blink SDK for maximum reliability, scalability, and developer productivity.