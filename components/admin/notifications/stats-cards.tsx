"use client"

import { Bell, BellOff, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { useNotificationStore } from "@/stores/notification-store"

const stats = [
  {
    title: "Total Notifications",
    count: 0,
    icon: Bell,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500",
  },
  {
    title: "Unread",
    count: 0,
    icon: BellOff,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500",
  },
  {
    title: "High Priority",
    count: 0,
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500",
  },
  {
    title: "Read",
    count: 0,
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
  },
  {
    title: "Today",
    count: 0,
    icon: Clock,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500",
  },
  {
    title: "System",
    count: 0,
    icon: Users,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-500",
  },
]

export function StatsCards() {
  const { notifications, isLoading } = useNotificationStore()

  // Calculate stats from notifications
  const totalNotifications = notifications.length
  const unreadCount = notifications.filter(n => n.unread).length
  const highPriorityCount = notifications.filter(n => n.priority === "high").length
  const readCount = notifications.filter(n => !n.unread).length
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayCount = notifications.filter(n => {
    const notificationDate = new Date(n.timestamp)
    notificationDate.setHours(0, 0, 0, 0)
    return notificationDate.getTime() === today.getTime()
  }).length
  
  const systemCount = notifications.filter(n => n.type === "system").length

  const calculatedStats = [
    { ...stats[0], count: totalNotifications },
    { ...stats[1], count: unreadCount },
    { ...stats[2], count: highPriorityCount },
    { ...stats[3], count: readCount },
    { ...stats[4], count: todayCount },
    { ...stats[5], count: systemCount },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 animate-pulse"
          >
            <div className="flex items-center justify-between pl-2">
              <div className="min-w-0 flex-1">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
      {calculatedStats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer group transform-gpu will-change-transform"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.bgColor} group-hover:w-2 transition-all duration-300`}
            />

            <div className="flex items-center justify-between pl-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground transition-colors duration-300 origin-left">
                  {stat.count}
                </p>
              </div>
              <Icon
                className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${stat.color} flex-shrink-0 ml-1 sm:ml-2 group-hover:rotate-12 transition-all duration-300 transform-gpu`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
