"use client"

import { SearchFilters } from "./search-filters"
import { DonationTableContent } from "./donation-table-content"
import { TablePagination } from "./table-pagination"
import { useDonationStore } from "@/stores/donation-store"

export function DonationTable() {
  const { searchTerm, statusFilter, typeFilter, viewMode, setSearchTerm, setStatusFilter, setTypeFilter, setViewMode } =
    useDonationStore()

  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <DonationTableContent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        viewMode={viewMode}
      />
      <TablePagination />
    </div>
  )
}
