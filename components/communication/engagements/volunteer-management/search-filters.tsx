"use client"

import { useState } from "react"
import { useVolunteerStore } from "@/stores/volunteer-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, X, Eye, List, Grid3X3 } from "lucide-react"

export function VolunteerSearchFilters() {
  const {
    searchQuery,
    statusFilter,
    engagementFilter,
    roleFilter,
    viewMode,
    setSearchQuery,
    setStatusFilter,
    setEngagementFilter,
    setRoleFilter,
    setViewMode,
    setAdvancedFilterOpen,
    applications
  } = useVolunteerStore()

  const [showFilters, setShowFilters] = useState(false)

  // Get unique engagements and roles for filter options
  const uniqueEngagements = Array.from(
    new Map(applications.map(app => [app.engagementId, { id: app.engagementId, title: app.engagementTitle }])).values()
  )
  const uniqueRoles = Array.from(
    new Map(applications.map(app => [app.roleId, { id: app.roleId, title: app.roleTitle }])).values()
  )

  const hasActiveFilters = 
    searchQuery || 
    statusFilter !== "all" || 
    engagementFilter !== "all" || 
    roleFilter !== "all"

  const clearAllFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setEngagementFilter("all")
    setRoleFilter("all")
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {/* View Toggle Buttons */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none border-r"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Advanced Filter Button */}
          <Button
            variant="outline"
            onClick={() => setAdvancedFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced
          </Button>
        </div>
      </div>

    </div>
  )
}
