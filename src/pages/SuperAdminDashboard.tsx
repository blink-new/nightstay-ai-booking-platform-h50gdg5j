import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  Settings,
  LogOut
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const stats = {
    totalUsers: 1247,
    totalOwners: 89,
    totalProperties: 156,
    totalBookings: 2341,
    monthlyRevenue: 45670,
    pendingApprovals: 12,
    flaggedActivity: 3,
    activeUsers: 892
  };

  const recentUsers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      type: 'Guest',
      status: 'Active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      bookings: 3,
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      type: 'Property Owner',
      status: 'Active',
      joinDate: '2024-01-10',
      lastActive: '1 day ago',
      properties: 2,
      verified: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      type: 'Guest',
      status: 'Pending',
      joinDate: '2024-01-20',
      lastActive: '5 minutes ago',
      bookings: 0,
      verified: false
    }
  ];

  const recentProperties = [
    {
      id: 1,
      name: 'Downtown Loft Hotel',
      owner: 'Mike Chen',
      location: 'Austin, TX',
      status: 'Active',
      rooms: 24,
      rating: 4.5,
      bookings: 89,
      revenue: 12450,
      addedDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Riverside Extended Stay',
      owner: 'Lisa Park',
      location: 'Denver, CO',
      status: 'Pending Review',
      rooms: 18,
      rating: 0,
      bookings: 0,
      revenue: 0,
      addedDate: '2024-01-18'
    },
    {
      id: 3,
      name: 'Historic Inn & Suites',
      owner: 'Robert Wilson',
      location: 'Savannah, GA',
      status: 'Active',
      rooms: 32,
      rating: 4.7,
      bookings: 156,
      revenue: 23890,
      addedDate: '2024-01-05'
    }
  ];

  const flaggedActivity = [
    {
      id: 1,
      type: 'Suspicious Booking',
      description: 'Multiple bookings from same IP address',
      user: 'john.doe@email.com',
      severity: 'High',
      date: '2024-01-20',
      status: 'Under Review'
    },
    {
      id: 2,
      type: 'Fake Review',
      description: 'Potential fake review detected',
      property: 'Sunset Motel',
      severity: 'Medium',
      date: '2024-01-19',
      status: 'Investigating'
    },
    {
      id: 3,
      type: 'Payment Issue',
      description: 'Chargeback reported',
      booking: 'BK-2024-001234',
      severity: 'High',
      date: '2024-01-18',
      status: 'Resolved'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                NightStay<span className="text-[#8EE0A1]">.ai</span>
              </Link>
              <Badge className="ml-3 bg-red-100 text-red-800 border-red-200">
                Super Admin
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, properties, and platform activity</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Property Owners</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalOwners}</p>
                      <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-[#8EE0A1]/20 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-[#22C55E]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Properties</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                      <p className="text-sm text-green-600 mt-1">+15% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">+23% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stats.pendingApprovals}</div>
                  <p className="text-sm text-gray-600 mb-4">Properties awaiting review</p>
                  <Button size="sm" className="w-full">Review Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    Flagged Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stats.flaggedActivity}</div>
                  <p className="text-sm text-gray-600 mb-4">Items requiring attention</p>
                  <Button size="sm" variant="outline" className="w-full">Investigate</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stats.activeUsers}</div>
                  <p className="text-sm text-gray-600 mb-4">Users active in last 30 days</p>
                  <Button size="sm" variant="outline" className="w-full">View Details</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="guests">Guests Only</SelectItem>
                  <SelectItem value="owners">Property Owners</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Activity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-gray-600">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={user.type === 'Property Owner' ? 'default' : 'secondary'}>
                              {user.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Badge 
                                variant={user.status === 'Active' ? 'default' : 'secondary'}
                                className={user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {user.status}
                              </Badge>
                              {user.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {user.lastActive}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            {/* Properties Table */}
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProperties.map((property) => (
                        <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{property.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {property.location} • {property.rooms} rooms
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">{property.owner}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={property.status === 'Active' ? 'default' : 'secondary'}
                              className={property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {property.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              {property.rating > 0 && (
                                <div className="flex items-center mb-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                  <span>{property.rating}</span>
                                </div>
                              )}
                              <div className="text-gray-600">{property.bookings} bookings</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-medium text-gray-900">
                              ${property.revenue.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {property.status === 'Pending Review' && (
                                <>
                                  <Button size="sm" variant="ghost" className="text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-red-600">
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {/* Flagged Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  Flagged Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedActivity.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Badge 
                              variant="secondary"
                              className={
                                activity.severity === 'High' ? 'bg-red-100 text-red-800' :
                                activity.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {activity.severity}
                            </Badge>
                            <span className="ml-2 font-medium text-gray-900">{activity.type}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{activity.description}</p>
                          <div className="text-sm text-gray-500">
                            {activity.user && `User: ${activity.user}`}
                            {activity.property && `Property: ${activity.property}`}
                            {activity.booking && `Booking: ${activity.booking}`}
                            <span className="ml-4">Date: {new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant="outline">{activity.status}</Badge>
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;