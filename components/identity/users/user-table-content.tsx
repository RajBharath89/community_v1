"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Crown,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react"
import { getRoleBadgeColor, getStatusBadgeColor } from "@/utils/badgeColors"
import { useUserStore } from "@/stores/user-store"
import { useState } from "react"
import { TableSkeleton, CardSkeleton } from "./skeleton-loaders"
import { EmptyState } from "./empty-state"

interface UserTableContentProps {
  searchTerm: string
  statusFilter: string
  roleFilter: string
  viewMode: "table" | "card"
}

type DialogType = "deactivate" | "duplicate" | "delete" | null

export function UserTableContent({ searchTerm, statusFilter, roleFilter, viewMode }: UserTableContentProps) {
  const {
    filteredUsers,
    openDrawer,
    deleteUser,
    duplicateUser,
    promoteUser,
    demoteUser,
    toggleUserStatus,
    showSensitiveFields,
    sortField,
    sortDirection,
    toggleSort,
    isLoading,
    users: allUsers,
  } = useUserStore()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionInProgress, setActionInProgress] = useState<{ [key: string]: boolean }>({})

  const handleView = (user: any) => {
    openDrawer("view", user)
  }

  const handleEdit = (user: any) => {
    openDrawer("edit", user)
  }

  const handleDeleteWarning = (user: any) => {
    console.log(" Opening delete dialog for user:", user.name)
    setSelectedUser(user)
    setActiveDialog("delete")
  }

  const handlePromote = (user: any) => {
    const roles = ["Member", "Volunteer", "Trustee", "Priest", "Admin"]
    const currentRoleIndex = roles.indexOf(user.role)
    if (currentRoleIndex < roles.length - 1) {
      const nextRole = roles[currentRoleIndex + 1]
      promoteUser(user.id, nextRole)
    }
  }

  const handleDemote = (user: any) => {
    const roles = ["Member", "Volunteer", "Trustee", "Priest", "Admin"]
    const currentRoleIndex = roles.indexOf(user.role)
    if (currentRoleIndex > 0) {
      const nextRole = roles[currentRoleIndex - 1]
      demoteUser(user.id, nextRole)
    }
  }

  const handleToggleStatus = (user: any) => {
    if (actionInProgress[`status-${user.id}`]) return

    setActionInProgress((prev) => ({ ...prev, [`status-${user.id}`]: true }))
    toggleUserStatus(user.id)

    // Re-enable after 2 seconds
    setTimeout(() => {
      setActionInProgress((prev) => ({ ...prev, [`status-${user.id}`]: false }))
    }, 2000)
  }

  const handleDeactivateWarning = (user: any) => {
    setSelectedUser(user)
    setActiveDialog("deactivate")
  }

  const handleDuplicateWarning = (user: any) => {
    setSelectedUser(user)
    setActiveDialog("duplicate")
  }

  const handleDialogClose = () => {
    setActiveDialog(null)
    setSelectedUser(null)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      console.log(" Confirming delete for user:", selectedUser.name)
      deleteUser(selectedUser.id)
    }
    handleDialogClose()
  }

  const confirmDeactivate = () => {
    if (selectedUser) {
      handleToggleStatus(selectedUser)
    }
    handleDialogClose()
  }

  const confirmDuplicate = () => {
    if (selectedUser) {
      duplicateUser(selectedUser.id)
    }
    handleDialogClose()
  }

  const users = filteredUsers()
  const roles = ["Member", "Volunteer", "Trustee", "Priest", "Admin"]

  // Helper function to get modal props
  const getModalProps = (activeDialog: DialogType, selectedUser: any) => {
    switch (activeDialog) {
      case "delete":
        return {
          title: "Delete User",
          description: `Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone and will remove all user data, history, and associated records from the system.`,
          confirmText: "Delete Permanently",
          confirmVariant: "destructive" as const,
          onConfirm: confirmDelete,
        }
      case "deactivate":
        return {
          title: "Deactivate User",
          description: `Are you sure you want to deactivate ${selectedUser?.name}? This will prevent them from accessing the system and participating in activities. You can reactivate them later if needed.`,
          confirmText: "Deactivate User",
          confirmVariant: "destructive" as const,
          onConfirm: confirmDeactivate,
        }
      case "duplicate":
        return {
          title: "Duplicate User",
          description: `This will create a copy of ${selectedUser?.name} with the same role and information. The new user will have "(Copy)" added to their name and will need a new email address to be set.`,
          confirmText: "Create Duplicate",
          confirmVariant: "default" as const,
          onConfirm: confirmDuplicate,
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
        onClick={() => toggleSort(field)}
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
      <div className="relative">
        {viewMode === "table" && <TableSkeleton />}
        {(viewMode === "card" || viewMode === "table") && <CardSkeleton viewMode={viewMode} />}
      </div>
    )
  }

  // Empty states
  if (allUsers.length === 0) {
    return <EmptyState type="no-users" />
  }

  if (users.length === 0) {
    const hasActiveFilters = searchTerm || statusFilter !== "All Status" || roleFilter !== "All Roles"
    return <EmptyState type={hasActiveFilters ? "no-filtered-results" : "no-results"} />
  }

  return (
    <div className="relative">
      <WarningModal
        isOpen={activeDialog !== null}
        onClose={handleDialogClose}
        {...getModalProps(activeDialog, selectedUser)}
      />

             {viewMode === "table" && (
         <>
           {/* Table View - Show on all screen sizes */}
           <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader field="name">User</SortableHeader>
                  <SortableHeader field="role">Role</SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <SortableHeader field="organization">Organization</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nuki Code
                  </th>
                  <SortableHeader field="joinDate">Join Date</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeColor(user.status.toLowerCase())}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{user.phone || "Not provided"}</span>
                        {user.alternateMobile && (
                          <span className="text-xs text-gray-500">Alt: {user.alternateMobile}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        {user.city && user.state ? (
                          <>
                            <span>{user.city}</span>
                            <span className="text-xs text-gray-500">{user.state}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.organization || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {showSensitiveFields ? (
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.nukiCode || "Not assigned"}
                        </span>
                      ) : (
                        <span className="text-gray-400">••••••••</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 sm:w-56" sideOffset={4}>
                          <DropdownMenuItem
                            onClick={() => handleView(user)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(user)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateWarning(user)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handlePromote(user)}
                            disabled={roles.indexOf(user.role) === roles.length - 1}
                            className="hover:bg-yellow-50 hover:text-yellow-600"
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Promote
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDemote(user)}
                            disabled={roles.indexOf(user.role) === 0}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Demote
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              user.status === "Active" ? handleDeactivateWarning(user) : handleToggleStatus(user)
                            }
                            disabled={actionInProgress[`status-${user.id}`]}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            {user.status === "Active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWarning(user)}
                            className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
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

       

       {/* Card View - Show on mobile by default and when card view is selected */}
       {viewMode === "card" && (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56" sideOffset={4}>
                      <DropdownMenuItem onClick={() => handleView(user)} className="hover:bg-red-50 hover:text-red-600">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(user)} className="hover:bg-red-50 hover:text-red-600">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateWarning(user)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handlePromote(user)}
                        disabled={roles.indexOf(user.role) === roles.length - 1}
                        className="hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Promote
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDemote(user)}
                        disabled={roles.indexOf(user.role) === 0}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Demote
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          user.status === "Active" ? handleDeactivateWarning(user) : handleToggleStatus(user)
                        }
                        disabled={actionInProgress[`status-${user.id}`]}
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        {user.status === "Active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteWarning(user)}
                        className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Role:</span>
                     <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Status:</span>
                     <Badge className={getStatusBadgeColor(user.status.toLowerCase())}>{user.status}</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Phone:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">{user.phone || "Not provided"}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Alt Phone:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">{user.alternateMobile || "Not provided"}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Location:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">
                       {user.city && user.state ? `${user.city}, ${user.state}` : "Not provided"}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Organization:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">{user.organization || "Not assigned"}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Date of Birth:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">
                       {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Gender:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">{user.gender || "Not provided"}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Nuki Code:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">
                       {showSensitiveFields ? (
                         <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                           {user.nukiCode || "Not assigned"}
                         </span>
                       ) : (
                         <span className="text-gray-400">••••••••</span>
                       )}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-sm">Join Date:</span>
                     <span className="text-gray-900 text-sm truncate max-w-[120px]">{user.joinDate}</span>
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
