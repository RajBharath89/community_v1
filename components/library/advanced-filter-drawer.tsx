"use client"

import { useLibraryStore, AdvancedFilters } from "@/stores/library-store"
import { AdvancedFilterDrawerContent } from "./advanced-filter-drawer-content"

export function AdvancedFilterDrawer() {
  const { isAdvancedFilterOpen, closeAdvancedFilter, advancedFilters, setAdvancedFilters, clearAdvancedFilters } = useLibraryStore()

  if (!isAdvancedFilterOpen) return null

  return (
    <AdvancedFilterDrawerContent
      isOpen={isAdvancedFilterOpen}
      onClose={closeAdvancedFilter}
      filters={advancedFilters}
      onFiltersChange={setAdvancedFilters}
      onClearFilters={clearAdvancedFilters}
    />
  )
}
