"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WarningModal } from "@/components/ui/warning-modal"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Users,
  Shield,
  Settings,
  Crown,
} from "lucide-react"
import { useRolesStore } from "@/stores/roles-store"
import { useState } from "react"

interface RolesTableContentProps {
  searchTerm: string
  statusFilter: string
  categoryFilter: string
  viewMode: "table" | "card"
}

type DialogType = "delete" | "duplicate" | "toggle" | null

export function RolesTableContent({ 
  searchTerm, 
  statusFilter, 
  categoryFilter, 
  viewMode 
}: RolesTableContentProps) {
  const {
    filteredRoles,
    openDrawer,
    deleteRole,
    duplicateRole,
    toggleRoleStatus,
    sortField,
    sortDirection,
    toggleSort,
    isLoading,
    roles: allRoles,
  } = useRolesStore()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  const handleView = (role: any) => {
    openDrawer("view", role)
  }

  const handleEdit = (role: any) => {
    openDrawer("edit", role)
  }

  const handleDeleteWarning = (role: any) => {
    setSelectedRole(role)
    setActiveDialog("delete")
  }

  const handleDuplicateWarning = (role: any) => {
    setSelectedRole(role)
    setActiveDialog("duplicate")
  }

  const handleToggleWarning = (role: any) => {
    setSelectedRole(role)
    setActiveDialog("toggle")
  }

  const handleDialogClose = () => {
    setActiveDialog(null)
    setSelectedRole(null)
  }

  const confirmDelete = () => {
    if (selectedRole) {
      deleteRole(selectedRole.id)
    }
    handleDialogClose()
  }

  const confirmDuplicate = () => {
    if (selectedRole) {
      duplicateRole(selectedRole.id)
    }
    handleDialogClose()
  }

  const confirmToggle = () => {
    if (selectedRole) {
      toggleRoleStatus(selectedRole.id)
    }
    handleDialogClose()
  }

  const roles = filteredRoles
  const hasActiveFilters = searchTerm || statusFilter !== "all" || categoryFilter !== "all"

  // Helper function to get modal props
  const getModalProps = (activeDialog: DialogType, selectedRole: any) => {
    switch (activeDialog) {
      case "delete":
        return {
          title: "Delete Role",
          description: `Are you sure you want to permanently delete the "${selectedRole?.name}" role? This action cannot be undone and will affect all users assigned to this role.`,
          confirmText: "Delete Permanently",
          confirmVariant: "destructive" as const,
          onConfirm: confirmDelete,
        }
      case "duplicate":
        return {
          title: "Duplicate Role",
          description: `This will create a copy of the "${selectedRole?.name}" role with the same permissions and settings. The new role will have "(Copy)" added to its name.`,
          confirmText: "Create Duplicate",
          confirmVariant: "default" as const,
          onConfirm: confirmDuplicate,
        }
      case "toggle":
        return {
          title: selectedRole?.isActive ? "Deactivate Role" : "Activate Role",
          description: `Are you sure you want to ${selectedRole?.isActive ? "deactivate" : "activate"} the "${selectedRole?.name}" role? This will ${selectedRole?.isActive ? "prevent" : "allow"} users from being assigned to this role.`,
          confirmText: selectedRole?.isActive ? "Deactivate" : "Activate",
          confirmVariant: selectedRole?.isActive ? "destructive" as const : "default" as const,
          onConfirm: confirmToggle,
        }
      default:
        return {
          title: "",
          description: "",
          confirmText: "",
          confirmVariant: "default" as const,
          onConfirm: () => {},
        }
    }
  }

  // Sortable Header Component
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => {
    const isActive = sortField === field
    const isAsc = sortDirection === "asc"

    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
        onClick={() => toggleSort(field as keyof any)}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          <div className="flex flex-col">
            {isActive ? (
              isAsc ? (
                <ChevronUp className="h-3 w-3 text-gray-700" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-700" />
              )
            ) : (
              <ChevronsUpDown className="h-3 w-3 text-gray-400" />
            )}
          </div>
        </div>
      </th>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty states
  if (allRoles.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first role.</p>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {hasActiveFilters ? "No roles found" : "No roles match your criteria"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasActiveFilters 
            ? "Try adjusting your search or filter criteria." 
            : "No roles match the current filters."
          }
        </p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "admin": return <Crown className="h-4 w-4" />
      case "staff": return <Users className="h-4 w-4" />
      case "volunteer": return <Users className="h-4 w-4" />
      case "member": return <Users className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "admin": return "bg-red-100 text-red-800"
      case "staff": return "bg-blue-100 text-blue-800"
      case "volunteer": return "bg-green-100 text-green-800"
      case "member": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="relative">
      <WarningModal
        isOpen={activeDialog !== null}
        onClose={handleDialogClose}
        {...getModalProps(activeDialog, selectedRole)}
      />

      {viewMode === "table" && (
        <>
          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader field="name">Role</SortableHeader>
                  <SortableHeader field="category">Category</SortableHeader>
                  <SortableHeader field="userCount">Users</SortableHeader>
                  <SortableHeader field="isActive">Status</SortableHeader>
                  <SortableHeader field="isSystem">Type</SortableHeader>
                  <SortableHeader field="createdAt">Created</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{role.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryColor(role.category)}>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(role.category)}
                          {role.category.charAt(0).toUpperCase() + role.category.slice(1)}
                        </div>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {role.userCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={role.isSystem ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                        {role.isSystem ? "System" : "Custom"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 sm:w-56" sideOffset={4}>
                          <DropdownMenuItem
                            onClick={() => handleView(role)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(role)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateWarning(role)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleWarning(role)}
                            className="hover:bg-yellow-50 hover:text-yellow-600"
                          >
                            {role.isActive ? (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWarning(role)}
                            className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{role.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {role.description}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56" sideOffset={4}>
                      <DropdownMenuItem onClick={() => handleView(role)} className="hover:bg-blue-50 hover:text-blue-600">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(role)} className="hover:bg-blue-50 hover:text-blue-600">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateWarning(role)} className="hover:bg-blue-50 hover:text-blue-600">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleWarning(role)} className="hover:bg-yellow-50 hover:text-yellow-600">
                        {role.isActive ? (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteWarning(role)} className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Category:</span>
                    <Badge className={getCategoryColor(role.category)}>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(role.category)}
                        {role.category.charAt(0).toUpperCase() + role.category.slice(1)}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Status:</span>
                    <Badge className={role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Type:</span>
                    <Badge className={role.isSystem ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                      {role.isSystem ? "System" : "Custom"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Users:</span>
                    <span className="text-gray-900 text-sm flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {role.userCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Created:</span>
                    <span className="text-gray-900 text-sm">{new Date(role.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 text-sm">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
