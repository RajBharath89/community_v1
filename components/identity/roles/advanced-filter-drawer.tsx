"use client"

import { useState } from "react"
import { useRolesStore } from "@/stores/roles-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Filter, 
  X, 
  RotateCcw,
  Calendar,
  Users,
  Shield,
  Settings
} from "lucide-react"

export function AdvancedFilterDrawer() {
  const {
    advancedFilterOpen,
    advancedFilters,
    setAdvancedFilterOpen,
    setAdvancedFilters,
    resetAdvancedFilters,
    roles,
    permissions
  } = useRolesStore()

  const [localFilters, setLocalFilters] = useState(advancedFilters)

  // Get unique values for filter options
  const uniqueCategories = Array.from(new Set(roles.map(role => role.category)))
  const uniqueCreatedBy = Array.from(new Set(roles.map(role => role.createdBy)))
  const uniquePermissions = Array.from(new Set(permissions.map(p => p.name)))

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayFilterChange = (key: string, value: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key as keyof typeof prev] as string[]), value]
        : (prev[key as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const handleApplyFilters = () => {
    setAdvancedFilters(localFilters)
    setAdvancedFilterOpen(false)
  }

  const handleResetFilters = () => {
    resetAdvancedFilters()
    setLocalFilters({
      status: [],
      category: [],
      permissions: [],
      createdBy: [],
      dateRange: { start: "", end: "" },
      userCountRange: { min: 0, max: 1000 },
      isSystem: null,
      hasRestrictions: null,
      searchText: ""
    })
  }

  const handleClose = () => {
    setLocalFilters(advancedFilters)
    setAdvancedFilterOpen(false)
  }

  const hasActiveFilters = 
    localFilters.status.length > 0 ||
    localFilters.category.length > 0 ||
    localFilters.permissions.length > 0 ||
    localFilters.createdBy.length > 0 ||
    localFilters.dateRange.start ||
    localFilters.dateRange.end ||
    localFilters.userCountRange.min > 0 ||
    localFilters.userCountRange.max < 1000 ||
    localFilters.isSystem !== null ||
    localFilters.hasRestrictions !== null ||
    localFilters.searchText

  return (
    <Sheet open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>
            Use advanced filters to find specific roles based on multiple criteria.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["active", "inactive"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.status.includes(status)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange("status", status, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status}`} className="capitalize">
                    {status}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uniqueCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={localFilters.category.includes(category)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange("category", category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category}`} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Permissions Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-40 overflow-y-auto">
              {uniquePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`permission-${permission}`}
                    checked={localFilters.permissions.includes(permission)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange("permissions", permission, checked as boolean)
                    }
                  />
                  <Label htmlFor={`permission-${permission}`} className="text-sm">
                    {permission}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Created By Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Created By
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uniqueCreatedBy.map((creator) => (
                <div key={creator} className="flex items-center space-x-2">
                  <Checkbox
                    id={`creator-${creator}`}
                    checked={localFilters.createdBy.includes(creator)}
                    onCheckedChange={(checked) => 
                      handleArrayFilterChange("createdBy", creator, checked as boolean)
                    }
                  />
                  <Label htmlFor={`creator-${creator}`}>
                    {creator}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Date Range Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...localFilters.dateRange,
                    start: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...localFilters.dateRange,
                    end: e.target.value
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Count Range Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Count Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="minUsers">Minimum</Label>
                  <Input
                    id="minUsers"
                    type="number"
                    value={localFilters.userCountRange.min}
                    onChange={(e) => handleFilterChange("userCountRange", {
                      ...localFilters.userCountRange,
                      min: parseInt(e.target.value) || 0
                    })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Maximum</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={localFilters.userCountRange.max}
                    onChange={(e) => handleFilterChange("userCountRange", {
                      ...localFilters.userCountRange,
                      max: parseInt(e.target.value) || 1000
                    })}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boolean Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isSystem">System Roles Only</Label>
                  <Select
                    value={localFilters.isSystem === null ? "all" : localFilters.isSystem ? "true" : "false"}
                    onValueChange={(value) => 
                      handleFilterChange("isSystem", value === "all" ? null : value === "true")
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasRestrictions">Has Restrictions</Label>
                  <Select
                    value={localFilters.hasRestrictions === null ? "all" : localFilters.hasRestrictions ? "true" : "false"}
                    onValueChange={(value) => 
                      handleFilterChange("hasRestrictions", value === "all" ? null : value === "true")
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleApplyFilters} disabled={!hasActiveFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
