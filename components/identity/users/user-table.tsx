"use client"

import { SearchFilters } from "./search-filters"
import { UserTableContent } from "./user-table-content"
import { TablePagination } from "./table-pagination"
import { useUserStore } from "@/stores/user-store"

export function UserTable() {
  const { searchTerm, statusFilter, roleFilter, viewMode, setSearchTerm, setStatusFilter, setRoleFilter, setViewMode } =
    useUserStore()

  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <UserTableContent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        viewMode={viewMode}
      />
      <TablePagination />
    </div>
  )
}
