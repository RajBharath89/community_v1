"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  List,
  Grid,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  LifeBuoy,
  Bug,
  DollarSign,
  User,
  Settings,
  Lightbulb,
  ArrowUpDown,
} from "lucide-react"
import { useSupportTicketStore } from "@/stores/support-ticket-store"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  priorityFilter: string
  setPriorityFilter: (priority: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  viewMode: "table" | "card"
  setViewMode: (mode: "table" | "card") => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Open":
      return <CheckCircle className="h-4 w-4 text-blue-500" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "Resolved":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Closed":
      return <XCircle className="h-4 w-4 text-gray-500" />
    case "Pending":
      return <Clock className="h-4 w-4 text-purple-500" />
    default:
      return <LifeBuoy className="h-4 w-4 text-gray-500" />
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "High":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case "Medium":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "Low":
      return <AlertTriangle className="h-4 w-4 text-green-500" />
    default:
      return <LifeBuoy className="h-4 w-4 text-gray-500" />
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Technical":
      return <Settings className="h-4 w-4 text-blue-500" />
    case "General":
      return <LifeBuoy className="h-4 w-4 text-gray-500" />
    case "Account":
      return <User className="h-4 w-4 text-purple-500" />
    case "Billing":
      return <DollarSign className="h-4 w-4 text-green-500" />
    case "Feature Request":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />
    case "Bug Report":
      return <Bug className="h-4 w-4 text-red-500" />
    default:
      return <LifeBuoy className="h-4 w-4 text-gray-500" />
  }
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  viewMode,
  setViewMode,
}: SearchFiltersProps) {
  const { openAdvancedFilter, sortField, sortDirection, setSorting } = useSupportTicketStore()

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "category", label: "Category" },
    { value: "createdDate", label: "Created Date" },
    { value: "updatedDate", label: "Updated Date" },
  ]

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-")
    setSorting(field, direction as "asc" | "desc")
  }

  return (
    <div className="p-3 sm:p-4 border-b border-gray-200">
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="relative flex-1 transition-all duration-300 hover:scale-[1.02] group transform-gpu">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-300 group-hover:text-red-500" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all duration-300 hover:bg-muted/70 hover:shadow-md"
            />
          </div>
        </div>

        {/* Filters and Controls - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0">
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
            <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">
                <div className="flex items-center space-x-2">
                  <LifeBuoy className="h-4 w-4 text-gray-500" />
                  <span>All Status</span>
                </div>
              </SelectItem>
              <SelectItem value="Open">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Open</span>
                </div>
              </SelectItem>
              <SelectItem value="In Progress">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>In Progress</span>
                </div>
              </SelectItem>
              <SelectItem value="Resolved">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Resolved</span>
                </div>
              </SelectItem>
              <SelectItem value="Closed">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  <span>Closed</span>
                </div>
              </SelectItem>
              <SelectItem value="Pending">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>Pending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Priority">
                <div className="flex items-center space-x-2">
                  <LifeBuoy className="h-4 w-4 text-gray-500" />
                  <span>All Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="Critical">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Critical</span>
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="Medium">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="Low">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-green-500" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">
                <div className="flex items-center space-x-2">
                  <LifeBuoy className="h-4 w-4 text-gray-500" />
                  <span>All Categories</span>
                </div>
              </SelectItem>
              <SelectItem value="Technical">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-blue-500" />
                  <span>Technical</span>
                </div>
              </SelectItem>
              <SelectItem value="General">
                <div className="flex items-center space-x-2">
                  <LifeBuoy className="h-4 w-4 text-gray-500" />
                  <span>General</span>
                </div>
              </SelectItem>
              <SelectItem value="Account">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span>Account</span>
                </div>
              </SelectItem>
              <SelectItem value="Billing">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>Billing</span>
                </div>
              </SelectItem>
              <SelectItem value="Feature Request">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>Feature Request</span>
                </div>
              </SelectItem>
              <SelectItem value="Bug Report">
                <div className="flex items-center space-x-2">
                  <Bug className="h-4 w-4 text-red-500" />
                  <span>Bug Report</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "card" && (
            <Select value={`${sortField}-${sortDirection}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-40 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
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

          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transform-gpu"
            onClick={openAdvancedFilter}
          >
            <Filter className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-red-500" />
            <span className="transition-colors duration-300 group-hover:text-red-600">Advanced</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
