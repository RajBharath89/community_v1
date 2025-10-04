"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List, X, Users } from "lucide-react"
import { useDonationStore } from "@/stores/donation-store"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  viewMode: "table" | "card"
  setViewMode: (mode: "table" | "card") => void
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
}: SearchFiltersProps) {
  const { openAdvancedFilter, isAdvancedFilterOpen } = useDonationStore()

  const statusOptions = ["All Status", "pending", "reviewed", "approved", "rejected", "received", "distributed"]
  const typeOptions = ["All Types", "online", "offline", "material"]

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All Status")
    setTypeFilter("All Types")
  }

  const hasActiveFilters = searchTerm || statusFilter !== "All Status" || typeFilter !== "All Types"

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by donor name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-0 bg-gray-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* View Mode Toggle */}
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
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{status === "All Status" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-36 whitespace-nowrap transition-all duration-300 hover:shadow-md hover:bg-muted/50 transform-gpu">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{type === "All Types" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filter Button */}
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:bg-red-50 hover:border-red-300 group transform-gpu"
            onClick={openAdvancedFilter}
          >
            <Filter className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-red-500" />
            <span className="transition-colors duration-300 group-hover:text-red-600">Advanced</span>
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 border-0 bg-muted/50 hover:bg-muted/70 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
