"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { AdvancedTargeting } from "./advanced-targeting"
import { FormDistribution } from "./form-distribution"
import {
  Save,
  Copy,
  Trash2,
  CheckCircle,
  Archive,
  ExternalLink,
  Settings,
  Users,
  Calendar,
  Clock,
  Bell,
  FileText,
  ClipboardList,
  UserCheck,
  MessageSquare,
  Trophy,
} from "lucide-react"
import { useFormStore, type Form, type FormSettings } from "@/stores/form-store"
import { useGroupStore } from "@/stores/group-store"
import { useUserStore } from "@/stores/user-store"
import { FormDesigner } from "./form-designer"

const getFormTypeIcon = (type: string) => {
  switch (type) {
    case "Survey":
      return <ClipboardList className="h-4 w-4" />
    case "Registration":
      return <UserCheck className="h-4 w-4" />
    case "Feedback":
      return <MessageSquare className="h-4 w-4" />
    case "Application":
      return <FileText className="h-4 w-4" />
    case "RSVP":
      return <Calendar className="h-4 w-4" />
    case "Volunteer":
      return <Trophy className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export function FormDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedForm,
    closeDrawer,
    addForm,
    updateForm,
    deleteForm,
    duplicateForm,
    publishForm,
    archiveForm,
  } = useFormStore()

  const { groups } = useGroupStore()
  const { users } = useUserStore()

  const [formData, setFormData] = useState<Partial<Form>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Initialize form data when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      if (drawerMode === "create") {
        setFormData({
          name: "",
          description: "",
          status: "Draft",
          formType: "Survey",
          fields: [],
          settings: {
            allowMultipleSubmissions: false,
            requireAuthentication: false,
            showProgressBar: true,
            notifications: {
              sendToAdmin: true,
              sendConfirmationToUser: true,
            },
            expiry: {
              enabled: false,
            },
          },
          targetAudience: "all",
          targetGroups: [],
          targetUsers: [],
          isTemplate: false,
          submissionCount: 0,
          viewCount: 0,
          completionRate: 0,
          createdDate: new Date().toISOString().split("T")[0],
          createdBy: "Current User",
        })
      } else if (selectedForm) {
        setFormData({ ...selectedForm })
      }
    }
    setIsEditing(drawerMode === "create" || drawerMode === "edit")
    setValidationErrors({})
    setActiveTab("basic")
  }, [selectedForm, drawerMode, isDrawerOpen])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = "Form name is required"
    if (!formData.formType) errors.formType = "Form type is required"
    if (!formData.targetAudience) errors.targetAudience = "Target audience is required"

    if (formData.targetAudience === "groups" && (!formData.targetGroups || formData.targetGroups.length === 0)) {
      errors.targetGroups = "At least one group must be selected"
    }

    if (formData.targetAudience === "users" && (!formData.targetUsers || formData.targetUsers.length === 0)) {
      errors.targetUsers = "At least one user must be selected"
    }

    if (formData.targetAudience === "mixed") {
      if (
        (!formData.targetGroups || formData.targetGroups.length === 0) &&
        (!formData.targetUsers || formData.targetUsers.length === 0)
      ) {
        errors.targetSelection = "At least one group or user must be selected"
      }
    }

    if (formData.fields && formData.fields.length === 0) {
      errors.fields = "At least one form field is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const formDataToSave = {
      ...formData,
      lastModified: new Date().toISOString().split("T")[0],
    } as Form

    if (drawerMode === "create") {
      addForm(formDataToSave)
    } else if (drawerMode === "edit") {
      updateForm(selectedForm!.id, formDataToSave)
    }

    closeDrawer()
  }

  const handlePublish = () => {
    if (!validateForm()) return

    const formDataToSave = {
      ...formData,
      status: "Published" as const,
      publishedDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    } as Form

    if (drawerMode === "create") {
      addForm(formDataToSave)
    } else if (selectedForm) {
      publishForm(selectedForm.id)
    }

    closeDrawer()
  }

  const confirmDelete = () => {
    if (selectedForm) {
      deleteForm(selectedForm.id)
      setShowDeleteDialog(false)
      closeDrawer()
    }
  }

  const confirmDuplicate = () => {
    if (selectedForm) {
      duplicateForm(selectedForm.id)
      setShowDuplicateDialog(false)
      closeDrawer()
    }
  }

  const updateFormData = (updates: Partial<Form>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateSettings = (updates: Partial<FormSettings>) => {
    setFormData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }))
  }

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">
                  {drawerMode === "create" && "Create New Form"}
                  {drawerMode === "edit" && "Edit Form"}
                  {drawerMode === "view" && "View Form"}
                </span>
                {selectedForm && <span className="text-sm text-muted-foreground">ID: {selectedForm.id}</span>}
              </div>
              <div className="flex items-center space-x-2">
                {drawerMode === "view" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="builder">Form Builder</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Form Details</span>
                    </CardTitle>
                    <CardDescription>Configure the basic information for your form</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Form Name *</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="Enter form name"
                        disabled={!isEditing}
                        className={validationErrors.name ? "border-red-500" : ""}
                      />
                      {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Enter form description"
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="formType">Form Type *</Label>
                        <Select
                          value={formData.formType || ""}
                          onValueChange={(value) => updateFormData({ formType: value as any })}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={validationErrors.formType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select form type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Survey">
                              <div className="flex items-center space-x-2">
                                <ClipboardList className="h-4 w-4" />
                                <span>Survey</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Registration">
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4" />
                                <span>Registration</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Feedback">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Feedback</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Application">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>Application</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="RSVP">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>RSVP</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Volunteer">
                              <div className="flex items-center space-x-2">
                                <Trophy className="h-4 w-4" />
                                <span>Volunteer</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {validationErrors.formType && (
                          <p className="text-sm text-red-500">{validationErrors.formType}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center space-x-2">
                          {formData.status && (
                            <Badge variant="outline">
                              {formData.status === "Published" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {formData.status === "Draft" && <FileText className="h-3 w-3 mr-1" />}
                              {formData.status === "Archived" && <Archive className="h-3 w-3 mr-1" />}
                              {formData.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isTemplate"
                        checked={formData.isTemplate || false}
                        onCheckedChange={(checked) => updateFormData({ isTemplate: checked })}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="isTemplate">Save as template</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="builder" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Form Builder</span>
                    </CardTitle>
                    <CardDescription>Design your form by adding and configuring fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="h-[600px] border rounded-lg">
                        <FormDesigner />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Form preview will be shown here</p>
                        <p className="text-sm">Switch to edit mode to modify the form</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Target Audience</span>
                    </CardTitle>
                    <CardDescription>Define who can access and submit this form</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdvancedTargeting
                      formData={formData}
                      setFormData={updateFormData}
                      isEditing={isEditing}
                      validationErrors={validationErrors}
                      groups={groups}
                      users={users}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="distribution">Distribution</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5" />
                            <span>Form Settings</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Multiple Submissions</Label>
                              <p className="text-sm text-gray-500">Allow users to submit multiple times</p>
                            </div>
                            <Switch
                              checked={formData.settings?.allowMultipleSubmissions || false}
                              onCheckedChange={(checked) => updateSettings({ allowMultipleSubmissions: checked })}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Require Authentication</Label>
                              <p className="text-sm text-gray-500">Users must be logged in</p>
                            </div>
                            <Switch
                              checked={formData.settings?.requireAuthentication || false}
                              onCheckedChange={(checked) => updateSettings({ requireAuthentication: checked })}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Show Progress Bar</Label>
                              <p className="text-sm text-gray-500">Display completion progress</p>
                            </div>
                            <Switch
                              checked={formData.settings?.showProgressBar || false}
                              onCheckedChange={(checked) => updateSettings({ showProgressBar: checked })}
                              disabled={!isEditing}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <span>Notifications</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Notify Admin</Label>
                              <p className="text-sm text-gray-500">Send notifications to admin</p>
                            </div>
                            <Switch
                              checked={formData.settings?.notifications?.sendToAdmin || false}
                              onCheckedChange={(checked) =>
                                updateSettings({
                                  notifications: { ...formData.settings?.notifications, sendToAdmin: checked },
                                })
                              }
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>User Confirmation</Label>
                              <p className="text-sm text-gray-500">Send confirmation to user</p>
                            </div>
                            <Switch
                              checked={formData.settings?.notifications?.sendConfirmationToUser || false}
                              onCheckedChange={(checked) =>
                                updateSettings({
                                  notifications: {
                                    ...formData.settings?.notifications,
                                    sendConfirmationToUser: checked,
                                  },
                                })
                              }
                              disabled={!isEditing}
                            />
                          </div>

                          {formData.settings?.notifications?.sendToAdmin && (
                            <div className="space-y-2">
                              <Label htmlFor="adminEmail">Admin Email</Label>
                              <Input
                                id="adminEmail"
                                type="email"
                                value={formData.settings?.notifications?.adminEmail || ""}
                                onChange={(e) =>
                                  updateSettings({
                                    notifications: { ...formData.settings?.notifications, adminEmail: e.target.value },
                                  })
                                }
                                placeholder="admin@temple.org"
                                disabled={!isEditing}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <span>Form Expiry</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Enable Expiry</Label>
                              <p className="text-sm text-gray-500">Set form expiration date</p>
                            </div>
                            <Switch
                              checked={formData.settings?.expiry?.enabled || false}
                              onCheckedChange={(checked) =>
                                updateSettings({
                                  expiry: { ...formData.settings?.expiry, enabled: checked },
                                })
                              }
                              disabled={!isEditing}
                            />
                          </div>

                          {formData.settings?.expiry?.enabled && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  type="date"
                                  value={formData.settings?.expiry?.expiryDate || ""}
                                  onChange={(e) =>
                                    updateSettings({
                                      expiry: { ...formData.settings?.expiry, expiryDate: e.target.value },
                                    })
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="expiryTime">Expiry Time</Label>
                                <Input
                                  id="expiryTime"
                                  type="time"
                                  value={formData.settings?.expiry?.expiryTime || ""}
                                  onChange={(e) =>
                                    updateSettings({
                                      expiry: { ...formData.settings?.expiry, expiryTime: e.target.value },
                                    })
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {drawerMode === "view" && selectedForm && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <ExternalLink className="h-5 w-5" />
                              <span>Form Access</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedForm.formUrl && (
                              <div className="space-y-2">
                                <Label>Form URL</Label>
                                <div className="flex items-center space-x-2">
                                  <Input value={selectedForm.formUrl} readOnly className="bg-gray-50" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(selectedForm.formUrl, "_blank")}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label>Submissions</Label>
                                <p className="text-lg font-semibold">{selectedForm.submissionCount}</p>
                              </div>
                              <div>
                                <Label>Completion Rate</Label>
                                <p className="text-lg font-semibold">{selectedForm.completionRate.toFixed(1)}%</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="distribution" className="space-y-4">
                    <FormDistribution formData={formData} updateSettings={updateSettings} isEditing={isEditing} />
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Analytics</CardTitle>
                        <CardDescription>View form performance and submission analytics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <p>Analytics will be available after form is published</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-2">
              {drawerMode === "view" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDuplicateDialog(true)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  {selectedForm?.formUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedForm.formUrl, "_blank")}
                      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Form
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
              {isEditing && (
                <>
                  <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handlePublish} className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish Form
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedForm?.name}"? This action cannot be undone and will permanently
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

      {/* Duplicate Confirmation Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Form</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of "{selectedForm?.name}" as a new draft form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDuplicate} className="bg-red-500 hover:bg-red-600">
              Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
