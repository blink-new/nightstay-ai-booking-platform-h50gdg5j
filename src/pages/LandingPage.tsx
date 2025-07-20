import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { MapPin, Shield, Clock, Star, Users, TrendingUp, Search, Calendar as CalendarIcon, Wifi, Car, Coffee, Tv, Bath, Bed } from 'lucide-react';

const LandingPage = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('1');
  const [stayType, setStayType] = useState('daily');

  // Sample property data
  const sampleProperties = [
    {
      id: 1,
      name: "Sunset Motel & Suites",
      location: "Downtown Austin, TX",
      price: 89,
      rating: 4.5,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      amenities: ['wifi', 'parking', 'coffee', 'tv'],
      type: 'Motel'
    },
    {
      id: 2,
      name: "Pine Valley Extended Stay",
      location: "Business District, Denver, CO",
      price: 120,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      amenities: ['wifi', 'parking', 'coffee', 'bath'],
      type: 'Extended Stay'
    },
    {
      id: 3,
      name: "Riverside Inn",
      location: "Historic District, Savannah, GA",
      price: 75,
      rating: 4.3,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      amenities: ['wifi', 'coffee', 'tv', 'bed'],
      type: 'Inn'
    }
  ];

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
    tv: Tv,
    bath: Bath,
    bed: Bed
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                NightStay<span className="text-[#8EE0A1]">.ai</span>
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900 font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-6 bg-[#8EE0A1]/10 text-[#22C55E] border-[#8EE0A1]/20">
              AI-Enhanced Booking Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Simplified Booking for
              <br />
              <span className="text-[#8EE0A1]">Independent Lodging</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect guests with unique stays at independent motels, hotels, and extended-stay properties. 
              Built for simplicity, powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900 font-medium px-8 py-3">
                  List Your Property
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Find a Stay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Your Perfect Stay</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="City, state, or property name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? checkIn.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? checkOut.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className="flex flex-col justify-end">
                <Button className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900 font-medium h-10">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stay Type</label>
                <Select value={stayType} onValueChange={setStayType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Available Properties</h3>
              <Badge className="bg-[#8EE0A1]/10 text-[#22C55E] border-[#8EE0A1]/20">
                {sampleProperties.length} properties found
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">
                      {property.type}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">{property.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>

                    {/* Amenities */}
                    <div className="flex items-center gap-2 mb-4">
                      {property.amenities.slice(0, 4).map((amenity) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                        return (
                          <div key={amenity} className="w-6 h-6 text-gray-400">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        );
                      })}
                      {property.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{property.amenities.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                        <span className="text-gray-600 text-sm">/{stayType === 'daily' ? 'night' : stayType === 'weekly' ? 'week' : 'month'}</span>
                        <p className="text-xs text-gray-500">{property.reviews} reviews</p>
                      </div>
                      <Button size="sm" className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Load More Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From listing management to guest verification, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Management */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Property Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  List multiple properties with room types, photos, amenities, and pricing. 
                  AI-powered suggestions help optimize your listings.
                </p>
              </CardContent>
            </Card>

            {/* Identity Verification */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Identity Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure guest verification with AI-driven age validation and document authenticity checks. 
                  Build trust and safety.
                </p>
              </CardContent>
            </Card>

            {/* Flexible Stays */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Stay Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  Support daily, weekly, and monthly bookings. Perfect for business travelers, 
                  extended stays, and vacation guests.
                </p>
              </CardContent>
            </Card>

            {/* Guest Experience */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Superior Guest Experience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Streamlined booking process, secure payments, and easy communication. 
                  Keep guests happy and coming back.
                </p>
              </CardContent>
            </Card>

            {/* Admin Control */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive admin tools for monitoring activity, managing users, 
                  and maintaining platform quality and safety.
                </p>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8EE0A1]/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track bookings, revenue, and guest satisfaction. Make data-driven decisions 
                  to grow your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8EE0A1]/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Property Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join independent property owners who are already growing their business with NightStay.ai
          </p>
          <Button size="lg" className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900 font-medium px-8 py-3">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  <strong>Email:</strong> support@nightstay.ai
                </p>
                <p className="text-gray-300">
                  <strong>Phone:</strong> 1-800-NIGHTSTAY
                </p>
                <div className="pt-4">
                  <h4 className="font-medium mb-3">Quick Contact</h4>
                  <div className="flex gap-3">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#8EE0A1]"
                    />
                    <Button className="bg-[#8EE0A1] hover:bg-[#7DD492] text-gray-900">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Find Us</h3>
              <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400">Interactive Map Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 NightStay.ai. All rights reserved. Built for independent lodging providers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;