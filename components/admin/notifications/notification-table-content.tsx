"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check, Eye, Trash2, Clock, Bell, BellOff } from "lucide-react"
import { useNotificationStore } from "@/stores/notification-store"

interface NotificationTableContentProps {
  searchTerm: string
  statusFilter: string
  typeFilter: string
  viewMode: "table" | "card"
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800"
}

const typeColors = {
  member: "bg-blue-100 text-blue-800",
  donation: "bg-pink-100 text-pink-800",
  event: "bg-yellow-100 text-yellow-800",
  volunteer: "bg-purple-100 text-purple-800",
  system: "bg-indigo-100 text-indigo-800",
  library: "bg-green-100 text-green-800"
}

export function NotificationTableContent({ searchTerm, statusFilter, typeFilter, viewMode }: NotificationTableContentProps) {
  const { 
    filteredNotifications, 
    selectedNotifications, 
    toggleNotificationSelection, 
    markAsRead, 
    deleteNotification,
    openDrawer 
  } = useNotificationStore()

  const notifications = filteredNotifications()

  const handleSelectNotification = (id: number, checked: boolean) => {
    if (checked) {
      toggleNotificationSelection(id)
    } else {
      toggleNotificationSelection(id)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      notifications.forEach(notification => {
        if (!selectedNotifications.includes(notification.id)) {
          toggleNotificationSelection(notification.id)
        }
      })
    } else {
      notifications.forEach(notification => {
        if (selectedNotifications.includes(notification.id)) {
          toggleNotificationSelection(notification.id)
        }
      })
    }
  }

  if (viewMode === "card") {
    return (
      <div className="p-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm ? "Try adjusting your search criteria" : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                  notification.unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => openDrawer("view", notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                      </div>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${priorityColors[notification.priority as keyof typeof priorityColors]}`}
                      >
                        {notification.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${typeColors[notification.type as keyof typeof typeColors]}`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={notifications.length > 0 && notifications.every(n => selectedNotifications.includes(n.id))}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold">NOTIFICATION</TableHead>
            <TableHead className="font-semibold">TYPE</TableHead>
            <TableHead className="font-semibold">PRIORITY</TableHead>
            <TableHead className="font-semibold">STATUS</TableHead>
            <TableHead className="font-semibold">TIME</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Try adjusting your search criteria" : "You're all caught up!"}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow 
                key={notification.id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  notification.unread ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => openDrawer("view", notification)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${typeColors[notification.type as keyof typeof typeColors]}`}
                  >
                    {notification.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${priorityColors[notification.priority as keyof typeof priorityColors]}`}
                  >
                    {notification.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={notification.unread ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {notification.unread ? "Unread" : "Read"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {notification.time}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        openDrawer("view", notification)
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {notification.unread && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
