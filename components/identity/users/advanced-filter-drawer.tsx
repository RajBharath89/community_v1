"use client"

import { useState, useEffect } from "react"
import { useUserStore } from "@/stores/user-store"
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
  Phone,
  MapPin,
  Key,
  Crown,
  Church,
  Shield,
  Heart,
  User,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react"

const roles = ["Admin", "Priest", "Trustee", "Volunteer", "Member"]
const departments = ["Religious Affairs", "Administration", "Community Service", "Management", "Finance"]
const statuses = ["Active", "Inactive", "Pending"]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Crown className="h-4 w-4" />
    case "Priest":
      return <Church className="h-4 w-4" />
    case "Trustee":
      return <Shield className="h-4 w-4" />
    case "Volunteer":
      return <Heart className="h-4 w-4" />
    case "Member":
      return <User className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Inactive":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function AdvancedFilterDrawer() {
  const { isAdvancedFilterOpen, advancedFilters, closeAdvancedFilter, setAdvancedFilters, clearAdvancedFilters } =
    useUserStore()

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
      selectedRoles: [],
      selectedStatuses: [],
      selectedDepartments: [],
      joinDateFrom: "",
      joinDateTo: "",
      lastLoginFrom: "",
      lastLoginTo: "",
      hasPhone: null,
      hasAddress: null,
      hasNukiCode: null,
      phoneContains: "",
      addressContains: "",
      nukiCodeContains: "",
    }
    setLocalFilters(clearedFilters)
    clearAdvancedFilters()
  }

  const toggleRole = (role: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter((r) => r !== role)
        : [...prev.selectedRoles, role],
    }))
  }

  const toggleStatus = (status: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter((s) => s !== status)
        : [...prev.selectedStatuses, status],
    }))
  }

  const toggleDepartment = (department: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(department)
        ? prev.selectedDepartments.filter((d) => d !== department)
        : [...prev.selectedDepartments, department],
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.selectedRoles.length > 0) count++
    if (localFilters.selectedStatuses.length > 0) count++
    if (localFilters.selectedDepartments.length > 0) count++
    if (localFilters.joinDateFrom || localFilters.joinDateTo) count++
    if (localFilters.lastLoginFrom || localFilters.lastLoginTo) count++
    if (localFilters.hasPhone !== null) count++
    if (localFilters.hasAddress !== null) count++
    if (localFilters.hasNukiCode !== null) count++
    if (localFilters.phoneContains) count++
    if (localFilters.addressContains) count++
    if (localFilters.nukiCodeContains) count++
    return count
  }

  return (
    <Sheet open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
              <SheetContent className="w-full sm:w-[500px] lg:w-[600px] overflow-y-auto">
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
          <SheetDescription>Apply advanced filters to find specific users based on detailed criteria</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Roles
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={localFilters.selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`role-${role}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getRoleIcon(role)}
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

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

          {/* Department Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Departments
            </Label>
            <div className="space-y-2">
              {departments.map((department) => (
                <div key={department} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${department}`}
                    checked={localFilters.selectedDepartments.includes(department)}
                    onCheckedChange={() => toggleDepartment(department)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`dept-${department}`} className="text-sm cursor-pointer">
                    {department}
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
                <Label className="text-xs text-muted-foreground">Join Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="joinDateFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="joinDateFrom"
                      type="date"
                      value={localFilters.joinDateFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, joinDateFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="joinDateTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="joinDateTo"
                      type="date"
                      value={localFilters.joinDateTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, joinDateTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Last Login Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lastLoginFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="lastLoginFrom"
                      type="date"
                      value={localFilters.lastLoginFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, lastLoginFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastLoginTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="lastLoginTo"
                      type="date"
                      value={localFilters.lastLoginTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, lastLoginTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Field Presence */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Field Presence</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Has Phone Number
                </Label>
                <Select
                  value={localFilters.hasPhone === null ? "any" : localFilters.hasPhone ? "yes" : "no"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasPhone: value === "any" ? null : value === "yes",
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

              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Has Address
                </Label>
                <Select
                  value={localFilters.hasAddress === null ? "any" : localFilters.hasAddress ? "yes" : "no"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasAddress: value === "any" ? null : value === "yes",
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

              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Has Nuki Code
                </Label>
                <Select
                  value={localFilters.hasNukiCode === null ? "any" : localFilters.hasNukiCode ? "yes" : "no"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasNukiCode: value === "any" ? null : value === "yes",
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
                <Label htmlFor="phoneContains" className="text-xs flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Phone contains
                </Label>
                <Input
                  id="phoneContains"
                  value={localFilters.phoneContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, phoneContains: e.target.value }))}
                  placeholder="Search in phone numbers..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressContains" className="text-xs flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Address contains
                </Label>
                <Input
                  id="addressContains"
                  value={localFilters.addressContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, addressContains: e.target.value }))}
                  placeholder="Search in addresses..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nukiCodeContains" className="text-xs flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Nuki Code contains
                </Label>
                <Input
                  id="nukiCodeContains"
                  value={localFilters.nukiCodeContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, nukiCodeContains: e.target.value }))}
                  placeholder="Search in Nuki codes..."
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
