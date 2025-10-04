"use client"

import { useState } from "react"
import { useVolunteerStore } from "@/stores/volunteer-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { X, Filter, RotateCcw } from "lucide-react"

export function VolunteerAdvancedFilterDrawer() {
  const {
    advancedFilterOpen,
    setAdvancedFilterOpen,
    advancedFilters,
    setAdvancedFilters,
    resetAdvancedFilters,
    applications
  } = useVolunteerStore()

  const [localFilters, setLocalFilters] = useState(advancedFilters)

  // Get unique values for filter options
  const uniqueEngagements = Array.from(
    new Set(applications.map(app => ({ id: app.engagementId, title: app.engagementTitle })))
  )
  const uniqueRoles = Array.from(
    new Set(applications.map(app => ({ id: app.roleId, title: app.roleTitle })))
  )
  const uniqueTransportation = Array.from(
    new Set(applications.map(app => app.transportation).filter(Boolean))
  )
  const allSkills = Array.from(
    new Set(applications.flatMap(app => app.skills || []))
  )

  const handleStatusChange = (status: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }))
  }

  const handleEngagementChange = (engagementId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      engagementType: checked 
        ? [...prev.engagementType, engagementId]
        : prev.engagementType.filter(id => id !== engagementId)
    }))
  }

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      roleType: checked 
        ? [...prev.roleType, roleId]
        : prev.roleType.filter(id => id !== roleId)
    }))
  }

  const handleTransportationChange = (transport: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      transportation: checked 
        ? [...prev.transportation, transport]
        : prev.transportation.filter(t => t !== transport)
    }))
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }))
  }

  const handleExperienceChange = (value: boolean | null) => {
    setLocalFilters(prev => ({
      ...prev,
      hasExperience: value
    }))
  }

  const handleReferencesChange = (value: boolean | null) => {
    setLocalFilters(prev => ({
      ...prev,
      hasReferences: value
    }))
  }

  const applyFilters = () => {
    setAdvancedFilters(localFilters)
    setAdvancedFilterOpen(false)
  }

  const handleReset = () => {
    resetAdvancedFilters()
    setLocalFilters({
      status: [],
      engagementType: [],
      roleType: [],
      dateRange: { start: "", end: "" },
      searchText: "",
      hasExperience: null,
      hasReferences: null,
      transportation: [],
      skills: []
    })
  }

  const hasActiveFilters = 
    localFilters.status.length > 0 ||
    localFilters.engagementType.length > 0 ||
    localFilters.roleType.length > 0 ||
    localFilters.transportation.length > 0 ||
    localFilters.skills.length > 0 ||
    localFilters.dateRange.start ||
    localFilters.dateRange.end ||
    localFilters.hasExperience !== null ||
    localFilters.hasReferences !== null

  return (
    <Sheet open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAdvancedFilterOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Application Status</Label>
            <div className="space-y-2">
              {["pending", "approved", "rejected"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.status.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`status-${status}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Engagement Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Engagements</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uniqueEngagements.map((engagement) => (
                <div key={engagement.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`engagement-${engagement.id}`}
                    checked={localFilters.engagementType.includes(engagement.id)}
                    onCheckedChange={(checked) => handleEngagementChange(engagement.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`engagement-${engagement.id}`}
                    className="text-sm cursor-pointer truncate"
                    title={engagement.title}
                  >
                    {engagement.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Role Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Roles</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uniqueRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={localFilters.roleType.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`role-${role.id}`}
                    className="text-sm cursor-pointer truncate"
                    title={role.title}
                  >
                    {role.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Event Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="start-date" className="text-xs text-gray-500">From</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end-date" className="text-xs text-gray-500">To</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Experience Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Previous Experience</Label>
            <div className="space-y-2">
              {[
                { value: true, label: "Has Experience" },
                { value: false, label: "No Experience" }
              ].map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`experience-${option.value}`}
                    checked={localFilters.hasExperience === option.value}
                    onCheckedChange={(checked) => 
                      handleExperienceChange(checked ? option.value : null)
                    }
                  />
                  <Label 
                    htmlFor={`experience-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* References Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">References</Label>
            <div className="space-y-2">
              {[
                { value: true, label: "Has References" },
                { value: false, label: "No References" }
              ].map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`references-${option.value}`}
                    checked={localFilters.hasReferences === option.value}
                    onCheckedChange={(checked) => 
                      handleReferencesChange(checked ? option.value : null)
                    }
                  />
                  <Label 
                    htmlFor={`references-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Transportation Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Transportation</Label>
            <div className="space-y-2">
              {uniqueTransportation.map((transport) => (
                <div key={transport} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transport-${transport}`}
                    checked={localFilters.transportation.includes(transport)}
                    onCheckedChange={(checked) => handleTransportationChange(transport, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`transport-${transport}`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {transport}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Skills Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Skills</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {allSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={localFilters.skills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`skill-${skill}`}
                    className="text-sm cursor-pointer"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <Button
              onClick={applyFilters}
              className="w-full"
              disabled={!hasActiveFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
