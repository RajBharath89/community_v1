"use client"

import { useBroadcastStore } from "@/stores/broadcast-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Download, Users, Eye, MousePointer, Send, Mail, Bell, Smartphone, Target } from "lucide-react"

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]

export function AnalyticsDashboard() {
  const { broadcasts } = useBroadcastStore()

  // Calculate metrics
  const sentBroadcasts = broadcasts.filter((b) => b.status === "Sent")
  const totalRecipients = sentBroadcasts.reduce((sum, b) => sum + b.totalRecipients, 0)
  const totalDelivered = sentBroadcasts.reduce((sum, b) => sum + b.deliveredCount, 0)
  const totalReads = sentBroadcasts.reduce((sum, b) => sum + b.readCount, 0)
  const totalClicks = sentBroadcasts.reduce((sum, b) => sum + b.clickCount, 0)

  const deliveryRate = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "0"
  const readRate = totalDelivered > 0 ? ((totalReads / totalDelivered) * 100).toFixed(1) : "0"
  const clickRate = totalReads > 0 ? ((totalClicks / totalReads) * 100).toFixed(1) : "0"

  // Performance over time data
  const performanceData = sentBroadcasts.slice(-7).map((broadcast) => ({
    name: broadcast.title.substring(0, 15) + "...",
    delivered: broadcast.deliveredCount,
    reads: broadcast.readCount,
    clicks: broadcast.clickCount,
    deliveryRate:
      broadcast.totalRecipients > 0 ? ((broadcast.deliveredCount / broadcast.totalRecipients) * 100).toFixed(1) : 0,
  }))

  // Priority distribution
  const priorityData = [
    { name: "Urgent", value: broadcasts.filter((b) => b.priority === "Urgent").length, color: "#ef4444" },
    { name: "Normal", value: broadcasts.filter((b) => b.priority === "Normal").length, color: "#3b82f6" },
    { name: "Informational", value: broadcasts.filter((b) => b.priority === "Informational").length, color: "#22c55e" },
  ]

  // Channel performance
  const channelData = [
    {
      name: "In-App",
      broadcasts: broadcasts.filter((b) => b.deliveryChannels.includes("in-app")).length,
      avgDelivery: 95.2,
      avgRead: 78.5,
      icon: Bell,
      color: "text-blue-500",
    },
    {
      name: "Email",
      broadcasts: broadcasts.filter((b) => b.deliveryChannels.includes("email")).length,
      avgDelivery: 87.3,
      avgRead: 45.2,
      icon: Mail,
      color: "text-green-500",
    },
    {
      name: "SMS",
      broadcasts: broadcasts.filter((b) => b.deliveryChannels.includes("sms")).length,
      avgDelivery: 98.1,
      avgRead: 92.7,
      icon: Smartphone,
      color: "text-purple-500",
    },
  ]

  // Top performing broadcasts
  const topBroadcasts = [...sentBroadcasts]
    .sort((a, b) => b.readCount / Math.max(b.deliveredCount, 1) - a.readCount / Math.max(a.deliveredCount, 1))
    .slice(0, 5)

  const handleExportAnalytics = () => {
    // Export analytics data to Excel
    const analyticsData = sentBroadcasts.map((broadcast) => ({
      Title: broadcast.title,
      Priority: broadcast.priority,
      "Message Type": broadcast.messageType,
      "Total Recipients": broadcast.totalRecipients,
      "Delivered Count": broadcast.deliveredCount,
      "Read Count": broadcast.readCount,
      "Click Count": broadcast.clickCount,
      "Delivery Rate":
        broadcast.totalRecipients > 0
          ? `${((broadcast.deliveredCount / broadcast.totalRecipients) * 100).toFixed(1)}%`
          : "0%",
      "Read Rate":
        broadcast.deliveredCount > 0 ? `${((broadcast.readCount / broadcast.deliveredCount) * 100).toFixed(1)}%` : "0%",
      "Click Rate":
        broadcast.readCount > 0 ? `${((broadcast.clickCount / broadcast.readCount) * 100).toFixed(1)}%` : "0%",
      "Sent Date": broadcast.sentDate,
      "Created By": broadcast.createdBy,
    }))

    // Create and download Excel file (similar to user export)
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(analyticsData)

      // Set column widths
      const colWidths = [
        { wch: 30 }, // Title
        { wch: 12 }, // Priority
        { wch: 15 }, // Message Type
        { wch: 15 }, // Total Recipients
        { wch: 15 }, // Delivered Count
        { wch: 12 }, // Read Count
        { wch: 12 }, // Click Count
        { wch: 12 }, // Delivery Rate
        { wch: 10 }, // Read Rate
        { wch: 10 }, // Click Rate
        { wch: 12 }, // Sent Date
        { wch: 15 }, // Created By
      ]
      ws["!cols"] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, "Broadcast Analytics")

      const filename = `broadcast-analytics-${new Date().toISOString().split("T")[0]}.xlsx`
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbout], { type: "application/octet-stream" })

      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive broadcast performance insights</p>
        </div>
        <Button onClick={handleExportAnalytics} className="bg-red-500 hover:bg-red-600">
          <Download className="h-4 w-4 mr-2" />
          Export Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-3xl font-bold text-green-600">{deliveryRate}%</p>
                <p className="text-xs text-gray-500">{totalDelivered.toLocaleString()} delivered</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read Rate</p>
                <p className="text-3xl font-bold text-blue-600">{readRate}%</p>
                <p className="text-xs text-gray-500">{totalReads.toLocaleString()} reads</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-3xl font-bold text-purple-600">{clickRate}%</p>
                <p className="text-xs text-gray-500">{totalClicks.toLocaleString()} clicks</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-3xl font-bold text-red-600">{totalRecipients.toLocaleString()}</p>
                <p className="text-xs text-gray-500">recipients reached</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area type="monotone" dataKey="reads" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="clicks" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-red-500" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel) => {
                const Icon = channel.icon
                return (
                  <div
                    key={channel.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className={`h-4 w-4 ${channel.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-sm text-gray-500">{channel.broadcasts} broadcasts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Delivery: {channel.avgDelivery}%</p>
                      <p className="text-sm text-gray-500">Read: {channel.avgRead}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Broadcasts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Top Performing Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBroadcasts.map((broadcast, index) => {
                const readRate =
                  broadcast.deliveredCount > 0
                    ? ((broadcast.readCount / broadcast.deliveredCount) * 100).toFixed(1)
                    : "0"
                return (
                  <div
                    key={broadcast.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{broadcast.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              broadcast.priority === "Urgent"
                                ? "text-red-600 border-red-200"
                                : broadcast.priority === "Normal"
                                  ? "text-blue-600 border-blue-200"
                                  : "text-green-600 border-green-200"
                            }`}
                          >
                            {broadcast.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{readRate}% read</p>
                      <p className="text-xs text-gray-500">{broadcast.readCount} reads</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
