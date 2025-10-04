"use client"

import { ActionButtons } from "./action-buttons"
import { StatsCards } from "./stats-cards"
import { SearchFilters } from "./search-filters"
import { RolesTableContent } from "./roles-table-content"
import { RolesDrawer } from "./roles-drawer"
import { AdvancedFilterDrawer } from "./advanced-filter-drawer"
import { useRolesStore } from "@/stores/roles-store"

export default function RolesManagement() {
  const { viewMode } = useRolesStore()

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-red-100">
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-70">
          <img
            src="/sai-baba-with-devotees-showing-community-unity-and.png"
            alt="Sai Baba with devotees"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="relative z-10 ml-20 sm:ml-28 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
              Manage user roles, permissions, and access controls
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10">
            <ActionButtons />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Search and Filters */}
      <SearchFilters />

      {/* Table Content */}
      <RolesTableContent
        searchTerm=""
        statusFilter="all"
        categoryFilter="all"
        viewMode={viewMode}
      />

      {/* Drawers */}
      <RolesDrawer />
      <AdvancedFilterDrawer />
    </div>
  )
}

export { RolesManagement }
