"use client"

import { useState, useEffect } from "react"
import { useGroupStore } from "@/stores/group-store"
import { useUserStore } from "@/stores/user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { WarningModal } from "@/components/ui/warning-modal"
import {
  Edit,
  Copy,
  Trash2,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  Shuffle,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Search,
  Crown,
  Church,
  Shield,
  Heart,
} from "lucide-react"
import type { Group } from "@/stores/group-store"

const groupTypes = [
  { value: "role-based", label: "Role-based", icon: UserCheck },
  { value: "user-based", label: "User-based", icon: UserPlus },
  { value: "mixed", label: "Mixed", icon: Shuffle },
]

const statuses = [
  { value: "Active", label: "Active", icon: CheckCircle },
  { value: "Inactive", label: "Inactive", icon: XCircle },
]

const availableRoles = ["Admin", "Priest", "Trustee", "Volunteer", "Devotee"]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Crown className="h-4 w-4 text-purple-500" />
    case "Priest":
      return <Church className="h-4 w-4 text-blue-500" />
    case "Trustee":
      return <Shield className="h-4 w-4 text-indigo-500" />
    case "Volunteer":
      return <Heart className="h-4 w-4 text-pink-500" />
    case "Devotee":
      return <User className="h-4 w-4 text-gray-500" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

const getGroupTypeIcon = (type: string) => {
  switch (type) {
    case "role-based":
      return <UserCheck className="h-4 w-4 text-blue-500" />
    case "user-based":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "mixed":
      return <Shuffle className="h-4 w-4 text-purple-500" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "Inactive":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Users className="h-4 w-4 text-gray-500" />
  }
}

export function GroupDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedGroup,
    closeDrawer,
    addGroup,
    updateGroup,
    deleteGroup,
    duplicateGroup,
    toggleGroupStatus,
  } = useGroupStore()

  const { users } = useUserStore()

  const [formData, setFormData] = useState<Partial<Group>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [userSearchTerm, setUserSearchTerm] = useState("")

  useEffect(() => {
    if (selectedGroup) {
      setFormData(selectedGroup)
    } else {
      setFormData({
        name: "",
        description: "",
        status: "Active",
        groupType: "role-based",
        roleMembers: [],
        userMembers: [],
        memberCount: 0,
        createdBy: "Admin",
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
      })
    }
    setIsEditing(drawerMode === "create" || drawerMode === "edit")
    setValidationErrors({})
    setUserSearchTerm("")
  }, [selectedGroup, drawerMode])

  const calculateMemberCount = () => {
    let count = 0

    // Count users from selected roles
    if (formData.roleMembers && formData.roleMembers.length > 0) {
      formData.roleMembers.forEach((role) => {
        count += users.filter((user) => user.role === role).length
      })
    }

    // Add individually selected users (avoid double counting)
    if (formData.userMembers && formData.userMembers.length > 0) {
      const roleBasedUserIds = new Set()
      if (formData.roleMembers && formData.roleMembers.length > 0) {
        users.forEach((user) => {
          if (formData.roleMembers!.includes(user.role)) {
            roleBasedUserIds.add(user.id)
          }
        })
      }

      const uniqueUserMembers = formData.userMembers.filter((userId) => !roleBasedUserIds.has(userId))
      count += uniqueUserMembers.length
    }

    return count
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      errors.name = "Group name is required"
    }

    if (!formData.groupType) {
      errors.groupType = "Group type is required"
    }

    if (!formData.status) {
      errors.status = "Status is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const memberCount = calculateMemberCount()

    if (drawerMode === "create") {
      const newGroup: Group = {
        ...(formData as Group),
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        memberCount,
      }
      addGroup(newGroup)
    } else if (drawerMode === "edit" && selectedGroup) {
      updateGroup(selectedGroup.id, {
        ...formData,
        lastModified: new Date().toISOString().split("T")[0],
        memberCount,
      })
    }
    closeDrawer()
  }

  const handleRoleToggle = (role: string) => {
    if (!isEditing) return

    setFormData((prev) => {
      const currentRoles = prev.roleMembers || []
      const newRoles = currentRoles.includes(role) ? currentRoles.filter((r) => r !== role) : [...currentRoles, role]

      return { ...prev, roleMembers: newRoles }
    })
  }

  const handleUserToggle = (userId: string) => {
    if (!isEditing) return

    setFormData((prev) => {
      const currentUsers = prev.userMembers || []
      const newUsers = currentUsers.includes(userId)
        ? currentUsers.filter((u) => u !== userId)
        : [...currentUsers, userId]

      return { ...prev, userMembers: newUsers }
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const handleCancel = () => {
    closeDrawer()
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (selectedGroup) {
      deleteGroup(selectedGroup.id)
      closeDrawer()
    }
    setShowDeleteDialog(false)
  }

  const handleDuplicate = () => {
    setShowDuplicateDialog(true)
  }

  const confirmDuplicate = () => {
    if (selectedGroup) {
      duplicateGroup(selectedGroup.id)
      closeDrawer()
    }
    setShowDuplicateDialog(false)
  }

  const handleToggleStatus = () => {
    if (formData.status === "Active") {
      setShowDeactivateDialog(true)
    } else {
      if (selectedGroup) {
        toggleGroupStatus(selectedGroup.id)
        setFormData((prev) => ({ ...prev, status: "Active" }))
      }
    }
  }

  const confirmDeactivate = () => {
    if (selectedGroup) {
      toggleGroupStatus(selectedGroup.id)
      setFormData((prev) => ({ ...prev, status: "Inactive" }))
    }
    setShowDeactivateDialog(false)
  }

  return (
    <>
      <WarningModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Group"
        description={`Are you sure you want to permanently delete "${formData.name}"? This action cannot be undone and will remove the group and all its member associations.`}
        confirmText="Delete Permanently"
        confirmVariant="destructive"
      />

      <WarningModal
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        onConfirm={confirmDuplicate}
        title="Duplicate Group"
        description={`This will create a copy of "${formData.name}" with the same settings and member configuration. The new group will have "(Copy)" added to its name.`}
        confirmText="Create Duplicate"
        confirmVariant="default"
      />

      <WarningModal
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate Group"
        description={`Are you sure you want to deactivate "${formData.name}"? This will prevent the group from being used for communications and activities.`}
        confirmText="Deactivate Group"
        confirmVariant="destructive"
      />

      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {drawerMode === "create" && "Create New Group"}
                  {drawerMode === "view" && "Group Details"}
                  {drawerMode === "edit" && "Edit Group"}
                </SheetTitle>
                <SheetDescription>
                  {drawerMode === "create" && "Create a new group for organizing users"}
                  {drawerMode === "view" && "View and manage group information"}
                  {drawerMode === "edit" && "Update group information"}
                </SheetDescription>
              </div>
              {drawerMode === "view" && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* ... existing basic information section ... */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Group Name *
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter group name"
                        className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                      />
                      {validationErrors.name && <p className="text-sm text-red-600">{validationErrors.name}</p>}
                    </>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{formData.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter group description"
                      rows={3}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent resize-none"
                    />
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{formData.description || "No description provided"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* ... existing group type and status section ... */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupType" className="text-sm font-medium">
                  Group Type *
                </Label>
                {isEditing ? (
                  <>
                    <Select
                      value={formData.groupType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, groupType: value }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {validationErrors.groupType && <p className="text-sm text-red-600">{validationErrors.groupType}</p>}
                  </>
                ) : (
                  <div className="mt-2">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getGroupTypeIcon(formData.groupType || "")}
                      {formData.groupType?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status *
                </Label>
                {isEditing ? (
                  <>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="border-0 bg-muted/50 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => {
                          const Icon = status.icon
                          return (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {status.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {validationErrors.status && <p className="text-sm text-red-600">{validationErrors.status}</p>}
                  </>
                ) : (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 w-fit ${
                        formData.status === "Active"
                          ? "text-green-700 border-green-200 bg-green-50"
                          : "text-red-700 border-red-200 bg-red-50"
                      }`}
                    >
                      {getStatusIcon(formData.status || "")}
                      {formData.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium">Member Configuration</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{calculateMemberCount()} members</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Role Selection for role-based and mixed groups */}
                {(formData.groupType === "role-based" || formData.groupType === "mixed") && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Select Roles</Label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-3">
                        {availableRoles.map((role) => (
                          <div
                            key={role}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <Checkbox
                              id={`role-${role}`}
                              checked={formData.roleMembers?.includes(role) || false}
                              onCheckedChange={() => handleRoleToggle(role)}
                              className="hover:scale-110 transition-transform duration-200"
                            />
                            <Label
                              htmlFor={`role-${role}`}
                              className="flex items-center space-x-2 cursor-pointer flex-1"
                            >
                              {getRoleIcon(role)}
                              <span>{role}</span>
                              <span className="text-xs text-gray-500 ml-auto">
                                ({users.filter((user) => user.role === role).length} users)
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2">
                        {formData.roleMembers && formData.roleMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.roleMembers.map((role) => (
                              <Badge key={role} variant="secondary" className="flex items-center gap-1">
                                {getRoleIcon(role)}
                                {role}
                                <span className="text-xs">({users.filter((user) => user.role === role).length})</span>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No roles selected</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* User Selection for user-based and mixed groups */}
                {(formData.groupType === "user-based" || formData.groupType === "mixed") && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Select Individual Users</Label>
                    {isEditing ? (
                      <div className="space-y-3">
                        {/* User Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search users..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="pl-10 border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
                          />
                        </div>

                        {/* User List */}
                        <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
                          {filteredUsers.map((user) => {
                            const isAlreadyIncludedByRole = formData.roleMembers?.includes(user.role) || false
                            return (
                              <div
                                key={user.id}
                                className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 ${
                                  isAlreadyIncludedByRole ? "bg-blue-50 border border-blue-200" : ""
                                }`}
                              >
                                <Checkbox
                                  id={`user-${user.id}`}
                                  checked={formData.userMembers?.includes(user.id) || isAlreadyIncludedByRole}
                                  onCheckedChange={() => handleUserToggle(user.id)}
                                  disabled={isAlreadyIncludedByRole}
                                  className="hover:scale-110 transition-transform duration-200"
                                />
                                <div className="flex items-center space-x-2 flex-1">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                  </div>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {getRoleIcon(user.role)}
                                    {user.role}
                                  </Badge>
                                  {isAlreadyIncludedByRole && (
                                    <span className="text-xs text-blue-600 font-medium">Via Role</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          {filteredUsers.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No users found</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        {formData.userMembers && formData.userMembers.length > 0 ? (
                          <div className="space-y-2">
                            {formData.userMembers.map((userId) => {
                              const user = users.find((u) => u.id === userId)
                              return user ? (
                                <div key={userId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium">{user.name}</span>
                                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    {getRoleIcon(user.role)}
                                    {user.role}
                                  </Badge>
                                </div>
                              ) : null
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No individual users selected</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* ... existing group information section ... */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium">Group Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Member Count</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{calculateMemberCount()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Created By</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formData.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Created Date</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formData.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Modified</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formData.lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ... existing action buttons ... */}
            <div className="flex flex-wrap gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  {drawerMode === "view" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleDuplicate}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                        className={
                          formData.status === "Active"
                            ? "text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-300"
                        }
                      >
                        {formData.status === "Active" ? (
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
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
