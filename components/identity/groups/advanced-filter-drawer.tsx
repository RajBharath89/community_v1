"use client"

import { useState, useEffect } from "react"
import { useGroupStore } from "@/stores/group-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  Calendar,
  Users,
  Building,
  CheckCircle,
  XCircle,
  UserCheck,
  UserPlus,
  Shuffle,
  RotateCcw,
  Hash,
} from "lucide-react"

const statuses = ["Active", "Inactive"]
const groupTypes = ["role-based", "user-based", "mixed"]
const creators = ["Admin", "Sunita Devi", "Rajesh Kumar", "Priya Sharma"]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Inactive":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <CheckCircle className="h-4 w-4" />
  }
}

const getGroupTypeIcon = (type: string) => {
  switch (type) {
    case "role-based":
      return <UserCheck className="h-4 w-4 text-blue-500" />
    case "user-based":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "mixed":
      return <Shuffle className="h-4 w-4 text-purple-500" />
    default:
      return <Users className="h-4 w-4" />
  }
}

export function AdvancedFilterDrawer() {
  const { isAdvancedFilterOpen, advancedFilters, closeAdvancedFilter, setAdvancedFilters, clearAdvancedFilters } =
    useGroupStore()

  const [localFilters, setLocalFilters] = useState(advancedFilters)

  useEffect(() => {
    setLocalFilters(advancedFilters)
  }, [advancedFilters])

  const handleApplyFilters = () => {
    setAdvancedFilters(localFilters)
    closeAdvancedFilter()
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      selectedStatuses: [],
      selectedGroupTypes: [],
      selectedCreators: [],
      createdDateFrom: "",
      createdDateTo: "",
      memberCountMin: null,
      memberCountMax: null,
      hasDescription: null,
      nameContains: "",
      descriptionContains: "",
      createdByContains: "",
    }
    setLocalFilters(clearedFilters)
    clearAdvancedFilters()
  }

  const toggleStatus = (status: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter((s) => s !== status)
        : [...prev.selectedStatuses, status],
    }))
  }

  const toggleGroupType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedGroupTypes: prev.selectedGroupTypes.includes(type)
        ? prev.selectedGroupTypes.filter((t) => t !== type)
        : [...prev.selectedGroupTypes, type],
    }))
  }

  const toggleCreator = (creator: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedCreators: prev.selectedCreators.includes(creator)
        ? prev.selectedCreators.filter((c) => c !== creator)
        : [...prev.selectedCreators, creator],
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.selectedStatuses.length > 0) count++
    if (localFilters.selectedGroupTypes.length > 0) count++
    if (localFilters.selectedCreators.length > 0) count++
    if (localFilters.createdDateFrom || localFilters.createdDateTo) count++
    if (localFilters.memberCountMin !== null || localFilters.memberCountMax !== null) count++
    if (localFilters.hasDescription !== null) count++
    if (localFilters.nameContains) count++
    if (localFilters.descriptionContains) count++
    if (localFilters.createdByContains) count++
    return count
  }

  return (
    <Sheet open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-500" />
              <SheetTitle>Advanced Filters</SheetTitle>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          <SheetDescription>Apply advanced filters to find specific groups based on detailed criteria</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.selectedStatuses.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getStatusIcon(status)}
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Group Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Types
            </Label>
            <div className="space-y-2">
              {groupTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.selectedGroupTypes.includes(type)}
                    onCheckedChange={() => toggleGroupType(type)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getGroupTypeIcon(type)}
                    {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Creator Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Created By
            </Label>
            <div className="space-y-2">
              {creators.map((creator) => (
                <div key={creator} className="flex items-center space-x-2">
                  <Checkbox
                    id={`creator-${creator}`}
                    checked={localFilters.selectedCreators.includes(creator)}
                    onCheckedChange={() => toggleCreator(creator)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`creator-${creator}`} className="text-sm cursor-pointer">
                    {creator}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Ranges */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Ranges
            </Label>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Created Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="createdDateFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="createdDateFrom"
                      type="date"
                      value={localFilters.createdDateFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdDateFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="createdDateTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="createdDateTo"
                      type="date"
                      value={localFilters.createdDateTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdDateTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Member Count Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Member Count Range
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="memberCountMin" className="text-xs">
                  Minimum
                </Label>
                <Input
                  id="memberCountMin"
                  type="number"
                  min="0"
                  value={localFilters.memberCountMin || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      memberCountMin: e.target.value ? Number.parseInt(e.target.value) : null,
                    }))
                  }
                  placeholder="Min members"
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>
              <div>
                <Label htmlFor="memberCountMax" className="text-xs">
                  Maximum
                </Label>
                <Input
                  id="memberCountMax"
                  type="number"
                  min="0"
                  value={localFilters.memberCountMax || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      memberCountMax: e.target.value ? Number.parseInt(e.target.value) : null,
                    }))
                  }
                  placeholder="Max members"
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Field Presence */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Field Presence</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Has Description</Label>
                <Select
                  value={localFilters.hasDescription === null ? "any" : localFilters.hasDescription ? "yes" : "no"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasDescription: value === "any" ? null : value === "yes",
                    }))
                  }
                >
                  <SelectTrigger className="w-24 border-0 bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Search in Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search in Fields</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nameContains" className="text-xs">
                  Group name contains
                </Label>
                <Input
                  id="nameContains"
                  value={localFilters.nameContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, nameContains: e.target.value }))}
                  placeholder="Search in group names..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionContains" className="text-xs">
                  Description contains
                </Label>
                <Input
                  id="descriptionContains"
                  value={localFilters.descriptionContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, descriptionContains: e.target.value }))}
                  placeholder="Search in descriptions..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdByContains" className="text-xs">
                  Created by contains
                </Label>
                <Input
                  id="createdByContains"
                  value={localFilters.createdByContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdByContains: e.target.value }))}
                  placeholder="Search in creator names..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={closeAdvancedFilter}
              className="hover:scale-105 hover:shadow-md transition-all duration-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
