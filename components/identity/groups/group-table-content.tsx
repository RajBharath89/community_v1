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
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Users,
  UserPlus,
  Shuffle,
} from "lucide-react"
import { getStatusBadgeColor } from "@/utils/badgeColors"
import { useGroupStore } from "@/stores/group-store"
import { useState } from "react"
import { TableSkeleton, CardSkeleton } from "../users/skeleton-loaders"
import { EmptyState } from "../users/empty-state"

interface GroupTableContentProps {
  searchTerm: string
  statusFilter: string
  groupTypeFilter: string
  viewMode: "table" | "card"
}

type DialogType = "deactivate" | "duplicate" | "delete" | null

const getGroupTypeBadgeColor = (type: string) => {
  switch (type) {
    case "role-based":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "user-based":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "mixed":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const getGroupTypeIcon = (type: string) => {
  switch (type) {
    case "role-based":
      return <UserCheck className="h-3 w-3" />
    case "user-based":
      return <UserPlus className="h-3 w-3" />
    case "mixed":
      return <Shuffle className="h-3 w-3" />
    default:
      return <Users className="h-3 w-3" />
  }
}

export function GroupTableContent({ searchTerm, statusFilter, groupTypeFilter, viewMode }: GroupTableContentProps) {
  const {
    filteredGroups,
    openDrawer,
    deleteGroup,
    duplicateGroup,
    toggleGroupStatus,
    showSensitiveFields,
    sortField,
    sortDirection,
    toggleSort,
    isLoading,
    groups: allGroups,
  } = useGroupStore()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [actionInProgress, setActionInProgress] = useState<{ [key: string]: boolean }>({})

  const handleView = (group: any) => {
    openDrawer("view", group)
  }

  const handleEdit = (group: any) => {
    openDrawer("edit", group)
  }

  const handleDeleteWarning = (group: any) => {
    setSelectedGroup(group)
    setActiveDialog("delete")
  }

  const handleToggleStatus = (group: any) => {
    if (actionInProgress[`status-${group.id}`]) return

    setActionInProgress((prev) => ({ ...prev, [`status-${group.id}`]: true }))
    toggleGroupStatus(group.id)

    setTimeout(() => {
      setActionInProgress((prev) => ({ ...prev, [`status-${group.id}`]: false }))
    }, 2000)
  }

  const handleDeactivateWarning = (group: any) => {
    setSelectedGroup(group)
    setActiveDialog("deactivate")
  }

  const handleDuplicateWarning = (group: any) => {
    setSelectedGroup(group)
    setActiveDialog("duplicate")
  }

  const handleDialogClose = () => {
    setActiveDialog(null)
    setSelectedGroup(null)
  }

  const confirmDelete = () => {
    if (selectedGroup) {
      deleteGroup(selectedGroup.id)
    }
    handleDialogClose()
  }

  const confirmDeactivate = () => {
    if (selectedGroup) {
      handleToggleStatus(selectedGroup)
    }
    handleDialogClose()
  }

  const confirmDuplicate = () => {
    if (selectedGroup) {
      duplicateGroup(selectedGroup.id)
    }
    handleDialogClose()
  }

  const groups = filteredGroups()

  if (isLoading) {
    return (
      <div className="relative">
        {viewMode === "table" && <TableSkeleton />}
        {(viewMode === "card" || viewMode === "table") && <CardSkeleton viewMode={viewMode} />}
      </div>
    )
  }

  if (allGroups.length === 0) {
    return <EmptyState type="no-users" />
  }

  if (groups.length === 0) {
    const hasActiveFilters = searchTerm || statusFilter !== "All Status" || groupTypeFilter !== "All Types"
    return <EmptyState type={hasActiveFilters ? "no-filtered-results" : "no-results"} />
  }

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

  return (
    <div className="relative">
      <WarningModal
        isOpen={activeDialog !== null}
        onClose={handleDialogClose}
        {...getModalProps(activeDialog, selectedGroup)}
      />

      {viewMode === "table" && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="name">Group Name</SortableHeader>
                <SortableHeader field="groupType">Type</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="memberCount">Members</SortableHeader>
                <SortableHeader field="createdBy">Created By</SortableHeader>
                <SortableHeader field="createdDate">Created Date</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {group.description || "No description"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getGroupTypeBadgeColor(group.groupType)}>
                      <div className="flex items-center space-x-1">
                        {getGroupTypeIcon(group.groupType)}
                        <span className="capitalize">{group.groupType.replace("-", " ")}</span>
                      </div>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadgeColor(group.status.toLowerCase())}>{group.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{group.memberCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.createdDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
                        <DropdownMenuItem
                          onClick={() => handleView(group)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(group)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Group
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateWarning(group)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            group.status === "Active" ? handleDeactivateWarning(group) : handleToggleStatus(group)
                          }
                          disabled={actionInProgress[`status-${group.id}`]}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          {group.status === "Active" ? (
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
                          onClick={() => handleDeleteWarning(group)}
                          className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(viewMode === "card" || viewMode === "table") && (
        <div
          className={
            viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4" : "lg:hidden space-y-4 p-4"
          }
        >
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{group.name}</div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {group.description || "No description provided"}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
                      <DropdownMenuItem
                        onClick={() => handleView(group)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(group)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateWarning(group)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          group.status === "Active" ? handleDeactivateWarning(group) : handleToggleStatus(group)
                        }
                        disabled={actionInProgress[`status-${group.id}`]}
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        {group.status === "Active" ? (
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
                        onClick={() => handleDeleteWarning(group)}
                        className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="mt-1">
                      <Badge className={getGroupTypeBadgeColor(group.groupType)}>
                        <div className="flex items-center space-x-1">
                          {getGroupTypeIcon(group.groupType)}
                          <span className="capitalize">{group.groupType.replace("-", " ")}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(group.status.toLowerCase())}>{group.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Members:</span>
                    <div className="mt-1 text-gray-900 flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{group.memberCount}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created By:</span>
                    <div className="mt-1 text-gray-900 text-xs">{group.createdBy}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="mt-1 text-gray-900 text-xs">{group.createdDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Modified:</span>
                    <div className="mt-1 text-gray-900 text-xs">{group.lastModified}</div>
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

const getModalProps = (activeDialog: DialogType, selectedGroup: any) => {
  switch (activeDialog) {
    case "delete":
      return {
        title: "Delete Group",
        description: `Are you sure you want to permanently delete "${selectedGroup?.name}"? This action cannot be undone and will remove the group and all its member associations from the system.`,
        confirmText: "Delete Permanently",
        confirmVariant: "destructive" as const,
        onConfirm: () => {},
      }
    case "deactivate":
      return {
        title: "Deactivate Group",
        description: `Are you sure you want to deactivate "${selectedGroup?.name}"? This will prevent the group from being used for communications and activities. You can reactivate it later if needed.`,
        confirmText: "Deactivate Group",
        confirmVariant: "destructive" as const,
        onConfirm: () => {},
      }
    case "duplicate":
      return {
        title: "Duplicate Group",
        description: `This will create a copy of "${selectedGroup?.name}" with the same settings and member configuration. The new group will have "(Copy)" added to its name.`,
        confirmText: "Create Duplicate",
        confirmVariant: "default" as const,
        onConfirm: () => {},
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
