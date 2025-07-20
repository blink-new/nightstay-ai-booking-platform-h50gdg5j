import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  Phone,
  Mail,
  User,
  Shield,
  Upload,
  Download,
  MessageSquare,
  Heart,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const UserBookingDashboard = () => {
  const [showIdentityVerification, setShowIdentityVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Sample booking data
  const bookings = [
    {
      id: 1,
      propertyName: "Sunset Motel & Suites",
      location: "Downtown Austin, TX",
      checkIn: "2024-01-20",
      checkOut: "2024-01-23",
      nights: 3,
      guests: 2,
      status: "Confirmed",
      amount: 267,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      confirmationCode: "NS-ABC123",
      rating: null
    },
    {
      id: 2,
      propertyName: "Pine Valley Extended Stay",
      location: "Business District, Denver, CO",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      nights: 3,
      guests: 1,
      status: "Completed",
      amount: 360,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      confirmationCode: "NS-DEF456",
      rating: 4.5
    },
    {
      id: 3,
      propertyName: "Riverside Inn",
      location: "Historic District, Savannah, GA",
      checkIn: "2024-02-01",
      checkOut: "2024-02-03",
      nights: 2,
      guests: 2,
      status: "Upcoming",
      amount: 150,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      confirmationCode: "NS-GHI789",
      rating: null
    }
  ];

  // Sample saved properties
  const savedProperties = [
    {
      id: 1,
      name: "Ocean View Resort",
      location: "Miami Beach, FL",
      price: 145,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Mountain Lodge",
      location: "Aspen, CO",
      price: 220,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    }
  ];

  // Sample payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "08/25",
      isDefault: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Upcoming':
        return <Clock className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                NightStay<span className="text-[#8EE0A1]">.ai</span>
              </Link>
              <Badge className="ml-4 bg-purple-100 text-purple-800">Guest</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">
                <Search className="w-4 h-4 mr-2" />
                Find Stays
              </Button>
              <Button variant="ghost">Help</Button>
              <div className="w-8 h-8 bg-[#8EE0A1] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">JS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your bookings, payments, and travel preferences</p>
        </div>

        {/* Identity Verification Alert */}
        {!isVerified && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Identity Verification Required</h3>
                    <p className="text-yellow-700 text-sm">Complete your identity verification to unlock all booking features</p>
                  </div>
                </div>
                <Dialog open={showIdentityVerification} onOpenChange={setShowIdentityVerification}>
                  <DialogTrigger asChild>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Verify Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Identity Verification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="text-center">
                        <Shield className="w-16 h-16 text-[#8EE0A1] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Identity</h3>
                        <p className="text-gray-600 text-sm">Upload a valid government-issued ID to verify your age (18+) and identity</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Upload ID Document</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">Driver's License, Passport, or State ID</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">AI-Powered Verification</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Instant age verification (18+)</li>
                            <li>• Document authenticity check</li>
                            <li>• Secure and private processing</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowIdentityVerification(false)}>
                          Later
                        </Button>
                        <Button 
                          className="flex-1 bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900"
                          onClick={() => {
                            setIsVerified(true);
                            setShowIdentityVerification(false);
                          }}
                        >
                          Upload & Verify
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Stays</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'Upcoming' || b.status === 'Confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${bookings.reduce((sum, booking) => sum + booking.amount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="saved">Saved Properties</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={booking.image} 
                        alt={booking.propertyName}
                        className="w-32 h-32 object-cover"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{booking.propertyName}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.location}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Check-in</p>
                                <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Check-out</p>
                                <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Guests</p>
                                <p className="font-medium">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Confirmation</p>
                                <p className="font-medium">{booking.confirmationCode}</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-6">
                            <p className="text-2xl font-bold text-gray-900">${booking.amount}</p>
                            <p className="text-sm text-gray-500">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
                            
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {booking.status === 'Completed' && !booking.rating && (
                                <Button size="sm" className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                                  <Star className="w-4 h-4 mr-1" />
                                  Rate
                                </Button>
                              )}
                              {booking.status === 'Upcoming' && (
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Modify
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saved Properties Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Browse More
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{property.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">${property.price}</span>
                        <span className="text-gray-600 text-sm">/night</span>
                      </div>
                      <Button size="sm" className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <Button className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.type} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                        </div>
                        {method.isDefault && (
                          <Badge className="bg-[#8EE0A1]/10 text-[#22C55E] border-[#8EE0A1]/20">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value="John Smith" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value="john.smith@email.com" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value="+1 (555) 123-4567" readOnly />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-green-600 mr-2" />
                      <span>Email Verified</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-green-600 mr-2" />
                      <span>Phone Verified</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-2" />
                      <span>Identity Verified</span>
                    </div>
                    {isVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking Confirmations</p>
                      <p className="text-sm text-gray-600">Receive email confirmations for new bookings</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Special Offers</p>
                      <p className="text-sm text-gray-600">Get notified about deals and promotions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserBookingDashboard;