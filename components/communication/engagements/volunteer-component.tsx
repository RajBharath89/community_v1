"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Heart, Users, Clock, CheckCircle, XCircle, AlertCircle, Download, Settings, Plus, Trash2, FileText } from "lucide-react"
import { useEngagementStore, type VolunteerRequest } from "@/stores/engagement-store"

interface VolunteerComponentProps {
  engagementId: string
  messageType: "Event" | "Meeting"
  isEditing: boolean
  currentUser: {
    id: string
    name: string
    email: string
  }
  isAdmin?: boolean
  engagementData?: any
  onUpdateEngagement?: (updates: any) => void
}

export function VolunteerComponent({
  engagementId,
  messageType,
  isEditing,
  currentUser,
  isAdmin = false,
  engagementData,
  onUpdateEngagement,
}: VolunteerComponentProps) {
  const { submitVolunteerRequest, reviewVolunteerRequest, getVolunteerStats, exportVolunteerList, engagements } =
    useEngagementStore()

  const engagement = engagements.find((e) => e.id === engagementId) || engagementData

  const [selectedRole, setSelectedRole] = useState<string>("")
  const [volunteerMessage, setVolunteerMessage] = useState("")
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  const [reviewingRequest, setReviewingRequest] = useState<VolunteerRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  
  // Admin configuration state
  const [volunteerEnabled, setVolunteerEnabled] = useState(engagement?.volunteershipEnabled ?? true)
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false)
  const [newRole, setNewRole] = useState({
    title: "",
    description: "",
    requirements: "",
    timeCommitment: "",
    spotsAvailable: 1,
    applicationForm: "none",
    formDeadline: "",
    formDeadlineEnabled: false,
    autoApproval: false,
  })

  if (!engagement || (messageType !== "Event" && messageType !== "Meeting")) {
    return null
  }

  // Available forms for volunteer applications
  const availableForms = [
    { id: "volunteer-basic", name: "Basic Volunteer Form", description: "Simple volunteer application", fields: 4 },
    { id: "volunteer-detailed", name: "Detailed Volunteer Form", description: "Comprehensive volunteer application", fields: 8 },
    { id: "volunteer-skills", name: "Skills Assessment Form", description: "Skills and experience based form", fields: 6 },
    { id: "volunteer-background", name: "Background Check Form", description: "Background verification form", fields: 10 },
  ]

  // For new engagements, use default volunteer enabled state
  const isVolunteerEnabled = engagement.volunteershipEnabled !== undefined ? engagement.volunteershipEnabled : true
  const volunteerRoles = engagement.volunteerRoles || []

  // Handler to update engagement configuration
  const handleConfigurationChange = (updates: any) => {
    if (onUpdateEngagement) {
      onUpdateEngagement(updates)
    }
  }

  // Determine if we should show admin configuration or user interface
  const showAdminConfig = isEditing && (engagementId === "new-engagement" || !engagementId)

  // Handle adding new volunteer role
  const handleAddRole = () => {
    const roleId = Date.now().toString()
    const newRoleData = {
      id: roleId,
      ...newRole,
      applicationForm: newRole.applicationForm === "none" ? "" : newRole.applicationForm,
      formDeadline: newRole.formDeadlineEnabled ? newRole.formDeadline : undefined,
      autoApproval: newRole.autoApproval,
      spotsFilledCount: 0,
    }
    
    const updatedRoles = [...volunteerRoles, newRoleData]
    handleConfigurationChange({ 
      volunteerRoles: updatedRoles,
      volunteerStats: {
        totalRoles: updatedRoles.length,
        totalSpots: updatedRoles.reduce((sum, role) => sum + role.spotsAvailable, 0),
        filledSpots: 0,
        pendingRequests: 0,
      }
    })
    
    setNewRole({
      title: "",
      description: "",
      requirements: "",
      timeCommitment: "",
      spotsAvailable: 1,
      applicationForm: "none",
      formDeadline: "",
      formDeadlineEnabled: false,
      autoApproval: false,
    })
    setShowAddRoleDialog(false)
  }

  // Handle removing volunteer role
  const handleRemoveRole = (roleId: string) => {
    const updatedRoles = volunteerRoles.filter((role: any) => role.id !== roleId)
    handleConfigurationChange({ 
      volunteerRoles: updatedRoles,
      volunteerStats: {
        totalRoles: updatedRoles.length,
        totalSpots: updatedRoles.reduce((sum: number, role: any) => sum + role.spotsAvailable, 0),
        filledSpots: 0,
        pendingRequests: 0,
      }
    })
  }

  if (!showAdminConfig && (!isVolunteerEnabled || volunteerRoles.length === 0)) {
    return null
  }

  const stats = getVolunteerStats(engagement.id)
  const userRequests = engagement.volunteerRequests?.filter((r) => r.userId === currentUser.id) || []
  const pendingRequests = engagement.volunteerRequests?.filter((r) => r.status === "pending") || []

  const handleVolunteerSubmit = () => {
    if (!selectedRole) return

    const role = engagement.volunteerRoles?.find((r) => r.id === selectedRole)
    if (!role) return

    submitVolunteerRequest(engagement.id, currentUser.id, {
      userName: currentUser.name,
      userEmail: currentUser.email,
      roleId: selectedRole,
      message: volunteerMessage.trim() || undefined,
    })

    setShowRequestDialog(false)
    setSelectedRole("")
    setVolunteerMessage("")
  }

  const handleReviewRequest = (status: "approved" | "rejected") => {
    if (!reviewingRequest) return

    reviewVolunteerRequest(
      engagement.id,
      reviewingRequest.id,
      status,
      "Admin", // In a real app, this would be the current admin's name
      adminNotes.trim() || undefined,
    )

    setReviewingRequest(null)
    setAdminNotes("")
  }

  const handleExportVolunteers = () => {
    const requests = exportVolunteerList(engagement.id)
    const csvContent = [
      ["Name", "Email", "Role", "Status", "Request Date", "Message", "Admin Notes"],
      ...requests.map((r) => {
        const role = engagement.volunteerRoles?.find((role) => role.id === r.roleId)
        return [
          r.userName,
          r.userEmail,
          role?.title || "Unknown Role",
          r.status,
          new Date(r.requestedAt).toLocaleDateString(),
          r.message || "",
          r.adminNotes || "",
        ]
      }),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${engagement.title}-volunteer-requests.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const availableRoles = volunteerRoles.filter((role) => {
    const userHasRequest = userRequests.some((req) => req.roleId === role.id)
    const hasAvailableSpots = role.spotsFilledCount < role.spotsAvailable
    return !userHasRequest && hasAvailableSpots
  })

  // Admin Configuration View (for creating/editing engagements)
  if (showAdminConfig) {
    return (
      <>
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Settings className="h-5 w-5" />
            Volunteer Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Volunteer */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Volunteer Opportunities</Label>
              <p className="text-xs text-gray-500">Allow people to volunteer for this {messageType.toLowerCase()}</p>
            </div>
            <Switch
              checked={volunteerEnabled}
              onCheckedChange={(checked) => {
                setVolunteerEnabled(checked)
                handleConfigurationChange({ volunteershipEnabled: checked })
              }}
            />
          </div>

          {volunteerEnabled && (
            <>
              <Separator />
              
              {/* Volunteer Roles Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Volunteer Roles</Label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowAddRoleDialog(true)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </div>

                {/* Existing Roles */}
                {volunteerRoles.length > 0 ? (
                  <div className="space-y-3">
                    {volunteerRoles.map((role: any) => (
                      <div key={role.id} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{role.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRole(role.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mt-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{role.timeCommitment}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{role.spotsAvailable} spots</span>
                          </div>
                          {role.requirements && (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{role.requirements}</span>
                            </div>
                          )}
                          {role.applicationForm && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>{availableForms.find(f => f.id === role.applicationForm)?.name || "Custom Form"}</span>
                            </div>
                          )}
                          {role.formDeadline && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>Deadline: {new Date(role.formDeadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          {role.applicationForm && !role.formDeadline && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>Default deadline</span>
                            </div>
                          )}
                          {role.autoApproval && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>Auto-approval enabled</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">No volunteer roles added yet</p>
                    <p className="text-xs text-gray-500 mt-1">Click "Add Role" to create volunteer opportunities</p>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              {volunteerRoles.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Volunteer Opportunities</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center mb-4">
                      <div className="p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="text-sm font-semibold text-purple-600">{volunteerRoles.length}</div>
                        <div className="text-xs text-purple-600">Roles</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-sm font-semibold text-blue-600">
                          0/{volunteerRoles.reduce((sum: number, role: any) => sum + role.spotsAvailable, 0)}
                        </div>
                        <div className="text-xs text-blue-600">Filled</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded border border-green-200">
                        <div className="text-sm font-semibold text-green-600">
                          {volunteerRoles.reduce((sum: number, role: any) => sum + role.spotsAvailable, 0)}
                        </div>
                        <div className="text-xs text-green-600">Available</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                        <div className="text-sm font-semibold text-yellow-600">0</div>
                        <div className="text-xs text-yellow-600">Pending</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {volunteerRoles.slice(0, 2).map((role: any) => (
                        <div key={role.id} className="p-2 bg-gray-50 rounded border text-sm">
                          <div className="font-medium">{role.title}</div>
                          <div className="text-gray-600 text-xs mt-1">{role.description}</div>
                          {role.autoApproval && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Auto-approval enabled</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {volunteerRoles.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          ...and {volunteerRoles.length - 2} more roles
                        </div>
                      )}
                    </div>

                    {/* Auto-Approval Summary */}
                    {volunteerRoles.some((role: any) => role.autoApproval) && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Auto-Approval Summary</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          <p>• {volunteerRoles.filter((role: any) => role.autoApproval).length} role{volunteerRoles.filter((role: any) => role.autoApproval).length !== 1 ? 's' : ''} with auto-approval enabled</p>
                          <p>• Volunteers will be automatically approved based on FIFO and form completion</p>
                          <p>• Reduces admin workload for approval process</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Configuration Summary */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Configuration Summary</span>
                </div>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Volunteer opportunities are {volunteerEnabled ? "enabled" : "disabled"}</li>
                  {volunteerEnabled && <li>• {volunteerRoles.length} volunteer role{volunteerRoles.length !== 1 ? 's' : ''} configured</li>}
                  {volunteerEnabled && <li>• {volunteerRoles.reduce((sum: number, role: any) => sum + role.spotsAvailable, 0)} total volunteer spots available</li>}
                  {volunteerEnabled && volunteerRoles.some((role: any) => role.autoApproval) && (
                    <li>• {volunteerRoles.filter((role: any) => role.autoApproval).length} role{volunteerRoles.filter((role: any) => role.autoApproval).length !== 1 ? 's' : ''} with auto-approval enabled</li>
                  )}
                  {volunteerEnabled && volunteerRoles.some((role: any) => role.formDeadline) && (
                    <li>• {volunteerRoles.filter((role: any) => role.formDeadline).length} role{volunteerRoles.filter((role: any) => role.formDeadline).length !== 1 ? 's' : ''} with form deadlines</li>
                  )}
                  {volunteerEnabled && volunteerRoles.length === 0 && <li>• No volunteer roles added yet</li>}
                </ul>
              </div>
            </>
          )}

          {!volunteerEnabled && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">Volunteer opportunities are disabled for this {messageType.toLowerCase()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Volunteer Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-title" className="text-sm font-medium">
                  Role Title *
                </Label>
                <Input
                  id="role-title"
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  placeholder="e.g., Event Coordinator"
                  className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-spots" className="text-sm font-medium">
                  Available Spots *
                </Label>
                <Input
                  id="role-spots"
                  type="number"
                  min="1"
                  value={newRole.spotsAvailable}
                  onChange={(e) => setNewRole({ ...newRole, spotsAvailable: parseInt(e.target.value) || 1 })}
                  className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="role-description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe what this volunteer role involves..."
                rows={3}
                className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-requirements" className="text-sm font-medium">
                Requirements (Optional)
              </Label>
              <Input
                id="role-requirements"
                value={newRole.requirements}
                onChange={(e) => setNewRole({ ...newRole, requirements: e.target.value })}
                placeholder="e.g., Good communication skills"
                className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-time" className="text-sm font-medium">
                Time Commitment *
              </Label>
              <Input
                id="role-time"
                value={newRole.timeCommitment}
                onChange={(e) => setNewRole({ ...newRole, timeCommitment: e.target.value })}
                placeholder="e.g., 2-3 hours"
                className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-form" className="text-sm font-medium">
                Application Form (Optional)
              </Label>
              <Select
                value={newRole.applicationForm}
                onValueChange={(value) => setNewRole({ ...newRole, applicationForm: value })}
              >
                <SelectTrigger className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select an application form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No form required</SelectItem>
                  {availableForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-medium">{form.name}</div>
                          <div className="text-xs text-gray-500">{form.description} • {form.fields} fields</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Volunteers will need to fill out this form when applying for this role
              </p>
            </div>

            {/* Form Deadline Toggle and Input - Only show if a form is selected */}
            {newRole.applicationForm !== "none" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Form Submission Deadline</Label>
                    <p className="text-xs text-gray-500">
                      Set a specific deadline for form submission
                    </p>
                  </div>
                  <Switch
                    checked={newRole.formDeadlineEnabled}
                    onCheckedChange={(checked) => setNewRole({ ...newRole, formDeadlineEnabled: checked })}
                  />
                </div>
                
                {newRole.formDeadlineEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="role-deadline" className="text-sm font-medium">
                      Deadline Date & Time *
                    </Label>
                    <Input
                      id="role-deadline"
                      type="datetime-local"
                      value={newRole.formDeadline}
                      onChange={(e) => setNewRole({ ...newRole, formDeadline: e.target.value })}
                      className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                      required={newRole.formDeadlineEnabled}
                    />
                    <p className="text-xs text-gray-500">
                      Volunteers must submit the form by this deadline to be considered
                    </p>
                  </div>
                )}
                
                {!newRole.formDeadlineEnabled && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">Default Deadline:</p>
                        <p>• Will use the engagement close date + time</p>
                        <p>• If no close date is set, form remains open indefinitely</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auto-Approval Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto-Approval</Label>
                  <p className="text-xs text-gray-500">
                    Automatically approve volunteers based on FIFO and form completion
                  </p>
                </div>
                <Switch
                  checked={newRole.autoApproval}
                  onCheckedChange={(checked) => setNewRole({ ...newRole, autoApproval: checked })}
                />
              </div>
              
              {newRole.autoApproval && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Auto-approval will:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Approve volunteers in order of application (FIFO)</li>
                        <li>• Only approve if form is completed before deadline</li>
                        <li>• Stop when all spots are filled</li>
                        <li>• Reduce admin workload for approval process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-800">{newRole.title || "Role Title"}</h4>
                    <p className="text-sm text-purple-700 mt-1">{newRole.description || "Role description will appear here"}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    0/{newRole.spotsAvailable} filled
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-purple-600 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{newRole.timeCommitment || "Time commitment"}</span>
                  </div>
                  {newRole.requirements && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{newRole.requirements}</span>
                    </div>
                  )}
                  {newRole.applicationForm && newRole.applicationForm !== "none" && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{availableForms.find(f => f.id === newRole.applicationForm)?.name}</span>
                    </div>
                  )}
                  {newRole.formDeadlineEnabled && newRole.formDeadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: {new Date(newRole.formDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {newRole.formDeadlineEnabled && !newRole.formDeadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: Not set</span>
                    </div>
                  )}
                  {!newRole.formDeadlineEnabled && newRole.applicationForm !== "none" && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Default deadline</span>
                    </div>
                  )}
                  {newRole.autoApproval && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Auto-approval enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddRole}
              disabled={
                !newRole.title || 
                !newRole.description || 
                !newRole.timeCommitment ||
                (newRole.formDeadlineEnabled && !newRole.formDeadline)
              }
              className="bg-purple-500 hover:bg-purple-600"
            >
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
  }

  // User Interface View (for viewing/responding to engagements)
  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Heart className="h-5 w-5" />
          Volunteer Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Volunteer Statistics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-purple-50 rounded border border-purple-200">
            <div className="text-lg font-semibold text-purple-600">{stats.totalRoles}</div>
            <div className="text-xs text-purple-600">Roles</div>
          </div>
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-lg font-semibold text-blue-600">
              {stats.filledSpots}/{stats.totalSpots}
            </div>
            <div className="text-xs text-blue-600">Filled</div>
          </div>
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-semibold text-green-600">{stats.totalSpots - stats.filledSpots}</div>
            <div className="text-xs text-green-600">Available</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-lg font-semibold text-yellow-600">{stats.pendingRequests}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
        </div>

        {/* Available Volunteer Roles */}
        <div className="space-y-3">
          <h4 className="font-medium text-purple-800">Available Roles</h4>
          {volunteerRoles.map((role) => {
            const userRequest = userRequests.find((req) => req.roleId === role.id)
            const isAvailable = role.spotsFilledCount < role.spotsAvailable

            return (
              <div key={role.id} className="p-3 bg-white rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-900">{role.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {role.spotsFilledCount}/{role.spotsAvailable} filled
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{role.timeCommitment}</span>
                      </div>
                      {role.requirements && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{role.requirements}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {userRequest ? (
                      <Badge variant="outline" className={getStatusColor(userRequest.status)}>
                        {getStatusIcon(userRequest.status)}
                        <span className="ml-1 capitalize">{userRequest.status}</span>
                      </Badge>
                    ) : isAvailable ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role.id)
                          setShowRequestDialog(true)
                        }}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Volunteer
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Full
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* User's Volunteer Requests */}
        {userRequests.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-purple-800">Your Volunteer Requests</h4>
            {userRequests.map((request) => {
              const role = engagement.volunteerRoles?.find((r) => r.id === request.roleId)
              return (
                <div key={request.id} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{role?.title}</h5>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Requested on {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                  {request.message && <p className="text-sm text-gray-600 italic mb-2">"{request.message}"</p>}
                  {request.adminNotes && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Admin Note:</strong> {request.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdminView(!showAdminView)}>
                <Users className="h-4 w-4 mr-2" />
                {showAdminView ? "Hide" : "Manage"} Requests
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportVolunteers}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {showAdminView && engagement.volunteerRequests && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {engagement.volunteerRequests.map((request) => {
                  const role = engagement.volunteerRoles?.find((r) => r.id === request.roleId)
                  return (
                    <div key={request.id} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{request.userName}</span>
                          <span className="text-gray-500 ml-2">{request.userEmail}</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Role:</strong> {role?.title}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                      {request.message && <p className="text-sm text-gray-600 italic mb-2">"{request.message}"</p>}
                      {request.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => setReviewingRequest(request)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Volunteer Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Volunteer Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRole && (
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                {(() => {
                  const role = engagement.volunteerRoles?.find((r) => r.id === selectedRole)
                  return role ? (
                    <div>
                      <h4 className="font-medium text-purple-800 mb-2">{role.title}</h4>
                      <p className="text-sm text-purple-700 mb-2">{role.description}</p>
                      <div className="flex items-center gap-4 text-xs text-purple-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{role.timeCommitment}</span>
                        </div>
                        {role.requirements && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{role.requirements}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <div>
              <Label htmlFor="volunteer-message" className="text-sm font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="volunteer-message"
                value={volunteerMessage}
                onChange={(e) => setVolunteerMessage(e.target.value)}
                placeholder="Tell us why you'd like to volunteer for this role..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVolunteerSubmit}
              disabled={!selectedRole}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Review Dialog */}
      <Dialog open={!!reviewingRequest} onOpenChange={() => setReviewingRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Volunteer Request</DialogTitle>
          </DialogHeader>
          {reviewingRequest && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded border">
                <p>
                  <strong>Volunteer:</strong> {reviewingRequest.userName}
                </p>
                <p>
                  <strong>Email:</strong> {reviewingRequest.userEmail}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {engagement.volunteerRoles?.find((r) => r.id === reviewingRequest.roleId)?.title}
                </p>
                <p>
                  <strong>Requested:</strong> {new Date(reviewingRequest.requestedAt).toLocaleDateString()}
                </p>
                {reviewingRequest.message && (
                  <p>
                    <strong>Message:</strong> "{reviewingRequest.message}"
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes for the volunteer..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewingRequest(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleReviewRequest("rejected")}>
              Reject
            </Button>
            <Button onClick={() => handleReviewRequest("approved")} className="bg-green-500 hover:bg-green-600">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
