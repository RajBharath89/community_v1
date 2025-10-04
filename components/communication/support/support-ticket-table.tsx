"use client"

import { SearchFilters } from "./search-filters"
import { SupportTicketTableContent } from "./support-ticket-table-content"
import { TablePagination } from "./table-pagination"
import { useSupportTicketStore } from "@/stores/support-ticket-store"

export function SupportTicketTable() {
  const {
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    viewMode,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setViewMode,
  } = useSupportTicketStore()

  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <SupportTicketTableContent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        categoryFilter={categoryFilter}
        viewMode={viewMode}
      />
      <TablePagination />
    </div>
  )
}
