"use client"

import { useBroadcastStore } from "@/stores/broadcast-store"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Megaphone, Send, Clock, CheckCircle, AlertTriangle, Users, Eye, MousePointer } from "lucide-react"

export function StatsCards() {
  const { broadcasts, isLoading } = useBroadcastStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalBroadcasts = broadcasts.length
  const sentBroadcasts = broadcasts.filter((b) => b.status === "Sent").length
  const scheduledBroadcasts = broadcasts.filter((b) => b.status === "Scheduled").length
  const draftBroadcasts = broadcasts.filter((b) => b.status === "Draft").length
  const urgentBroadcasts = broadcasts.filter((b) => b.priority === "Urgent").length

  const totalRecipients = broadcasts.reduce((sum, b) => sum + b.totalRecipients, 0)
  const totalDelivered = broadcasts.reduce((sum, b) => sum + b.deliveredCount, 0)
  const totalReads = broadcasts.reduce((sum, b) => sum + b.readCount, 0)
  const totalClicks = broadcasts.reduce((sum, b) => sum + b.clickCount, 0)

  const stats = [
    {
      title: "Total Engagements",
      value: totalBroadcasts,
      icon: <Megaphone className="h-5 w-5" />,
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Sent",
      value: sentBroadcasts,
      icon: <Send className="h-5 w-5" />,
      bgColor: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Scheduled",
      value: scheduledBroadcasts,
      icon: <Clock className="h-5 w-5" />,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      title: "Drafts",
      value: draftBroadcasts,
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: "bg-gray-500",
      textColor: "text-gray-600",
      bgLight: "bg-gray-50",
    },
    // {
    //   title: "Urgent",
    //   value: urgentBroadcasts,
    //   icon: <AlertTriangle className="h-5 w-5" />,
    //   bgColor: "bg-red-500",
    //   textColor: "text-red-600",
    //   bgLight: "bg-red-50",
    // },
    // {
    //   title: "Total Recipients",
    //   value: totalRecipients.toLocaleString(),
    //   icon: <Users className="h-5 w-5" />,
    //   bgColor: "bg-purple-500",
    //   textColor: "text-purple-600",
    //   bgLight: "bg-purple-50",
    // },
    // {
    //   title: "Total Reads",
    //   value: totalReads.toLocaleString(),
    //   icon: <Eye className="h-5 w-5" />,
    //   bgColor: "bg-indigo-500",
    //   textColor: "text-indigo-600",
    //   bgLight: "bg-indigo-50",
    // },
    // {
    //   title: "Total Clicks",
    //   value: totalClicks.toLocaleString(),
    //   icon: <MousePointer className="h-5 w-5" />,
    //   bgColor: "bg-teal-500",
    //   textColor: "text-teal-600",
    //   bgLight: "bg-teal-50",
    // },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer group"
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.bgColor}`} />

          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                <div className={`${stat.textColor} group-hover:rotate-12 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
