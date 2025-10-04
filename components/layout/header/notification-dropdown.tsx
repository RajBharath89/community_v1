"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const notifications = [
  {
    id: 1,
    title: "New Member Registration",
    message: "Krishna Das has registered as a new devotee",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Donation Received",
    message: "₹5,000 donation received from Amit Patel",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Event Reminder",
    message: "Aarti ceremony starts in 30 minutes",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "Volunteer Request",
    message: "Help needed for tomorrow's festival preparation",
    time: "1 day ago",
    unread: false,
  },
]

export function NotificationDropdown() {
  const [unreadCount] = useState(notifications.filter((n) => n.unread).length)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 text-xs bg-transparent mx-2 my-1">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 p-0">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-col items-start p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="p-2">
          <Link href="/admin/notifications">
            <div className="text-center text-sm text-blue-600 cursor-pointer hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors">
              View all notifications
            </div>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
