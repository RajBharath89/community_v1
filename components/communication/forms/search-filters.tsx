"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Eye,
  EyeOff,
  List,
  Grid,
  Filter,
  FileText,
  CheckCircle,
  Archive,
  Clock,
  ArrowUpDown,
  ClipboardList,
  MessageSquare,
  UserCheck,
  Calendar,
  Trophy,
} from "lucide-react"
import { useFormStore } from "@/stores/form-store"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Published":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Draft":
      return <FileText className="h-4 w-4 text-gray-500" />
    case "Archived":
      return <Archive className="h-4 w-4 text-orange-500" />
    case "Expired":
      return <Clock className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getFormTypeIcon = (type: string) => {
  switch (type) {
    case "Survey":
      return <ClipboardList className="h-4 w-4 text-red-500" />
    case "Registration":
      return <UserCheck className="h-4 w-4 text-green-500" />
    case "Feedback":
      return <MessageSquare className="h-4 w-4 text-purple-500" />
    case "Application":
      return <FileText className="h-4 w-4 text-orange-500" />
    case "RSVP":
      return <Calendar className="h-4 w-4 text-indigo-500" />
    case "Volunteer":
      return <Trophy className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

export function SearchFilters() {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    formTypeFilter,
    setFormTypeFilter,
    viewMode,
    setViewMode,
    showSensitiveFields,
    toggleSensitiveFields,
    openAdvancedFilter,
    sortField,
    sortDirection,
    setSorting,
  } = useFormStore()

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "status", label: "Status" },
    { value: "formType", label: "Form Type" },
    { value: "createdDate", label: "Created Date" },
    { value: "publishedDate", label: "Published Date" },
    { value: "submissionCount", label: "Submissions" },
    { value: "completionRate", label: "Completion Rate" },
    { value: "createdBy", label: "Created By" },
  ]

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-")
    setSorting(field, direction as "asc" | "desc")
  }

  return (
    <div className="p-3 sm:p-4 border-b border-gray-200">
      <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex-1 transition-all duration-300 hover:scale-[1.02] group transform-gpu">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-300 group-hover:text-red-500" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all duration-300 hover:bg-muted/70 hover:shadow-md"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:rotate-12 transform-gpu"
            onClick={toggleSensitiveFields}
            title={showSensitiveFields ? "Hide sensitive fields" : "Show sensitive fields"}
          >
            {showSensitiveFields ? (
              <EyeOff className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <Eye className="h-4 w-4 transition-transform duration-300" />
            )}
          </Button>
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
              <SelectItem value="All Status">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>All Status</span>
                </div>
              </SelectItem>
              <SelectItem value="Published">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Published</span>
                </div>
              </SelectItem>
              <SelectItem value="Draft">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Draft</span>
                </div>
              </SelectItem>
              <SelectItem value="Archived">
                <div className="flex items-center space-x-2">
                  <Archive className="h-4 w-4 text-orange-500" />
                  <span>Archived</span>
                </div>
              </SelectItem>
              <SelectItem value="Expired">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>Expired</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
            <SelectTrigger className="w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>All Types</span>
                </div>
              </SelectItem>
              <SelectItem value="Survey">
                <div className="flex items-center space-x-2">
                  <ClipboardList className="h-4 w-4 text-red-500" />
                  <span>Survey</span>
                </div>
              </SelectItem>
              <SelectItem value="Registration">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span>Registration</span>
                </div>
              </SelectItem>
              <SelectItem value="Feedback">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span>Feedback</span>
                </div>
              </SelectItem>
              <SelectItem value="Application">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Application</span>
                </div>
              </SelectItem>
              <SelectItem value="RSVP">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span>RSVP</span>
                </div>
              </SelectItem>
              <SelectItem value="Volunteer">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-red-500" />
                  <span>Volunteer</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

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
