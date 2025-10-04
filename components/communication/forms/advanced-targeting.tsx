"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Search, AlertTriangle, CheckCircle, Users2, UserCheck, Globe } from "lucide-react"

interface Group {
  id: string
  name: string
  memberCount: number
}

interface AdvancedTargetingProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  validationErrors: Record<string, string>
  groups: any[]
  users: any[]
}

const targetAudiences = [
  { value: "all", label: "All Users", icon: Globe, description: "Send to all users in the system" },
  { value: "groups", label: "Specific Groups", icon: Users2, description: "Target specific user groups" },
  { value: "users", label: "Individual Users", icon: Users, description: "Select individual users" },
  { value: "mixed", label: "Groups + Users", icon: UserCheck, description: "Combine groups and individual users" },
]

export function AdvancedTargeting({
  formData,
  setFormData,
  isEditing,
  validationErrors,
  groups,
  users,
}: AdvancedTargetingProps) {
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")

  const calculateTotalRecipients = () => {
    let total = 0

    if (formData.targetAudience === "all") {
      total = users.length
    } else if (formData.targetAudience === "groups") {
      const selectedGroups = groups.filter((g) => formData.targetGroups?.includes(g.id))
      total = selectedGroups.reduce((sum, group) => sum + group.memberCount, 0)
    } else if (formData.targetAudience === "users") {
      total = formData.targetUsers?.length || 0
    } else if (formData.targetAudience === "mixed") {
      const selectedGroups = groups.filter((g) => formData.targetGroups?.includes(g.id))
      const groupMembers = selectedGroups.reduce((sum, group) => sum + group.memberCount, 0)
      const individualUsers = formData.targetUsers?.length || 0
      total = groupMembers + individualUsers
    }

    return total
  }

  useEffect(() => {
    if (isEditing) {
      const totalRecipients = calculateTotalRecipients()
      setFormData((prev: any) => ({ ...prev, totalRecipients }))
    }
  }, [formData.targetAudience, formData.targetGroups, formData.targetUsers, isEditing])

  const handleGroupToggle = (groupId: string) => {
    if (!isEditing) return

    setFormData((prev: any) => {
      const currentGroups = prev.targetGroups || []
      const newGroups = currentGroups.includes(groupId)
        ? currentGroups.filter((id: string) => id !== groupId)
        : [...currentGroups, groupId]

      return { ...prev, targetGroups: newGroups }
    })
  }

  const handleUserToggle = (userId: string) => {
    if (!isEditing) return

    setFormData((prev: any) => {
      const currentUsers = prev.targetUsers || []
      const newUsers = currentUsers.includes(userId)
        ? currentUsers.filter((id: string) => id !== userId)
        : [...currentUsers, userId]

      return { ...prev, targetUsers: newUsers }
    })
  }

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()))

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const isTargetingValid = () => {
    if (formData.targetAudience === "groups" && (!formData.targetGroups || formData.targetGroups.length === 0)) {
      return false
    }
    if (formData.targetAudience === "users" && (!formData.targetUsers || formData.targetUsers.length === 0)) {
      return false
    }
    if (formData.targetAudience === "mixed") {
      if (
        (!formData.targetGroups || formData.targetGroups.length === 0) &&
        (!formData.targetUsers || formData.targetUsers.length === 0)
      ) {
        return false
      }
    }
    return true
  }

  return (
    <div className="space-y-6">
      {/* Audience Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Audience Type *</Label>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-3">
            {targetAudiences.map((audience) => {
              const Icon = audience.icon
              return (
                <Button
                  key={audience.value}
                  type="button"
                  variant={formData.targetAudience === audience.value ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, targetAudience: audience.value })}
                  className={`flex flex-col items-center gap-2 h-auto p-4 ${
                    formData.targetAudience === audience.value
                      ? "bg-red-500 hover:bg-red-600"
                      : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">{audience.label}</div>
                    <div className="text-xs opacity-80">{audience.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        ) : (
          <div className="mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {(() => {
                const audience = targetAudiences.find((a) => a.value === formData.targetAudience)
                if (!audience) return null
                const Icon = audience.icon
                return <Icon className="h-3 w-3" />
              })()}
              {targetAudiences.find((a) => a.value === formData.targetAudience)?.label || formData.targetAudience}
            </Badge>
          </div>
        )}
        {validationErrors.targetAudience && <p className="text-sm text-red-600">{validationErrors.targetAudience}</p>}
      </div>

      {/* Group Selection */}
      {(formData.targetAudience === "groups" || formData.targetAudience === "mixed") && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Groups</Label>
          {isEditing ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="pl-10 hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={formData.targetGroups?.includes(group.id) || false}
                      onCheckedChange={() => handleGroupToggle(group.id)}
                    />
                    <Label htmlFor={`group-${group.id}`} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-500">{group.memberCount} members</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              {validationErrors.targetGroups && <p className="text-sm text-red-600">{validationErrors.targetGroups}</p>}
            </>
          ) : (
            <div className="space-y-2">
              {formData.targetGroups?.map((groupId: string) => {
                const group = groups.find((g) => g.id === groupId)
                return group ? (
                  <div key={groupId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">{group.name}</span>
                    <Badge variant="outline">{group.memberCount} members</Badge>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      )}

      {/* User Selection */}
      {(formData.targetAudience === "users" || formData.targetAudience === "mixed") && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Users</Label>
          {isEditing ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={formData.targetUsers?.includes(user.id) || false}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <Label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              {validationErrors.targetUsers && <p className="text-sm text-red-600">{validationErrors.targetUsers}</p>}
            </>
          ) : (
            <div className="space-y-2">
              {formData.targetUsers?.map((userId: string) => {
                const user = users.find((u) => u.id === userId)
                return user ? (
                  <div key={userId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      )}

      {validationErrors.targetSelection && <p className="text-sm text-red-600">{validationErrors.targetSelection}</p>}

      {/* Recipients Summary */}
      <div
        className={`p-3 rounded-lg border ${
          isTargetingValid() ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {isTargetingValid() ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${isTargetingValid() ? "text-green-800" : "text-red-800"}`}>
            Total Recipients: {formData.totalRecipients || 0}
          </span>
        </div>
        {!isTargetingValid() && (
          <p className="text-xs text-red-600 mt-1">Please select at least one group or user to target</p>
        )}
      </div>
    </div>
  )
}
