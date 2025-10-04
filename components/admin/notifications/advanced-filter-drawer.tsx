"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNotificationStore } from "@/stores/notification-store"

export function AdvancedFilterDrawer() {
  const { isAdvancedFilterOpen, closeAdvancedFilter } = useNotificationStore()

  return (
    <Dialog open={isAdvancedFilterOpen} onOpenChange={closeAdvancedFilter}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Advanced filter options will be implemented here</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
