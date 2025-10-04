"use client"

import { useEngagementStore } from "@/stores/engagement-store"
import { SearchFilters } from "./search-filters"
import { EngagementTableContent } from "./engagement-table-content"
import { TablePagination } from "./table-pagination"

export function EngagementTable() {
  const { viewMode } = useEngagementStore()

  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters />
      <EngagementTableContent />
      <TablePagination />
    </div>
  )
}

export default EngagementTable
