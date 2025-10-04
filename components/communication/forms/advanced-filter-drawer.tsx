"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, RotateCcw, Search } from "lucide-react"
import { useFormStore } from "@/stores/form-store"

export function AdvancedFilterDrawer() {
  const {
    isAdvancedFilterOpen,
    closeAdvancedFilter,
    advancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
    forms,
  } = useFormStore()

  const updateFilters = (updates: Partial<typeof advancedFilters>) => {
    setAdvancedFilters({ ...advancedFilters, ...updates })
  }

  const uniqueStatuses = Array.from(new Set(forms.map((form) => form.status)))
  const uniqueFormTypes = Array.from(new Set(forms.map((form) => form.formType)))
  const uniqueCreators = Array.from(new Set(forms.map((form) => form.createdBy)))
  const uniqueTargetAudiences = Array.from(new Set(forms.map((form) => form.targetAudience)))

  return (
    <Sheet open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
      <SheetContent className="w-[400px] sm:max-w-[400px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Advanced Filters</span>
            <Button variant="ghost" size="sm" onClick={closeAdvancedFilter} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              {uniqueStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={advancedFilters.selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          selectedStatuses: [...advancedFilters.selectedStatuses, status],
                        })
                      } else {
                        updateFilters({
                          selectedStatuses: advancedFilters.selectedStatuses.filter((s) => s !== status),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Form Type Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Form Type</Label>
            <div className="space-y-2">
              {uniqueFormTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={advancedFilters.selectedFormTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          selectedFormTypes: [...advancedFilters.selectedFormTypes, type],
                        })
                      } else {
                        updateFilters({
                          selectedFormTypes: advancedFilters.selectedFormTypes.filter((t) => t !== type),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Created Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="createdDateFrom" className="text-xs">
                  From
                </Label>
                <Input
                  id="createdDateFrom"
                  type="date"
                  value={advancedFilters.createdDateFrom}
                  onChange={(e) => updateFilters({ createdDateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="createdDateTo" className="text-xs">
                  To
                </Label>
                <Input
                  id="createdDateTo"
                  type="date"
                  value={advancedFilters.createdDateTo}
                  onChange={(e) => updateFilters({ createdDateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submission Count Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Submission Count</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="submissionMin" className="text-xs">
                  Min
                </Label>
                <Input
                  id="submissionMin"
                  type="number"
                  value={advancedFilters.submissionCountMin || ""}
                  onChange={(e) =>
                    updateFilters({
                      submissionCountMin: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="submissionMax" className="text-xs">
                  Max
                </Label>
                <Input
                  id="submissionMax"
                  type="number"
                  value={advancedFilters.submissionCountMax || ""}
                  onChange={(e) =>
                    updateFilters({
                      submissionCountMax: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Form Properties</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Select
                  value={advancedFilters.hasDescription === null ? "any" : advancedFilters.hasDescription.toString()}
                  onValueChange={(value) =>
                    updateFilters({
                      hasDescription: value === "any" ? null : value === "true",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Description</SelectItem>
                    <SelectItem value="true">Has Description</SelectItem>
                    <SelectItem value="false">No Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={advancedFilters.isTemplate === null ? "any" : advancedFilters.isTemplate.toString()}
                  onValueChange={(value) =>
                    updateFilters({
                      isTemplate: value === "any" ? null : value === "true",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Template Status</SelectItem>
                    <SelectItem value="true">Is Template</SelectItem>
                    <SelectItem value="false">Not Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Text Search Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Text Search</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="nameContains" className="text-xs">
                  Name Contains
                </Label>
                <Input
                  id="nameContains"
                  value={advancedFilters.nameContains}
                  onChange={(e) => updateFilters({ nameContains: e.target.value })}
                  placeholder="Search in form names"
                />
              </div>
              <div>
                <Label htmlFor="createdByContains" className="text-xs">
                  Created By
                </Label>
                <Input
                  id="createdByContains"
                  value={advancedFilters.createdByContains}
                  onChange={(e) => updateFilters({ createdByContains: e.target.value })}
                  placeholder="Search by creator"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          <Button
            variant="outline"
            onClick={clearAdvancedFilters}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Clear All</span>
          </Button>
          <Button onClick={closeAdvancedFilter} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600">
            <Search className="h-4 w-4" />
            <span>Apply Filters</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
