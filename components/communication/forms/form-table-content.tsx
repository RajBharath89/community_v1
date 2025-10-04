"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  FileText,
  CheckCircle,
  Users,
  TrendingUp,
  ClipboardList,
  UserCheck,
  MessageSquare,
  Calendar,
  Trophy,
  ArrowUpDown,
} from "lucide-react"
import { useFormStore, type Form } from "@/stores/form-store"
import { Skeleton } from "@/components/ui/skeleton"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800 border-green-200"
    case "Draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Archived":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Expired":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getFormTypeIcon = (type: string) => {
  switch (type) {
    case "Survey":
      return <ClipboardList className="h-4 w-4 text-red-500" />
    case "Registration":
      return <UserCheck className="h-4 w-4 text-green-500" />
    case "Feedback":
      return <MessageSquare className="h-4 w-4 text-purple-500" />
    case "Application":
      return <FileText className="h-4 w-4 text-orange-500" />
    case "RSVP":
      return <Calendar className="h-4 w-4 text-indigo-500" />
    case "Volunteer":
      return <Trophy className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

function FormActions({ form, onAction }: { form: Form; onAction: (action: string, form: Form) => void }) {
  const canEdit = form.status === "Draft" || form.status === "Published"
  const canPublish = form.status === "Draft"
  const canArchive = form.status === "Published"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onAction("view", form)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem onClick={() => onAction("edit", form)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Form
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onAction("duplicate", form)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        {form.formUrl && (
          <DropdownMenuItem onClick={() => window.open(form.formUrl, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Form
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {canPublish && (
          <DropdownMenuItem onClick={() => onAction("publish", form)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Publish
          </DropdownMenuItem>
        )}
        {canArchive && (
          <DropdownMenuItem onClick={() => onAction("archive", form)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction("delete", form)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmptyState() {
  const { openDrawer } = useFormStore()

  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No forms</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
      <div className="mt-6">
        <Button onClick={() => openDrawer("create")} className="bg-red-500 hover:bg-red-600">
          <FileText className="mr-2 h-4 w-4" />
          Add Form
        </Button>
      </div>
    </div>
  )
}

function LoadingSkeleton({ viewMode }: { viewMode: "table" | "card" }) {
  if (viewMode === "table") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="h-4 w-32" />
        </Card>
      ))}
    </div>
  )
}

export function FormTableContent() {
  const {
    paginatedForms,
    viewMode,
    isLoading,
    openDrawer,
    deleteForm,
    duplicateForm,
    publishForm,
    archiveForm,
    sortField,
    sortDirection,
    toggleSort,
  } = useFormStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<Form | null>(null)

  const forms = paginatedForms()

  const handleAction = (action: string, form: Form) => {
    switch (action) {
      case "view":
        openDrawer("view", form)
        break
      case "edit":
        openDrawer("edit", form)
        break
      case "duplicate":
        duplicateForm(form.id)
        break
      case "publish":
        publishForm(form.id)
        break
      case "archive":
        archiveForm(form.id)
        break
      case "delete":
        setFormToDelete(form)
        setDeleteDialogOpen(true)
        break
    }
  }

  const confirmDelete = () => {
    if (formToDelete) {
      deleteForm(formToDelete.id)
      setFormToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (isLoading) {
    return <LoadingSkeleton viewMode={viewMode} />
  }

  if (forms.length === 0) {
    return <EmptyState />
  }

  if (viewMode === "table") {
    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("name")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Form
                    {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("status")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Status
                    {sortField === "status" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("formType")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Type
                    {sortField === "formType" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("submissionCount")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Submissions
                    {sortField === "submissionCount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("completionRate")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Completion Rate
                    {sortField === "completionRate" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("createdDate")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Created
                    {sortField === "createdDate" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{form.name}</div>
                      {form.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{form.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getFormTypeIcon(form.formType)}
                      <span>{form.formType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{form.submissionCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{form.completionRate.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{form.createdDate}</div>
                      <div className="text-gray-500">by {form.createdBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormActions form={form} onAction={handleAction} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone and will
                permanently remove all form data and submissions.
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
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getFormTypeIcon(form.formType)}
                  <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                </div>
                <FormActions form={form} onAction={handleAction} />
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{form.name}</h3>
              {form.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Submissions</span>
                  </div>
                  <div className="text-lg font-bold">{form.submissionCount}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Completion</span>
                  </div>
                  <div className="text-lg font-bold">{form.completionRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created {form.createdDate}</span>
                <span>by {form.createdBy}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone and will permanently
              remove all form data and submissions.
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
    </>
  )
}
