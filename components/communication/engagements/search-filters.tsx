"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  List,
  Grid,
  Filter,
  Send,
  Clock,
  FileText,
  AlertTriangle,
  ArrowUpDown,
  Megaphone,
  Calendar,
  Bell,
  Zap,
  Users,
} from "lucide-react"
import { useEngagementStore } from "@/stores/engagement-store"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Sent":
      return <Send className="h-4 w-4 text-green-500" />
    case "Scheduled":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "Draft":
      return <FileText className="h-4 w-4 text-gray-500" />
    case "Failed":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Megaphone className="h-4 w-4 text-gray-500" />
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return <Zap className="h-4 w-4 text-red-500" />
    case "High":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case "Normal":
      return <Bell className="h-4 w-4 text-blue-500" />
    case "Low":
      return <Bell className="h-4 w-4 text-gray-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case "Event":
      return <Calendar className="h-4 w-4 text-purple-500" />
    case "Alert":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "Newsletter":
      return <FileText className="h-4 w-4 text-blue-500" />
    case "Announcement":
      return <Megaphone className="h-4 w-4 text-green-500" />
    case "Meeting":
      return <Users className="h-4 w-4 text-indigo-500" />
    default:
      return <Megaphone className="h-4 w-4 text-gray-500" />
  }
}

export function SearchFilters() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    toggleSort,
    setAdvancedFilterOpen,
  } = useEngagementStore()

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "messageType", label: "Message Type" },
    { value: "createdDate", label: "Created Date" },
    { value: "scheduledDate", label: "Scheduled Date" },
    { value: "sentDate", label: "Sent Date" },
    { value: "totalRecipients", label: "Recipients" },
    { value: "deliveryRate", label: "Delivery Rate" },
    { value: "readRate", label: "Read Rate" },
    { value: "createdBy", label: "Created By" },
  ]

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [
      | "title"
      | "status"
      | "priority"
      | "messageType"
      | "totalRecipients"
      | "createdDate"
      | "deliveryRate"
      | "readRate",
      "asc" | "desc"
    ]
    // First call sets the field and defaults direction to asc when changing fields
    if (sortField !== field || sortDirection !== direction) {
      toggleSort(field)
      // If we need desc, toggle again
      if (direction === "desc") {
        // After first toggle, field === field and direction === asc
        toggleSort(field)
      }
    }
  }

  return (
    <div className="p-3 sm:p-4 border-b border-gray-200">
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex-1 transition-all duration-300 hover:scale-[1.02] group transform-gpu">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-300 group-hover:text-red-500" />
            <Input
              placeholder="Search engagements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all duration-300 hover:bg-muted/70 hover:shadow-md"
            />
          </div>
          {/* Sensitive fields toggle not used in engagements */}
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          {viewMode === "card" && (
            <Select value={`${sortField}-${sortDirection}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <div key={option.value}>
                    <SelectItem value={`${option.value}-asc`}>
                      <span>{option.label} (A-Z)</span>
                    </SelectItem>
                    <SelectItem value={`${option.value}-desc`}>
                      <span>{option.label} (Z-A)</span>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-md p-1 transition-all duration-300 hover:shadow-md hover:bg-gray-200 transform-gpu">
            <Button
              variant="ghost"
              size="icon"
              className={
                viewMode === "table"
                  ? "bg-red-500 text-white hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg transform-gpu"
                  : "hover:bg-gray-200 transition-all duration-300 transform-gpu"
              }
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={
                viewMode === "card"
                  ? "bg-red-500 text-white hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg transform-gpu"
                  : "hover:bg-gray-200 transition-all duration-300 transform-gpu"
              }
              onClick={() => setViewMode("card")}
            >
              <Grid className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            </Button>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-gray-500" />
                  <span>All Status</span>
                </div>
              </SelectItem>
              <SelectItem value="Sent">
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4 text-green-500" />
                  <span>Sent</span>
                </div>
              </SelectItem>
              <SelectItem value="Scheduled">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Scheduled</span>
                </div>
              </SelectItem>
              <SelectItem value="Draft">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Draft</span>
                </div>
              </SelectItem>
              <SelectItem value="Failed">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Failed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>All Priorities</span>
                </div>
              </SelectItem>
              <SelectItem value="Urgent">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <span>Urgent</span>
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="Normal">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span>Normal</span>
                </div>
              </SelectItem>
              <SelectItem value="Low">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={messageTypeFilter} onValueChange={setMessageTypeFilter}>
            <SelectTrigger className="w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-gray-500" />
                  <span>All Types</span>
                </div>
              </SelectItem>
              <SelectItem value="Announcement">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-green-500" />
                  <span>Announcement</span>
                </div>
              </SelectItem>
              <SelectItem value="Event">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>Event</span>
                </div>
              </SelectItem>
              <SelectItem value="Meeting">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>Meeting</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transform-gpu"
            onClick={() => setAdvancedFilterOpen(true)}
          >
            <Filter className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-red-500" />
            <span className="transition-colors duration-300 group-hover:text-red-600">Advanced</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
