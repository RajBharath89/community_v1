"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDonationStore, type AdvancedFilters } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"

const typeOptions = ["online", "offline"]
const statusOptions = ["pending", "reviewed", "approved", "rejected"]
const frequencyOptions = ["one-time", "weekly", "monthly", "quarterly", "yearly"]
const paymentMethodOptions = ["stripe", "paypal", "razorpay", "bank-transfer", "cheque", "cash"]

export function AdvancedFilterDrawer() {
  const {
    isAdvancedFilterOpen,
    closeAdvancedFilter,
    advancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
  } = useDonationStore()

  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(advancedFilters)

  useEffect(() => {
    setLocalFilters(advancedFilters)
  }, [advancedFilters])

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleArrayFilterChange = (key: keyof AdvancedFilters, value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const currentArray = (prev[key] as string[]) || []
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] }
      } else {
        return { ...prev, [key]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  const handleApplyFilters = () => {
    setAdvancedFilters(localFilters)
    closeAdvancedFilter()
  }

  const handleClearFilters = () => {
    clearAdvancedFilters()
    setLocalFilters({
      selectedTypes: [],
      selectedStatuses: [],
      selectedFrequencies: [],
      selectedPaymentMethods: [],
      amountFrom: null,
      amountTo: null,
      dateFrom: "",
      dateTo: "",
      donorNameContains: "",
      donorEmailContains: "",
      hasReceipt: null,
      isRecurring: null
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.selectedTypes.length > 0) count++
    if (localFilters.selectedStatuses.length > 0) count++
    if (localFilters.selectedFrequencies.length > 0) count++
    if (localFilters.selectedPaymentMethods.length > 0) count++
    if (localFilters.amountFrom !== null) count++
    if (localFilters.amountTo !== null) count++
    if (localFilters.dateFrom) count++
    if (localFilters.dateTo) count++
    if (localFilters.donorNameContains) count++
    if (localFilters.donorEmailContains) count++
    if (localFilters.hasReceipt !== null) count++
    if (localFilters.isRecurring !== null) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Sheet open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
      <SheetContent className="w-full sm:w-[400px] lg:w-[500px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription>
                Filter donations by multiple criteria to find exactly what you're looking for
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Donation Type</Label>
            <div className="space-y-2">
              {typeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.selectedTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedTypes", type, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.selectedStatuses.includes(status)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedStatuses", status, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Frequency Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Frequency</Label>
            <div className="space-y-2">
              {frequencyOptions.map((frequency) => (
                <div key={frequency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`frequency-${frequency}`}
                    checked={localFilters.selectedFrequencies.includes(frequency)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedFrequencies", frequency, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`frequency-${frequency}`}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {frequency.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Method Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="space-y-2">
              {paymentMethodOptions.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={localFilters.selectedPaymentMethods.includes(method)}
                    onCheckedChange={(checked) =>
                      handleArrayFilterChange("selectedPaymentMethods", method, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`payment-${method}`}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {method.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Amount Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amount Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amountFrom" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Input
                  id="amountFrom"
                  type="number"
                  placeholder="Min amount"
                  value={localFilters.amountFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("amountFrom", e.target.value ? parseFloat(e.target.value) : null)
                  }
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountTo" className="text-xs text-muted-foreground">
                  To
                </Label>
                <Input
                  id="amountTo"
                  type="number"
                  placeholder="Max amount"
                  value={localFilters.amountTo || ""}
                  onChange={(e) =>
                    handleFilterChange("amountTo", e.target.value ? parseFloat(e.target.value) : null)
                  }
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                  From
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                  To
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Donor Information */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Donor Information</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="donorNameContains" className="text-xs text-muted-foreground">
                  Name contains
                </Label>
                <Input
                  id="donorNameContains"
                  placeholder="Search in donor names"
                  value={localFilters.donorNameContains}
                  onChange={(e) => handleFilterChange("donorNameContains", e.target.value)}
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorEmailContains" className="text-xs text-muted-foreground">
                  Email contains
                </Label>
                <Input
                  id="donorEmailContains"
                  placeholder="Search in donor emails"
                  value={localFilters.donorEmailContains}
                  onChange={(e) => handleFilterChange("donorEmailContains", e.target.value)}
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Additional Filters</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Has Receipt</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasReceipt-yes"
                      checked={localFilters.hasReceipt === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange("hasReceipt", checked ? true : null)
                      }
                    />
                    <Label htmlFor="hasReceipt-yes" className="text-sm font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasReceipt-no"
                      checked={localFilters.hasReceipt === false}
                      onCheckedChange={(checked) =>
                        handleFilterChange("hasReceipt", checked ? false : null)
                      }
                    />
                    <Label htmlFor="hasReceipt-no" className="text-sm font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Is Recurring</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring-yes"
                      checked={localFilters.isRecurring === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange("isRecurring", checked ? true : null)
                      }
                    />
                    <Label htmlFor="isRecurring-yes" className="text-sm font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring-no"
                      checked={localFilters.isRecurring === false}
                      onCheckedChange={(checked) =>
                        handleFilterChange("isRecurring", checked ? false : null)
                      }
                    />
                    <Label htmlFor="isRecurring-no" className="text-sm font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
