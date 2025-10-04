"use client"

import { SearchFilters } from "./search-filters"
import { NotificationTableContent } from "./notification-table-content"
import { TablePagination } from "./table-pagination"
import { useNotificationStore } from "@/stores/notification-store"

export function NotificationTable() {
  const { searchTerm, statusFilter, typeFilter, viewMode, setSearchTerm, setStatusFilter, setTypeFilter, setViewMode } =
    useNotificationStore()

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
      <NotificationTableContent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        viewMode={viewMode}
      />
      <TablePagination />
    </div>
  )
}
