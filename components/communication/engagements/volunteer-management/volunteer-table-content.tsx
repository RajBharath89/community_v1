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
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
} from "lucide-react"
import { useVolunteerStore } from "@/stores/volunteer-store"
import { useState } from "react"
import { getStatusBadgeColor } from "@/utils/badgeColors"

interface VolunteerTableContentProps {
  searchTerm: string
  statusFilter: string
  engagementFilter: string
  roleFilter: string
  viewMode: "table" | "card"
}

type DialogType = "approve" | "reject" | "delete" | null

export function VolunteerTableContent({ 
  searchTerm, 
  statusFilter, 
  engagementFilter, 
  roleFilter, 
  viewMode 
}: VolunteerTableContentProps) {
  const {
    filteredApplications,
    getPaginatedApplications,
    openDrawer,
    approveApplication,
    rejectApplication,
    deleteApplication,
    sortField,
    sortDirection,
    toggleSort,
    isLoading,
    applications: allApplications,
  } = useVolunteerStore()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [actionInProgress, setActionInProgress] = useState<{ [key: string]: boolean }>({})

  const handleView = (application: any) => {
    openDrawer("view", application)
  }

  const handleApprove = (application: any) => {
    setSelectedApplication(application)
    setActiveDialog("approve")
  }

  const handleReject = (application: any) => {
    setSelectedApplication(application)
    setActiveDialog("reject")
  }

  const handleDeleteWarning = (application: any) => {
    setSelectedApplication(application)
    setActiveDialog("delete")
  }

  const handleDialogClose = () => {
    setActiveDialog(null)
    setSelectedApplication(null)
  }

  const confirmApprove = () => {
    if (selectedApplication) {
      approveApplication(selectedApplication.id, "Application approved by admin")
    }
    handleDialogClose()
  }

  const confirmReject = () => {
    if (selectedApplication) {
      rejectApplication(selectedApplication.id, "Application rejected by admin")
    }
    handleDialogClose()
  }

  const confirmDelete = () => {
    if (selectedApplication) {
      deleteApplication(selectedApplication.id)
    }
    handleDialogClose()
  }

  const applications = getPaginatedApplications()
  const hasActiveFilters = searchTerm || statusFilter !== "all" || engagementFilter !== "all" || roleFilter !== "all"

  // Helper function to get modal props
  const getModalProps = (activeDialog: DialogType, selectedApplication: any) => {
    switch (activeDialog) {
      case "approve":
        return {
          title: "Approve Volunteer Application",
          description: `Are you sure you want to approve ${selectedApplication?.userName}'s application for ${selectedApplication?.roleTitle} in ${selectedApplication?.engagementTitle}? This will confirm their volunteer role.`,
          confirmText: "Approve Application",
          confirmVariant: "default" as const,
          onConfirm: confirmApprove,
        }
      case "reject":
        return {
          title: "Reject Volunteer Application",
          description: `Are you sure you want to reject ${selectedApplication?.userName}'s application for ${selectedApplication?.roleTitle} in ${selectedApplication?.engagementTitle}? This action can be reversed later.`,
          confirmText: "Reject Application",
          confirmVariant: "destructive" as const,
          onConfirm: confirmReject,
        }
      case "delete":
        return {
          title: "Delete Volunteer Application",
          description: `Are you sure you want to permanently delete ${selectedApplication?.userName}'s application? This action cannot be undone and will remove all application data.`,
          confirmText: "Delete Permanently",
          confirmVariant: "destructive" as const,
          onConfirm: confirmDelete,
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
  if (allApplications.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteer applications</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating an engagement with volunteer opportunities.</p>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {hasActiveFilters ? "No applications found" : "No applications match your criteria"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasActiveFilters 
            ? "Try adjusting your search or filter criteria." 
            : "No volunteer applications match the current filters."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <WarningModal
        isOpen={activeDialog !== null}
        onClose={handleDialogClose}
        {...getModalProps(activeDialog, selectedApplication)}
      />

      {viewMode === "table" && (
        <>
          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader field="userName">Volunteer</SortableHeader>
                  <SortableHeader field="engagementTitle">Engagement</SortableHeader>
                  <SortableHeader field="roleTitle">Role</SortableHeader>
                  <SortableHeader field="status">Status</SortableHeader>
                  <SortableHeader field="requestedAt">Applied Date</SortableHeader>
                  <SortableHeader field="engagementDate">Event Date</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {application.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{application.userName}</div>
                          <div className="text-sm text-gray-500">{application.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.engagementTitle}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(application.engagementDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.roleTitle}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {application.roleDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(application.requestedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(application.engagementDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {application.engagementTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col space-y-1">
                        {application.userPhone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="text-xs">{application.userPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="text-xs truncate max-w-xs">{application.userEmail}</span>
                        </div>
                        {application.transportation && (
                          <div className="flex items-center">
                            <Car className="h-3 w-3 mr-1" />
                            <span className="text-xs capitalize">{application.transportation}</span>
                          </div>
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
                            onClick={() => handleView(application)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {application.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprove(application)}
                                className="hover:bg-green-50 hover:text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleReject(application)}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWarning(application)}
                            className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete Application
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
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {application.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{application.userName}</div>
                      <div className="text-sm text-gray-500">{application.userEmail}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56" sideOffset={4}>
                      <DropdownMenuItem onClick={() => handleView(application)} className="hover:bg-blue-50 hover:text-blue-600">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {application.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(application)} className="hover:bg-green-50 hover:text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(application)} className="hover:bg-red-50 hover:text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteWarning(application)} className="text-red-600 focus:text-red-600 hover:bg-red-50 hover:text-red-700">
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Engagement:</span>
                    <span className="text-gray-900 text-sm font-medium">{application.engagementTitle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Role:</span>
                    <span className="text-gray-900 text-sm font-medium">{application.roleTitle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Status:</span>
                    <Badge className={getStatusBadgeColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Applied:</span>
                    <span className="text-gray-900 text-sm">{new Date(application.requestedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Event Date:</span>
                    <span className="text-gray-900 text-sm">{new Date(application.engagementDate).toLocaleDateString()}</span>
                  </div>
                  {application.userPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Phone:</span>
                      <span className="text-gray-900 text-sm">{application.userPhone}</span>
                    </div>
                  )}
                  {application.transportation && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Transport:</span>
                      <span className="text-gray-900 text-sm capitalize">{application.transportation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
