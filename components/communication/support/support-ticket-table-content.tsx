"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Copy, Trash2, User, MessageSquare, Paperclip, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSupportTicketStore, type SupportTicket } from "@/stores/support-ticket-store"
import { TableSkeleton } from "./skeleton-loaders"
import { LifeBuoy } from "lucide-react"

interface SupportTicketTableContentProps {
  searchTerm: string
  statusFilter: string
  priorityFilter: string
  categoryFilter: string
  viewMode: "table" | "card"
}

type DialogType = "delete" | "duplicate" | null

export function SupportTicketTableContent({
  searchTerm,
  statusFilter,
  priorityFilter,
  categoryFilter,
  viewMode,
}: SupportTicketTableContentProps) {
  const {
    filteredTickets,
    isLoading,
    openDrawer,
    deleteTicket,
    duplicateTicket,
    updateTicketStatus,
    assignTicket,
    setSorting,
    sortField,
    sortDirection,
  } = useSupportTicketStore()

  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const tickets = filteredTickets()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Pending":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSorting(field, newDirection)
  }

  const handleDelete = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setDialogType("delete")
  }

  const handleDuplicate = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setDialogType("duplicate")
  }

  const confirmDelete = () => {
    if (selectedTicket) {
      deleteTicket(selectedTicket.id)
      setDialogType(null)
      setSelectedTicket(null)
    }
  }

  const confirmDuplicate = () => {
    if (selectedTicket) {
      duplicateTicket(selectedTicket.id)
      setDialogType(null)
      setSelectedTicket(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return <TableSkeleton />
  }

  if (viewMode === "card") {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openDrawer("view", ticket)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{ticket.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{ticket.id}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDrawer("view", ticket)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDrawer("edit", ticket)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(ticket)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(ticket)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(ticket.createdDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {ticket.comments.length}
                </div>
              </div>

              {ticket.assignedTo && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(ticket.assignedTo)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600">{ticket.assignedTo}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <LifeBuoy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tickets found matching your criteria.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-2">
                  Ticket ID
                  {sortField === "id" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-2">
                  Title
                  {sortField === "title" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-2">
                  Category
                  {sortField === "category" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center gap-2">
                  Priority
                  {sortField === "priority" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortField === "status" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("createdDate")}
              >
                <div className="flex items-center gap-2">
                  Created
                  {sortField === "createdDate" && (
                    <span className="text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{ticket.title}</p>
                    <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ticket.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority === "Critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(ticket.assignedTo)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignedTo}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(ticket.createdDate).toLocaleDateString()}</div>
                    <div className="text-gray-500 text-xs">
                      by {ticket.createdBy}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDrawer("view", ticket)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDrawer("edit", ticket)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(ticket)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(ticket)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <LifeBuoy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No tickets found matching your criteria.</p>
        </div>
      )}

      <AlertDialog open={dialogType === "delete"} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ticket "{selectedTicket?.id}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogType === "duplicate"} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to duplicate ticket "{selectedTicket?.id}"? A new ticket will be created with the same details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDuplicate}>
              Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
