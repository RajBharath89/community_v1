"use client"
import { useGroupStore } from "@/stores/group-store"
import { SearchFilters } from "./search-filters"
import { GroupTableContent } from "./group-table-content"

export function GroupTable() {
  const { searchTerm, statusFilter, groupTypeFilter, viewMode } = useGroupStore()
  const { setSearchTerm, setStatusFilter, setGroupTypeFilter, setViewMode } = useGroupStore()

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        groupTypeFilter={groupTypeFilter}
        setGroupTypeFilter={setGroupTypeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <GroupTableContent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        groupTypeFilter={groupTypeFilter}
        viewMode={viewMode}
      />
    </div>
  )
}
