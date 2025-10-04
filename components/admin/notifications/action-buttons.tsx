"use client"

import { Button } from "@/components/ui/button"
import { Download, Trash2, Check } from "lucide-react"
import { useNotificationStore } from "@/stores/notification-store"

export function ActionButtons() {
  const { selectedNotifications, markAllAsRead, deleteSelected, filteredNotifications } = useNotificationStore()

  const handleExportNotifications = () => {
    const notifications = filteredNotifications()
    
    const exportData = notifications.map((notification) => ({
      Title: notification.title,
      Message: notification.message,
      Type: notification.type,
      Priority: notification.priority,
      Status: notification.unread ? "Unread" : "Read",
      Time: notification.time,
      Timestamp: notification.timestamp.toISOString(),
    }))

    const csvContent = [
      Object.keys(exportData[0] || {}).join(","),
      ...exportData.map(row => Object.values(row).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    
    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `notifications-${currentDate}.csv`
    
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleDeleteSelected = () => {
    if (selectedNotifications.length > 0) {
      deleteSelected()
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <Button
        onClick={handleMarkAllAsRead}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Check className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Mark All Read</span>
        <span className="md:hidden">Mark Read</span>
      </Button>
      <Button
        onClick={handleExportNotifications}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
      {selectedNotifications.length > 0 && (
        <Button
          onClick={handleDeleteSelected}
          variant="outline"
          className="flex items-center justify-center space-x-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
        >
          <Trash2 className="h-4 w-4 group-hover:rotate-12 transition-all duration-300 transform-gpu" />
          <span className="hidden md:inline">Delete Selected ({selectedNotifications.length})</span>
          <span className="md:hidden">Delete ({selectedNotifications.length})</span>
        </Button>
      )}
    </div>
  )
}
