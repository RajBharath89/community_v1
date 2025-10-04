"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Heart, 
  BookOpen,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  UserCheck,
  Megaphone,
  DollarSign,
  Library,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  UserPlus,
  UserMinus,
  Shield,
  Crown,
  Star,
  Sparkles,
  Send,
  Clock,
  CheckCircle,
  Eye,
  MousePointer,
  FileText,
  Image,
  Music,
  Video,
  Download,
  Upload
} from "lucide-react"
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart
} from "recharts"

export default function HubDashboard() {
  const [activeTab, setActiveTab] = useState("hub")

  // Mock data for charts - Using red color variants only
  const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2', '#7f1d1d']

  // Hub Charts Data
  const systemHealthData = [
    { name: 'CPU Usage', value: 65, color: '#dc2626' },
    { name: 'Memory', value: 78, color: '#ef4444' },
    { name: 'Storage', value: 45, color: '#f87171' },
    { name: 'Network', value: 32, color: '#fca5a5' }
  ]

  const systemHealthTrendData = [
    { time: '00:00', cpu: 45, memory: 60, storage: 40, network: 25 },
    { time: '04:00', cpu: 50, memory: 65, storage: 42, network: 28 },
    { time: '08:00', cpu: 70, memory: 75, storage: 44, network: 35 },
    { time: '12:00', cpu: 80, memory: 80, storage: 45, network: 40 },
    { time: '16:00', cpu: 75, memory: 78, storage: 45, network: 38 },
    { time: '20:00', cpu: 60, memory: 70, storage: 44, network: 30 },
    { time: '24:00', cpu: 55, memory: 65, storage: 43, network: 28 }
  ]

  const userActivityData = [
    { name: 'Mon', users: 120 },
    { name: 'Tue', users: 190 },
    { name: 'Wed', users: 300 },
    { name: 'Thu', users: 500 },
    { name: 'Fri', users: 450 },
    { name: 'Sat', users: 350 },
    { name: 'Sun', users: 280 }
  ]

  const notificationData = [
    { name: 'System', value: 35, color: '#dc2626' },
    { name: 'Security', value: 25, color: '#ef4444' },
    { name: 'Updates', value: 20, color: '#f87171' },
    { name: 'Alerts', value: 20, color: '#fca5a5' }
  ]

  const sessionData = [
    { name: 'Active', value: 89, color: '#dc2626' },
    { name: 'Idle', value: 15, color: '#ef4444' },
    { name: 'Expired', value: 8, color: '#f87171' }
  ]

  // Identity Charts Data
  const userRoleData = [
    { name: 'Devotees', value: 850, color: '#dc2626' },
    { name: 'Volunteers', value: 245, color: '#ef4444' },
    { name: 'Priests', value: 12, color: '#f87171' },
    { name: 'Trustees', value: 78, color: '#fca5a5' },
    { name: 'Admins', value: 35, color: '#fecaca' }
  ]

  const userStatusData = [
    { name: 'Jan', active: 1200, inactive: 50 },
    { name: 'Feb', active: 1250, inactive: 45 },
    { name: 'Mar', active: 1300, inactive: 40 },
    { name: 'Apr', active: 1280, inactive: 35 },
    { name: 'May', active: 1350, inactive: 30 },
    { name: 'Jun', active: 1400, inactive: 25 }
  ]

  const groupDistributionData = [
    { name: 'Youth Group', members: 150 },
    { name: 'Senior Group', members: 200 },
    { name: 'Women Group', members: 180 },
    { name: 'Men Group', members: 220 },
    { name: 'Children Group', members: 120 },
    { name: 'Volunteer Group', members: 80 }
  ]

  const rolePermissionsData = [
    { name: 'Read', count: 8 },
    { name: 'Write', count: 5 },
    { name: 'Delete', count: 3 },
    { name: 'Admin', count: 2 }
  ]

  const userRegistrationData = [
    { name: 'Week 1', registrations: 25 },
    { name: 'Week 2', registrations: 35 },
    { name: 'Week 3', registrations: 28 },
    { name: 'Week 4', registrations: 42 }
  ]

  const approvalStatusData = [
    { name: 'Approved', value: 85, color: '#dc2626' },
    { name: 'Pending', value: 12, color: '#ef4444' },
    { name: 'Rejected', value: 3, color: '#f87171' }
  ]

  // Communication Charts Data
  const engagementTypesData = [
    { name: 'Announcements', value: 45, color: '#dc2626' },
    { name: 'Events', value: 30, color: '#ef4444' },
    { name: 'Meetings', value: 20, color: '#f87171' },
    { name: 'Newsletters', value: 15, color: '#fca5a5' }
  ]

  const engagementStatusData = [
    { name: 'Jan', sent: 25, scheduled: 10, draft: 5 },
    { name: 'Feb', sent: 30, scheduled: 15, draft: 8 },
    { name: 'Mar', sent: 35, scheduled: 12, draft: 6 },
    { name: 'Apr', sent: 28, scheduled: 18, draft: 4 },
    { name: 'May', sent: 40, scheduled: 20, draft: 7 },
    { name: 'Jun', sent: 45, scheduled: 15, draft: 5 }
  ]

  const supportTicketData = [
    { name: 'Open', value: 8, color: '#dc2626' },
    { name: 'In Progress', value: 12, color: '#ef4444' },
    { name: 'Resolved', value: 45, color: '#f87171' },
    { name: 'Closed', value: 23, color: '#fca5a5' }
  ]

  const formSubmissionsData = [
    { name: 'Event Registration', submissions: 120 },
    { name: 'Volunteer Application', submissions: 85 },
    { name: 'Feedback Form', submissions: 200 },
    { name: 'Prayer Request', submissions: 150 }
  ]

  const calendarEventsData = [
    { name: 'Mon', events: 2 },
    { name: 'Tue', events: 3 },
    { name: 'Wed', events: 1 },
    { name: 'Thu', events: 4 },
    { name: 'Fri', events: 2 },
    { name: 'Sat', events: 5 },
    { name: 'Sun', events: 3 }
  ]

  // Contributions Charts Data
  const donationSourcesData = [
    { name: 'Online', value: 60, color: '#dc2626' },
    { name: 'Cash', value: 25, color: '#ef4444' },
    { name: 'Check', value: 10, color: '#f87171' },
    { name: 'Bank Transfer', value: 5, color: '#fca5a5' }
  ]

  const monthlyDonationsData = [
    { name: 'Jan', amount: 15000 },
    { name: 'Feb', amount: 18000 },
    { name: 'Mar', amount: 22000 },
    { name: 'Apr', amount: 19500 },
    { name: 'May', amount: 25000 },
    { name: 'Jun', amount: 28000 }
  ]

  const donationCategoriesData = [
    { name: 'Temple Maintenance', amount: 12000 },
    { name: 'Community Service', amount: 8000 },
    { name: 'Religious Events', amount: 15000 },
    { name: 'Charity', amount: 10000 },
    { name: 'Education', amount: 5000 }
  ]

  const requestStatusData = [
    { name: 'Approved', value: 15, color: '#dc2626' },
    { name: 'Pending', value: 8, color: '#ef4444' },
    { name: 'Under Review', value: 5, color: '#f87171' },
    { name: 'Rejected', value: 2, color: '#fca5a5' }
  ]

  const goalProgressData = [
    { name: 'Monthly Goal', progress: 78 },
    { name: 'Annual Goal', progress: 45 },
    { name: 'Special Project', progress: 92 }
  ]

  // Library Charts Data
  const libraryContentData = [
    { name: 'E-books', value: 1234, color: '#dc2626' },
    { name: 'Audio Books', value: 567, color: '#ef4444' },
    { name: 'Images', value: 345, color: '#f87171' },
    { name: 'Videos', value: 123, color: '#fca5a5' },
    { name: 'Documents', value: 187, color: '#fecaca' }
  ]

  const downloadStatsData = [
    { name: 'Jan', downloads: 450 },
    { name: 'Feb', downloads: 520 },
    { name: 'Mar', downloads: 480 },
    { name: 'Apr', downloads: 600 },
    { name: 'May', downloads: 750 },
    { name: 'Jun', downloads: 680 }
  ]

  const contentCategoriesData = [
    { name: 'Religious Texts', count: 800 },
    { name: 'Spiritual Guidance', count: 600 },
    { name: 'Historical', count: 400 },
    { name: 'Educational', count: 300 },
    { name: 'Cultural', count: 200 }
  ]

  const uploadActivityData = [
    { name: 'This Week', uploads: 15 },
    { name: 'Last Week', uploads: 12 },
    { name: 'This Month', uploads: 45 },
    { name: 'Last Month', uploads: 38 }
  ]

  const storageUsageData = [
    { name: 'Used', value: 65, color: '#dc2626' },
    { name: 'Available', value: 35, color: '#f87171' }
  ]

  const renderChart = (title: string, children: React.ReactNode, icon?: React.ReactNode) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-red-600">{icon}</div>}
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="-mx-2 sm:mx-0">
          {children}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-red-50 to-orange-45 rounded-xl p-6 border border-red-100 mb-6 overflow-hidden pl-24 sm:pl-28">
          <div className="absolute left-4 top-4 opacity-70">
            <img
              src="/sai-baba-blessing-devotees-in-temple-setting-with-.png"
              alt="Sai Baba blessing devotees"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
            />
          </div>
          <div className="relative z-10 ml-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Overview of key metrics and temple activity
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap gap-2 mb-4 sm:mb-6 h-auto p-2">
            <TabsTrigger value="hub" className="flex items-center justify-center whitespace-nowrap space-x-2 flex-1 sm:flex-initial px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base">
              <BarChart3 className="h-4 w-4" />
              <span>Hub</span>
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center justify-center whitespace-nowrap space-x-2 flex-1 sm:flex-initial px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base">
              <Users className="h-4 w-4" />
              <span>Identity</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center justify-center whitespace-nowrap space-x-2 flex-1 sm:flex-initial px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base">
              <MessageSquare className="h-4 w-4" />
              <span>Communication</span>
            </TabsTrigger>
            <TabsTrigger value="contributions" className="flex items-center justify-center whitespace-nowrap space-x-2 flex-1 sm:flex-initial px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base">
              <Heart className="h-4 w-4" />
              <span>Contributions</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center justify-center whitespace-nowrap space-x-2 flex-1 sm:flex-initial px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base">
              <BookOpen className="h-4 w-4" />
              <span>Library</span>
            </TabsTrigger>
          </TabsList>

          {/* Hub Tab */}
          <TabsContent value="hub" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChart("System Health Overview", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={systemHealthTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cpu" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="memory" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="storage" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="network" stackId="1" stroke="#fca5a5" fill="#fca5a5" fillOpacity={0.6} />
                  </RechartsAreaChart>
                </ResponsiveContainer>, 
                <Activity className="h-5 w-5" />
              )}

              {renderChart("User Activity Trend", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#dc2626" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>, 
                <TrendingUp className="h-5 w-5" />
              )}

              {renderChart("Notification Distribution", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={notificationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100).toFixed(0))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {notificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Bell className="h-5 w-5" />
              )}

              {renderChart("Active Sessions", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sessionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sessionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Users className="h-5 w-5" />
              )}
            </div>
          </TabsContent>

          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChart("User Role Distribution", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Users className="h-5 w-5" />
              )}

              {renderChart("User Status Trend", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={userStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#dc2626" fill="#dc2626" />
                    <Area type="monotone" dataKey="inactive" stackId="1" stroke="#f87171" fill="#f87171" />
                  </RechartsAreaChart>
                </ResponsiveContainer>, 
                <TrendingUp className="h-5 w-5" />
              )}

              {renderChart("Group Member Distribution", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={groupDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="members" fill="#f87171" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <Users className="h-5 w-5" />
              )}

              {renderChart("Role Permissions", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={rolePermissionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#fca5a5" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <Shield className="h-5 w-5" />
              )}

              {renderChart("Weekly User Registrations", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={userRegistrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="registrations" stroke="#f87171" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>, 
                <UserPlus className="h-5 w-5" />
              )}

              {renderChart("Approval Status", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={approvalStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100).toFixed(0))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {approvalStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <CheckCircle className="h-5 w-5" />
              )}
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChart("Engagement Types", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={engagementTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Megaphone className="h-5 w-5" />
              )}

              {renderChart("Engagement Status Trend", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={engagementStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#dc2626" fill="#dc2626" />
                    <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="draft" stackId="1" stroke="#f87171" fill="#f87171" />
                  </RechartsAreaChart>
                </ResponsiveContainer>, 
                <TrendingUp className="h-5 w-5" />
              )}

              {renderChart("Support Ticket Status", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={supportTicketData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {supportTicketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <MessageSquare className="h-5 w-5" />
              )}

              {renderChart("Form Submissions", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={formSubmissionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#f87171" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <FileText className="h-5 w-5" />
              )}

              {renderChart("Weekly Calendar Events", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={calendarEventsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#f87171" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>, 
                <Calendar className="h-5 w-5" />
              )}
            </div>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChart("Donation Sources", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={donationSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100).toFixed(0))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {donationSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <DollarSign className="h-5 w-5" />
              )}

              {renderChart("Monthly Donations Trend", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={monthlyDonationsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Area type="monotone" dataKey="amount" stroke="#dc2626" fill="#dc2626" />
                  </RechartsAreaChart>
                </ResponsiveContainer>, 
                <TrendingUp className="h-5 w-5" />
              )}

              {renderChart("Donation Categories", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={donationCategoriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#ef4444" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <Heart className="h-5 w-5" />
              )}

              {renderChart("Request Status", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <CheckCircle className="h-5 w-5" />
              )}

              {renderChart("Goal Progress", 
                <div className="space-y-4">
                  {goalProgressData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </div>, 
                <TrendingUp className="h-5 w-5" />
              )}
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChart("Content Distribution", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={libraryContentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {libraryContentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Library className="h-5 w-5" />
              )}

              {renderChart("Download Statistics", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={downloadStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="downloads" stroke="#dc2626" fill="#dc2626" />
                  </RechartsAreaChart>
                </ResponsiveContainer>, 
                <Download className="h-5 w-5" />
              )}

              {renderChart("Content Categories", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={contentCategoriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f87171" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <BookOpen className="h-5 w-5" />
              )}

              {renderChart("Upload Activity", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={uploadActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#fca5a5" />
                  </RechartsBarChart>
                </ResponsiveContainer>, 
                <Upload className="h-5 w-5" />
              )}

              {renderChart("Storage Usage", 
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={storageUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100).toFixed(0))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {storageUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>, 
                <Activity className="h-5 w-5" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
