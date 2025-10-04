"use client"

import { Users, Search, Filter, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/user-store"

interface EmptyStateProps {
  type: "no-users" | "no-results" | "no-filtered-results"
}

export function EmptyState({ type }: EmptyStateProps) {
  const { openDrawer, setSearchTerm, setStatusFilter, setRoleFilter, clearAdvancedFilters } = useUserStore()

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All Status")
    setRoleFilter("All Roles")
    clearAdvancedFilters()
  }

  const handleAddUser = () => {
    openDrawer("create")
  }

  if (type === "no-users") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No users yet</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Get started by adding your first temple member. You can add priests, volunteers, trustees, and devotees to
          manage your community.
        </p>
        <Button onClick={handleAddUser} className="bg-red-500 hover:bg-red-600">
          <UserPlus className="w-4 h-4 mr-2" />
          Add First User
        </Button>
      </div>
    )
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No search results</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          We couldn't find any users matching your search. Try adjusting your search terms or check for typos.
        </p>
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Clear Search
        </Button>
      </div>
    )
  }

  if (type === "no-filtered-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Filter className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching users</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          No users match your current filters. Try adjusting your filter criteria or clearing all filters to see more
          results.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
          <Button onClick={handleAddUser} className="bg-red-500 hover:bg-red-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
    )
  }

  return null
}
