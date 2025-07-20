import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Plus, 
  Home, 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Bed,
  Upload,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const PropertyOwnerDashboard = () => {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    type: '',
    description: '',
    price: '',
    amenities: [] as string[],
    images: [] as string[]
  });

  // Sample data for existing properties
  const properties = [
    {
      id: 1,
      name: "Sunset Motel & Suites",
      location: "Downtown Austin, TX",
      type: "Motel",
      rooms: 24,
      price: 89,
      rating: 4.5,
      reviews: 127,
      status: "Active",
      bookings: 18,
      revenue: 1602,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Pine Valley Extended Stay",
      location: "Business District, Denver, CO",
      type: "Extended Stay",
      rooms: 36,
      price: 120,
      rating: 4.7,
      reviews: 89,
      status: "Active",
      bookings: 22,
      revenue: 2640,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
    }
  ];

  // Sample booking data
  const recentBookings = [
    {
      id: 1,
      guestName: "John Smith",
      property: "Sunset Motel & Suites",
      checkIn: "2024-01-20",
      checkOut: "2024-01-23",
      status: "Confirmed",
      amount: 267,
      nights: 3
    },
    {
      id: 2,
      guestName: "Sarah Johnson",
      property: "Pine Valley Extended Stay",
      checkIn: "2024-01-22",
      checkOut: "2024-02-05",
      status: "Checked In",
      amount: 1680,
      nights: 14
    },
    {
      id: 3,
      guestName: "Mike Davis",
      property: "Sunset Motel & Suites",
      checkIn: "2024-01-25",
      checkOut: "2024-01-27",
      status: "Pending",
      amount: 178,
      nights: 2
    }
  ];

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'coffee', label: 'Coffee Maker', icon: Coffee },
    { id: 'tv', label: 'Cable TV', icon: Tv },
    { id: 'bath', label: 'Private Bath', icon: Bath },
    { id: 'bed', label: 'Queen Bed', icon: Bed }
  ];

  const handleAmenityToggle = (amenityId: string) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleAddProperty = () => {
    // Here you would typically save to database
    console.log('Adding property:', newProperty);
    setShowAddProperty(false);
    setNewProperty({
      name: '',
      location: '',
      type: '',
      description: '',
      price: '',
      amenities: [],
      images: []
    });
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
              <Badge className="ml-4 bg-blue-100 text-blue-800">Property Owner</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Settings</Button>
              <Button variant="ghost">Help</Button>
              <div className="w-8 h-8 bg-[#8EE0A1] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Dashboard</h1>
          <p className="text-gray-600">Manage your properties and track your business performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.reduce((sum, prop) => sum + prop.bookings, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${properties.reduce((sum, prop) => sum + prop.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(properties.reduce((sum, prop) => sum + prop.rating, 0) / properties.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
              <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Property Name</Label>
                        <Input
                          id="name"
                          value={newProperty.name}
                          onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Sunset Motel & Suites"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Property Type</Label>
                        <Select value={newProperty.type} onValueChange={(value) => setNewProperty(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="motel">Motel</SelectItem>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="extended-stay">Extended Stay</SelectItem>
                            <SelectItem value="inn">Inn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newProperty.location}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Downtown Austin, TX"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProperty.description}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your property, its features, and what makes it special..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Nightly Rate ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="89"
                      />
                    </div>

                    <div>
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {amenityOptions.map((amenity) => {
                          const IconComponent = amenity.icon;
                          const isSelected = newProperty.amenities.includes(amenity.id);
                          return (
                            <Button
                              key={amenity.id}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={`h-auto p-3 flex flex-col items-center space-y-2 ${
                                isSelected ? 'bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900' : ''
                              }`}
                              onClick={() => handleAmenityToggle(amenity.id)}
                            >
                              <IconComponent className="w-5 h-5" />
                              <span className="text-xs">{amenity.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>Property Images</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                        Cancel
                      </Button>
                      <Button 
                        className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900"
                        onClick={handleAddProperty}
                      >
                        Add Property
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className={`absolute top-3 left-3 ${
                      property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{property.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Rooms</p>
                        <p className="font-semibold">{property.rooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate/Night</p>
                        <p className="font-semibold">${property.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bookings</p>
                        <p className="font-semibold">{property.bookings}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-semibold">${property.revenue}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{booking.guestName}</h4>
                            <p className="text-sm text-gray-600">{booking.property}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{booking.checkIn} → {booking.checkOut}</p>
                            <p>{booking.nights} nights</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.amount}</p>
                          <Badge className={`${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-gray-900">78%</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +5% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Stay Duration</p>
                      <p className="text-2xl font-bold text-gray-900">3.2 days</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        +0.3 days from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
                      <p className="text-2xl font-bold text-gray-900">4.6/5</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Excellent rating
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;