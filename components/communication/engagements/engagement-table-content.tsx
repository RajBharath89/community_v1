"use client"

import { useState } from "react"
import { useEngagementStore } from "@/stores/engagement-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  Clock,
  FileText,
  AlertTriangle,
  Megaphone,
  Calendar,
  Bell,
  Zap,
  Users,
  Mail,
  Smartphone,
  Paperclip,
  TrendingUp,
  MousePointer,
  Plus,
  Link,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

function EngagementTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Engagement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Delivery Rate</TableHead>
            <TableHead>Read Rate</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function EngagementCardsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  const { openDrawer } = useEngagementStore()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <Megaphone className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No engagements found</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Get started by creating your first engagement to communicate with your temple community.
      </p>
      <Button
        onClick={() => openDrawer("create")}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Engagement
      </Button>
    </div>
  )
}

export function EngagementTableContent() {
  const {
    getPaginatedEngagements,
    setCurrentPage,
    setItemsPerPage,
    viewMode,
    isLoading,
    openDrawer,
    deleteEngagement,
    duplicateEngagement,
    sendEngagement,
    sortField,
    sortDirection,
    toggleSort,
  } = useEngagementStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [engagementToDelete, setEngagementToDelete] = useState<string | null>(null)

  const pagination = getPaginatedEngagements()
  const engagements = pagination.items

  const handleDelete = (id: string) => {
    setEngagementToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (engagementToDelete) {
      deleteEngagement(engagementToDelete)
      setDeleteDialogOpen(false)
      setEngagementToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Sent: "bg-green-100 text-green-800 border-green-200",
      Scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Draft: "bg-gray-100 text-gray-800 border-gray-200",
      Failed: "bg-red-100 text-red-800 border-red-200",
    }
    const icons = {
      Sent: <Send className="h-3 w-3" />,
      Scheduled: <Clock className="h-3 w-3" />,
      Draft: <FileText className="h-3 w-3" />,
      Failed: <AlertTriangle className="h-3 w-3" />,
    }
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        <div className="flex items-center space-x-1">
          {icons[status as keyof typeof icons]}
          <span>{status}</span>
        </div>
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      Urgent: "bg-red-100 text-red-800 border-red-200",
      High: "bg-orange-100 text-orange-800 border-orange-200",
      Normal: "bg-blue-100 text-blue-800 border-blue-200",
      Low: "bg-gray-100 text-gray-800 border-gray-200",
    }
    const icons = {
      Urgent: <Zap className="h-3 w-3" />,
      High: <AlertTriangle className="h-3 w-3" />,
      Normal: <Bell className="h-3 w-3" />,
      Low: <Bell className="h-3 w-3" />,
    }
    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        <div className="flex items-center space-x-1">
          {icons[priority as keyof typeof icons]}
          <span>{priority}</span>
        </div>
      </Badge>
    )
  }

  const getMessageTypeBadge = (type: string) => {
    const variants = {
      Announcement: "bg-green-100 text-green-800 border-green-200",
      Event: "bg-purple-100 text-purple-800 border-purple-200",
      Newsletter: "bg-blue-100 text-blue-800 border-blue-200",
      Alert: "bg-red-100 text-red-800 border-red-200",
    }
    const icons = {
      Announcement: <Megaphone className="h-3 w-3" />,
      Event: <Calendar className="h-3 w-3" />,
      Newsletter: <FileText className="h-3 w-3" />,
      Alert: <AlertTriangle className="h-3 w-3" />,
    }
    return (
      <Badge variant="outline" className={variants[type as keyof typeof variants]}>
        <div className="flex items-center space-x-1">
          {icons[type as keyof typeof icons]}
          <span>{type}</span>
        </div>
      </Badge>
    )
  }

  const getDeliveryChannelIcons = (channels: string[]) => {
    const iconMap = {
      "in-app": <Bell className="h-3 w-3 text-blue-500" />,
      email: <Mail className="h-3 w-3 text-green-500" />,
      sms: <Smartphone className="h-3 w-3 text-purple-500" />,
    }
    return (
      <div className="flex items-center space-x-1">
        {channels.map((channel) => (
          <div key={channel} title={channel}>
            {iconMap[channel as keyof typeof iconMap]}
          </div>
        ))}
      </div>
    )
  }

  const formatPercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return "0%"
    return `${Math.round((numerator / denominator) * 100)}%`
  }

  const getAvailableActions = (status: string) => {
    switch (status) {
      case "Draft":
        return {
          canView: true,
          canEdit: true,
          canDuplicate: true,
          canSend: true,
          canDelete: true,
        }
      case "Scheduled":
        return {
          canView: true,
          canEdit: true, // Allow editing scheduled engagements
          canDuplicate: true,
          canSend: false,
          canDelete: true,
        }
      case "Sent":
        return {
          canView: true,
          canEdit: false, // Cannot edit sent engagements
          canDuplicate: true,
          canSend: false,
          canDelete: false, // Cannot delete sent engagements
        }
      case "Failed":
        return {
          canView: true,
          canEdit: true, // Allow editing to fix issues
          canDuplicate: true,
          canSend: true, // Allow resending failed engagements
          canDelete: true,
        }
      default:
        return {
          canView: true,
          canEdit: false,
          canDuplicate: false,
          canSend: false,
          canDelete: false,
        }
    }
  }

  if (isLoading) {
    return viewMode === "table" ? <EngagementTableSkeleton /> : <EngagementCardsSkeleton />
  }

  if (engagements.length === 0) {
    return <EmptyState />
  }

	if (viewMode === "card") {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
        {engagements.map((engagement) => {
          const actions = getAvailableActions(engagement.status)

          return (
            <Card key={engagement.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{engagement.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{engagement.subject}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.canView && (
                          <DropdownMenuItem onClick={() => openDrawer("view", engagement)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
                        {actions.canEdit && (
                          <DropdownMenuItem onClick={() => openDrawer("edit", engagement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {actions.canDuplicate && (
                          <DropdownMenuItem onClick={() => duplicateEngagement(engagement.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        {actions.canSend && (
                          <DropdownMenuItem onClick={() => sendEngagement(engagement.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            {engagement.status === "Failed" ? "Resend" : "Send Now"}
                          </DropdownMenuItem>
                        )}
                        {(actions.canEdit || actions.canDuplicate || actions.canSend || actions.canDelete) && (
                          <DropdownMenuSeparator />
                        )}
                        {actions.canDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(engagement.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(engagement.status)}
                    {getPriorityBadge(engagement.priority)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{engagement.totalRecipients} recipients</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatPercentage(engagement.deliveredCount, engagement.totalRecipients)} delivered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatPercentage(engagement.readCount, engagement.deliveredCount)} read</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer className="h-3 w-3" />
                      <span>{engagement.clickCount} clicks</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">{getMessageTypeBadge(engagement.messageType)}</div>
                    <div className="flex items-center space-x-2">
                      {getDeliveryChannelIcons(engagement.deliveryChannels)}
                      {engagement.attachments.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="h-3 w-3" />
                          <span>{engagement.attachments.length}</span>
                        </div>
                      )}
                      {engagement.links && engagement.links.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Link className="h-3 w-3" />
                          <span>{engagement.links.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created {engagement.createdDate} by {engagement.createdBy}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {([
                { field: "title", label: "Engagement", width: "w-[300px]" },
                { field: "status", label: "Status" },
                { field: "priority", label: "Priority" },
                { field: "messageType", label: "Type" },
                { field: "totalRecipients", label: "Recipients" },
                { field: "deliveryRate", label: "Delivery Rate" },
                { field: "readRate", label: "Read Rate" },
                { field: "createdDate", label: "Created" },
              ] as Array<{ field: keyof ReturnType<typeof useEngagementStore>["filteredEngagements"][number]; label: string; width?: string }> ).map(({ field, label, width }) => {
                const isActive = sortField === field
                const isAsc = sortDirection === "asc"
                return (
                  <TableHead key={String(field)} className={`${width ?? ""} px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider select-none`}>
                    <button
                      type="button"
                      onClick={() => toggleSort(field as any)}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                    >
                      <span>{label}</span>
                      {isActive ? (
                        isAsc ? (
                          <ChevronUp className="h-3 w-3 text-gray-700" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-gray-700" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </TableHead>
                )
              })}
              <TableHead className="w-[50px] px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {engagements.map((engagement) => {
              const actions = getAvailableActions(engagement.status)

              return (
                <TableRow key={engagement.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">{engagement.title}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">{engagement.subject}</div>
                      <div className="flex items-center space-x-2">
                        {getDeliveryChannelIcons(engagement.deliveryChannels)}
                        {engagement.attachments.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Paperclip className="h-3 w-3" />
                            <span>{engagement.attachments.length}</span>
                          </div>
                        )}
                        {engagement.links && engagement.links.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Link className="h-3 w-3" />
                            <span>{engagement.links.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(engagement.status)}</TableCell>
                  <TableCell>{getPriorityBadge(engagement.priority)}</TableCell>
                  <TableCell>{getMessageTypeBadge(engagement.messageType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span>{engagement.totalRecipients.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                      <span>{formatPercentage(engagement.deliveredCount, engagement.totalRecipients)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-gray-400" />
                      <span>{formatPercentage(engagement.readCount, engagement.deliveredCount)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      <div>{engagement.createdDate}</div>
                      <div className="text-xs text-gray-500">by {engagement.createdBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.canView && (
                          <DropdownMenuItem onClick={() => openDrawer("view", engagement)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
                        {actions.canEdit && (
                          <DropdownMenuItem onClick={() => openDrawer("edit", engagement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {actions.canDuplicate && (
                          <DropdownMenuItem onClick={() => duplicateEngagement(engagement.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        {actions.canSend && (
                          <DropdownMenuItem onClick={() => sendEngagement(engagement.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            {engagement.status === "Failed" ? "Resend" : "Send Now"}
                          </DropdownMenuItem>
                        )}
                        {(actions.canEdit || actions.canDuplicate || actions.canSend || actions.canDelete) && (
                          <DropdownMenuSeparator />
                        )}
                        {actions.canDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(engagement.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Engagement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this engagement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
