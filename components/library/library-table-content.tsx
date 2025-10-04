"use client"

import { useEffect } from "react"
import { useLibraryStore } from "@/stores/library-store"
import { LibraryGridSkeleton, LibraryTableSkeleton } from "./skeleton-loaders"
import { LibraryGridView } from "./library-grid-view"
import { LibraryListView } from "./library-list-view"

interface LibraryTableContentProps {
  searchTerm: string
  typeFilter: string
  categoryFilter: string
  statusFilter: string
  viewMode: "grid" | "list"
}

export function LibraryTableContent({
  searchTerm,
  typeFilter,
  categoryFilter,
  statusFilter,
  viewMode,
}: LibraryTableContentProps) {
  const { 
    isLoading, 
    getPaginatedItems, 
    sortField, 
    sortDirection, 
    toggleSort,
    setItemsPerPage,
    resetPagination
  } = useLibraryStore()

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [searchTerm, typeFilter, categoryFilter, statusFilter, resetPagination])

  // Set items per page based on view mode
  useEffect(() => {
    const itemsPerPage = viewMode === "grid" ? 8 : 5
    setItemsPerPage(itemsPerPage)
  }, [viewMode, setItemsPerPage])

  if (isLoading) {
    return viewMode === "grid" ? <LibraryGridSkeleton /> : <LibraryTableSkeleton />
  }

  const paginationInfo = getPaginatedItems()
  const { items: currentItems } = paginationInfo

  if (viewMode === "grid") {
    return <LibraryGridView items={currentItems} />
  }

  return (
    <LibraryListView
      items={currentItems}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={toggleSort}
    />
  )
}
