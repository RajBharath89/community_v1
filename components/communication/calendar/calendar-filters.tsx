"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface CalendarFiltersProps {
  typeFilter: string[]
  statusFilter: string[]
  onTypeFilterChange: (types: string[]) => void
  onStatusFilterChange: (statuses: string[]) => void
}

export function CalendarFilters({
  typeFilter,
  statusFilter,
  onTypeFilterChange,
  onStatusFilterChange
}: CalendarFiltersProps) {
  const messageTypes = ["Announcement", "Event", "Meeting"]
  const statuses = ["Draft", "Scheduled", "Sent", "Failed", "Sending"]

  const handleTypeToggle = (type: string, checked: boolean) => {
    if (checked) {
      onTypeFilterChange([...typeFilter, type])
    } else {
      onTypeFilterChange(typeFilter.filter(t => t !== type))
    }
  }

  const handleStatusToggle = (status: string, checked: boolean) => {
    if (checked) {
      onStatusFilterChange([...statusFilter, status])
    } else {
      onStatusFilterChange(statusFilter.filter(s => s !== status))
    }
  }

  const clearAllFilters = () => {
    onTypeFilterChange([])
    onStatusFilterChange([])
  }

  const hasActiveFilters = typeFilter.length > 0 || statusFilter.length > 0

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message Type Filter */}
        <div>
          <h4 className="font-medium mb-3">Message Type</h4>
          <div className="space-y-2">
            {messageTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={typeFilter.includes(type)}
                  onCheckedChange={(checked) => handleTypeToggle(type, checked as boolean)}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h4 className="font-medium mb-3">Status</h4>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => handleStatusToggle(status, checked as boolean)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {typeFilter.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                Type: {type}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleTypeToggle(type, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {statusFilter.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="flex items-center gap-1"
              >
                Status: {status}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleStatusToggle(status, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
