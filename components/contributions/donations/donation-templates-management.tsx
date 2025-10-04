"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDonationStore, type DonationTemplate } from "@/stores/donation-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
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
  Save,
  Edit,
  Trash2,
  Plus,
  FileText,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Copy,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"

const templateTypes = [
  { value: "acknowledgment", label: "Acknowledgment", icon: <CheckCircle className="h-4 w-4" /> },
  { value: "rejection", label: "Rejection", icon: <XCircle className="h-4 w-4" /> },
  { value: "clarification", label: "Clarification Request", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "recurring-confirmation", label: "Recurring Confirmation", icon: <CheckCircle className="h-4 w-4" /> },
  { value: "recurring-cancellation", label: "Recurring Cancellation", icon: <XCircle className="h-4 w-4" /> },
]

export function DonationTemplatesManagement() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useDonationStore()
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"create" | "view" | "edit">("create")
  const [selectedTemplate, setSelectedTemplate] = useState<DonationTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<DonationTemplate>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (selectedTemplate) {
      setFormData(selectedTemplate)
    } else {
      setFormData({
        name: "",
        type: "acknowledgment",
        subject: "",
        content: "",
        isActive: true
      })
    }
    setValidationErrors({})
  }, [selectedTemplate, drawerMode])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      errors.name = "Template name is required"
    }

    if (!formData.subject?.trim()) {
      errors.subject = "Subject is required"
    }

    if (!formData.content?.trim()) {
      errors.content = "Content is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    if (drawerMode === "create") {
      const newTemplate: DonationTemplate = {
        ...(formData as DonationTemplate),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      addTemplate(newTemplate)
    } else if (drawerMode === "edit" && selectedTemplate) {
      updateTemplate(selectedTemplate.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      })
    }
    closeDrawer()
  }

  const handleDelete = () => {
    if (selectedTemplate) {
      deleteTemplate(selectedTemplate.id)
      closeDrawer()
    }
    setShowDeleteDialog(false)
  }

  const handleDuplicate = (template: DonationTemplate) => {
    const duplicatedTemplate: DonationTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    addTemplate(duplicatedTemplate)
  }

  const openDrawer = (mode: "create" | "view" | "edit", template?: DonationTemplate) => {
    setDrawerMode(mode)
    setSelectedTemplate(template || null)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setDrawerMode("create")
    setSelectedTemplate(null)
    setFormData({})
    setValidationErrors({})
  }

  const getTemplateTypeInfo = (type: string) => {
    return templateTypes.find(t => t.value === type) || templateTypes[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-r from-red-50 to-orange-45 rounded-xl p-4 sm:p-6 border border-red-100">
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-70">
          <img
            src="/sai-baba-reading-sacred-texts-surrounded-by-books-.png"
            alt="Sai Baba reading sacred texts"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="relative z-10 ml-20 sm:ml-28 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Donation Templates</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
              Create and manage donation templates
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10">
            <Button
              onClick={() => openDrawer("create")}
              className="bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2 text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-all duration-300 transform-gpu" />
              <span className="hidden md:inline">Create Template</span>
              <span className="md:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const typeInfo = getTemplateTypeInfo(template.type)
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      {typeInfo.icon}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{typeInfo.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {template.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{template.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {template.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated: {formatDate(template.updatedAt)}</span>
                  <Badge variant={template.isActive ? "default" : "secondary"} className="text-xs">
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDrawer("view", template)}
                    className="flex-1 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDrawer("edit", template)}
                    className="flex-1 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(template)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template)
                      setShowDeleteDialog(true)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first donation template to get started
          </p>
          <Button
            onClick={() => openDrawer("create")}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}

      {/* Template Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-full sm:w-[500px] lg:w-[600px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {drawerMode === "create" && "Create New Template"}
                  {drawerMode === "view" && "Template Details"}
                  {drawerMode === "edit" && "Edit Template"}
                </SheetTitle>
                <SheetDescription>
                  {drawerMode === "create" && "Create a new donation communication template"}
                  {drawerMode === "view" && "View template details and content"}
                  {drawerMode === "edit" && "Update template information"}
                </SheetDescription>
              </div>
              {drawerMode === "view" && (
                <Button variant="outline" size="sm" onClick={() => setDrawerMode("edit")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Template Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Template Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Template Name *
                </Label>
                {drawerMode === "view" ? (
                  <p className="mt-1 text-sm text-muted-foreground">{formData.name}</p>
                ) : (
                  <>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                    {validationErrors.name && <p className="text-sm text-red-600">{validationErrors.name}</p>}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Template Type
                </Label>
                {drawerMode === "view" ? (
                  <div className="mt-2">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getTemplateTypeInfo(formData.type || "").icon}
                      {getTemplateTypeInfo(formData.type || "").label}
                    </Badge>
                  </div>
                ) : (
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  Subject *
                </Label>
                {drawerMode === "view" ? (
                  <p className="mt-1 text-sm text-muted-foreground">{formData.subject}</p>
                ) : (
                  <>
                    <Input
                      id="subject"
                      value={formData.subject || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                    />
                    {validationErrors.subject && <p className="text-sm text-red-600">{validationErrors.subject}</p>}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content *
                </Label>
                {drawerMode === "view" ? (
                  <div className="mt-1 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{formData.content}</p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      id="content"
                      value={formData.content || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter template content. Use {{donorName}}, {{amount}}, {{currency}}, {{nextPaymentDate}} for dynamic content."
                      rows={8}
                      className="bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent resize-none"
                    />
                    {validationErrors.content && <p className="text-sm text-red-600">{validationErrors.content}</p>}
                    <p className="text-xs text-muted-foreground">
                      Available variables: {`{{donorName}}, {{amount}}, {{currency}}, {{nextPaymentDate}}, {{date}}`}
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Status
                </Label>
                {drawerMode === "view" ? (
                  <div className="mt-2">
                    <Badge variant={formData.isActive ? "default" : "secondary"}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ) : (
                  <Select
                    value={formData.isActive ? "true" : "false"}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === "true" }))}
                  >
                    <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {drawerMode === "view" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Template Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{formData.createdAt ? formatDate(formData.createdAt) : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{formData.updatedAt ? formatDate(formData.updatedAt) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {drawerMode === "view" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setDrawerMode("edit")}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                  <Button variant="outline" onClick={closeDrawer} className="bg-transparent">
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone and will permanently remove the template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-primary-foreground"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
