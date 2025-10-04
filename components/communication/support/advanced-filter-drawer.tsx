"use client"

import { useState } from "react"
import { X, Filter, Calendar, User, Tag, FileText, MessageSquare, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useSupportTicketStore, type AdvancedFilters } from "@/stores/support-ticket-store"

export function AdvancedFilterDrawer() {
  const {
    isAdvancedFilterOpen,
    closeAdvancedFilter,
    advancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
  } = useSupportTicketStore()

  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(advancedFilters)

  const categories = ["Technical", "General", "Account", "Billing", "Feature Request", "Bug Report"]
  const priorities = ["Low", "Medium", "High", "Critical"]
  const statuses = ["Open", "In Progress", "Resolved", "Closed", "Pending"]
  const assignees = ["Rajesh Kumar", "Sunita Devi", "Priya Sharma", "Amit Patel"]

  const handleApplyFilters = () => {
    setAdvancedFilters(localFilters)
    closeAdvancedFilter()
  }

  const handleClearFilters = () => {
    const clearedFilters: AdvancedFilters = {
      selectedCategories: [],
      selectedPriorities: [],
      selectedStatuses: [],
      selectedAssignees: [],
      createdDateFrom: "",
      createdDateTo: "",
      updatedDateFrom: "",
      updatedDateTo: "",
      hasAttachments: null,
      hasComments: null,
      tagsContains: "",
      titleContains: "",
      descriptionContains: "",
    }
    setLocalFilters(clearedFilters)
    clearAdvancedFilters()
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      selectedCategories: checked
        ? [...localFilters.selectedCategories, category]
        : localFilters.selectedCategories.filter((c) => c !== category),
    })
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      selectedPriorities: checked
        ? [...localFilters.selectedPriorities, priority]
        : localFilters.selectedPriorities.filter((p) => p !== priority),
    })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      selectedStatuses: checked
        ? [...localFilters.selectedStatuses, status]
        : localFilters.selectedStatuses.filter((s) => s !== status),
    })
  }

  const handleAssigneeChange = (assignee: string, checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      selectedAssignees: checked
        ? [...localFilters.selectedAssignees, assignee]
        : localFilters.selectedAssignees.filter((a) => a !== assignee),
    })
  }

  const getActiveFiltersCount = () => {
    return [
      localFilters.selectedCategories.length > 0,
      localFilters.selectedPriorities.length > 0,
      localFilters.selectedStatuses.length > 0,
      localFilters.selectedAssignees.length > 0,
      localFilters.createdDateFrom !== "",
      localFilters.createdDateTo !== "",
      localFilters.updatedDateFrom !== "",
      localFilters.updatedDateTo !== "",
      localFilters.hasAttachments !== null,
      localFilters.hasComments !== null,
      localFilters.tagsContains !== "",
      localFilters.titleContains !== "",
      localFilters.descriptionContains !== "",
    ].filter(Boolean).length
  }

  return (
    <Sheet open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={localFilters.selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Priorities */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Priorities</Label>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={localFilters.selectedPriorities.includes(priority)}
                    onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                  />
                  <Label htmlFor={`priority-${priority}`} className="text-sm">
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Statuses */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Statuses</Label>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assignees */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Assignees
            </Label>
            <div className="space-y-2">
              {assignees.map((assignee) => (
                <div key={assignee} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assignee-${assignee}`}
                    checked={localFilters.selectedAssignees.includes(assignee)}
                    onCheckedChange={(checked) => handleAssigneeChange(assignee, checked as boolean)}
                  />
                  <Label htmlFor={`assignee-${assignee}`} className="text-sm">
                    {assignee}
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
              <div>
                <Label htmlFor="createdFrom" className="text-xs text-gray-600">
                  Created From
                </Label>
                <Input
                  id="createdFrom"
                  type="date"
                  value={localFilters.createdDateFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, createdDateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createdTo" className="text-xs text-gray-600">
                  Created To
                </Label>
                <Input
                  id="createdTo"
                  type="date"
                  value={localFilters.createdDateTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, createdDateTo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="updatedFrom" className="text-xs text-gray-600">
                  Updated From
                </Label>
                <Input
                  id="updatedFrom"
                  type="date"
                  value={localFilters.updatedDateFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, updatedDateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="updatedTo" className="text-xs text-gray-600">
                  Updated To
                </Label>
                <Input
                  id="updatedTo"
                  type="date"
                  value={localFilters.updatedDateTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, updatedDateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Content Filters */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Filters
            </Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="titleContains" className="text-xs text-gray-600">
                  Title Contains
                </Label>
                <Input
                  id="titleContains"
                  value={localFilters.titleContains}
                  onChange={(e) => setLocalFilters({ ...localFilters, titleContains: e.target.value })}
                  placeholder="Search in titles..."
                />
              </div>
              <div>
                <Label htmlFor="descriptionContains" className="text-xs text-gray-600">
                  Description Contains
                </Label>
                <Input
                  id="descriptionContains"
                  value={localFilters.descriptionContains}
                  onChange={(e) => setLocalFilters({ ...localFilters, descriptionContains: e.target.value })}
                  placeholder="Search in descriptions..."
                />
              </div>
              <div>
                <Label htmlFor="tagsContains" className="text-xs text-gray-600 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Tags Contains
                </Label>
                <Input
                  id="tagsContains"
                  value={localFilters.tagsContains}
                  onChange={(e) => setLocalFilters({ ...localFilters, tagsContains: e.target.value })}
                  placeholder="Search in tags..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Boolean Filters */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Additional Filters</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600 flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  Has Attachments
                </Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAttachments-yes"
                      checked={localFilters.hasAttachments === true}
                      onCheckedChange={(checked) =>
                        setLocalFilters({ ...localFilters, hasAttachments: checked ? true : null })
                      }
                    />
                    <Label htmlFor="hasAttachments-yes" className="text-sm">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAttachments-no"
                      checked={localFilters.hasAttachments === false}
                      onCheckedChange={(checked) =>
                        setLocalFilters({ ...localFilters, hasAttachments: checked ? false : null })
                      }
                    />
                    <Label htmlFor="hasAttachments-no" className="text-sm">
                      No
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Has Comments
                </Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasComments-yes"
                      checked={localFilters.hasComments === true}
                      onCheckedChange={(checked) =>
                        setLocalFilters({ ...localFilters, hasComments: checked ? true : null })
                      }
                    />
                    <Label htmlFor="hasComments-yes" className="text-sm">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasComments-no"
                      checked={localFilters.hasComments === false}
                      onCheckedChange={(checked) =>
                        setLocalFilters({ ...localFilters, hasComments: checked ? false : null })
                      }
                    />
                    <Label htmlFor="hasComments-no" className="text-sm">
                      No
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button onClick={handleApplyFilters} className="w-full bg-red-500 hover:bg-red-600">
              Apply Filters ({getActiveFiltersCount()})
            </Button>
            <Button variant="outline" onClick={handleClearFilters} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
