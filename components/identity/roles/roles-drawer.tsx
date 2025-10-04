"use client"

import { useState, useEffect } from "react"
import { useRolesStore } from "@/stores/roles-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Save, 
  X, 
  Shield, 
  Users, 
  Settings, 
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"

export function RolesDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedRole,
    closeDrawer,
    addRole,
    updateRole,
    permissions
  } = useRolesStore()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "custom" as "admin" | "staff" | "volunteer" | "member" | "custom",
    color: "bg-blue-500",
    icon: "🛡️",
    priority: 1,
    isActive: true,
    isSystem: false,
    permissions: [] as string[],
    restrictions: {
      maxUsers: undefined as number | undefined,
      allowedActions: [] as string[],
      forbiddenActions: [] as string[],
      timeRestrictions: {
        startTime: "",
        endTime: "",
        days: [] as string[]
      }
    },
    metadata: {
      department: "",
      location: "",
      requirements: [] as string[],
      trainingRequired: false
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data when drawer opens or selected role changes
  useEffect(() => {
    if (isDrawerOpen && selectedRole && drawerMode !== "create") {
      setFormData({
        name: selectedRole.name,
        description: selectedRole.description,
        category: selectedRole.category,
        color: selectedRole.color,
        icon: selectedRole.icon,
        priority: selectedRole.priority,
        isActive: selectedRole.isActive,
        isSystem: selectedRole.isSystem,
        permissions: selectedRole.permissions,
        restrictions: {
          maxUsers: selectedRole.restrictions?.maxUsers,
          allowedActions: selectedRole.restrictions?.allowedActions || [],
          forbiddenActions: selectedRole.restrictions?.forbiddenActions || [],
          timeRestrictions: {
            startTime: selectedRole.restrictions?.timeRestrictions?.startTime || "",
            endTime: selectedRole.restrictions?.timeRestrictions?.endTime || "",
            days: selectedRole.restrictions?.timeRestrictions?.days || []
          }
        },
        metadata: {
          department: selectedRole.metadata?.department || "",
          location: selectedRole.metadata?.location || "",
          requirements: selectedRole.metadata?.requirements || [],
          trainingRequired: selectedRole.metadata?.trainingRequired || false
        }
      })
    } else if (isDrawerOpen && drawerMode === "create") {
      // Reset form for new role
      setFormData({
        name: "",
        description: "",
        category: "custom",
        color: "bg-blue-500",
        icon: "🛡️",
        priority: 1,
        isActive: true,
        isSystem: false,
        permissions: [],
        restrictions: {
          maxUsers: undefined,
          allowedActions: [],
          forbiddenActions: [],
          timeRestrictions: {
            startTime: "",
            endTime: "",
            days: []
          }
        },
        metadata: {
          department: "",
          location: "",
          requirements: [],
          trainingRequired: false
        }
      })
    }
  }, [isDrawerOpen, selectedRole, drawerMode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Role description is required"
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const roleData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      color: formData.color,
      icon: formData.icon,
      priority: formData.priority,
      isActive: formData.isActive,
      isSystem: formData.isSystem,
      permissions: formData.permissions,
      restrictions: formData.restrictions.maxUsers || formData.restrictions.allowedActions.length > 0 || formData.restrictions.forbiddenActions.length > 0 || formData.restrictions.timeRestrictions.startTime || formData.restrictions.timeRestrictions.endTime || formData.restrictions.timeRestrictions.days.length > 0 ? formData.restrictions : undefined,
      metadata: formData.metadata.department || formData.metadata.location || formData.metadata.requirements.length > 0 || formData.metadata.trainingRequired ? formData.metadata : undefined,
      createdBy: "Current User" // This would come from auth context
    }

    if (drawerMode === "create") {
      addRole(roleData)
    } else if (selectedRole) {
      updateRole(selectedRole.id, roleData)
    }

    closeDrawer()
  }

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleRequirementAdd = () => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        requirements: [...prev.metadata.requirements, ""]
      }
    }))
  }

  const handleRequirementChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        requirements: prev.metadata.requirements.map((req, i) => i === index ? value : req)
      }
    }))
  }

  const handleRequirementRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        requirements: prev.metadata.requirements.filter((_, i) => i !== index)
      }
    }))
  }

  const isReadOnly = drawerMode === "view"

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {drawerMode === "create" && "Create New Role"}
            {drawerMode === "edit" && "Edit Role"}
            {drawerMode === "view" && "Role Details"}
          </SheetTitle>
          <SheetDescription>
            {drawerMode === "create" && "Create a new role with specific permissions and settings."}
            {drawerMode === "edit" && "Modify the role's permissions and settings."}
            {drawerMode === "view" && "View role details and permissions."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name"
                    disabled={isReadOnly}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                  disabled={isReadOnly}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🛡️"
                    disabled={isReadOnly}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    disabled={isReadOnly}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSystem"
                    checked={formData.isSystem}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSystem: checked }))}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="isSystem">System Role</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={formData.permissions.includes(permission.name)}
                      onCheckedChange={() => handlePermissionToggle(permission.name)}
                      disabled={isReadOnly}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                    <Badge variant="outline">{permission.category}</Badge>
                  </div>
                ))}
              </div>
              {errors.permissions && <p className="text-sm text-red-500 mt-2">{errors.permissions}</p>}
            </CardContent>
          </Card>

          {/* Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Maximum Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.restrictions.maxUsers || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    restrictions: { 
                      ...prev.restrictions, 
                      maxUsers: e.target.value ? parseInt(e.target.value) : undefined 
                    } 
                  }))}
                  placeholder="No limit"
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.restrictions.timeRestrictions.startTime}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      restrictions: { 
                        ...prev.restrictions, 
                        timeRestrictions: { 
                          ...prev.restrictions.timeRestrictions, 
                          startTime: e.target.value 
                        } 
                      } 
                    }))}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.restrictions.timeRestrictions.endTime}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      restrictions: { 
                        ...prev.restrictions, 
                        timeRestrictions: { 
                          ...prev.restrictions.timeRestrictions, 
                          endTime: e.target.value 
                        } 
                      } 
                    }))}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.metadata.department}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      metadata: { 
                        ...prev.metadata, 
                        department: e.target.value 
                      } 
                    }))}
                    placeholder="Enter department"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.metadata.location}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      metadata: { 
                        ...prev.metadata, 
                        location: e.target.value 
                      } 
                    }))}
                    placeholder="Enter location"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                {formData.metadata.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Enter requirement"
                      disabled={isReadOnly}
                    />
                    {!isReadOnly && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRequirementRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRequirementAdd}
                    className="w-full"
                  >
                    Add Requirement
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="trainingRequired"
                  checked={formData.metadata.trainingRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    metadata: { 
                      ...prev.metadata, 
                      trainingRequired: checked 
                    } 
                  }))}
                  disabled={isReadOnly}
                />
                <Label htmlFor="trainingRequired">Training Required</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={closeDrawer}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {drawerMode === "create" ? "Create Role" : "Save Changes"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
