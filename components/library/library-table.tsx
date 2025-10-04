"use client"

import { SearchFilters } from "./search-filters"
import { LibraryTableContent } from "./library-table-content"
import { TablePagination } from "./table-pagination"
import { useLibraryStore } from "@/stores/library-store"

export function LibraryTable() {
  const {
    searchTerm,
    typeFilter,
    categoryFilter,
    statusFilter,
    viewMode,
    setSearchTerm,
    setTypeFilter,
    setCategoryFilter,
    setStatusFilter,
    setViewMode,
    openAdvancedFilter,
  } = useLibraryStore()

  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAdvancedFilter={openAdvancedFilter}
      />
      <LibraryTableContent
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        viewMode={viewMode}
      />
      <TablePagination />
    </div>
  )
}
