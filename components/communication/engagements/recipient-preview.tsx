"use client"
import { useGroupStore } from "@/stores/group-store"
import { useUserStore } from "@/stores/user-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, User, Crown, Church, Shield, Heart } from "lucide-react"

interface RecipientPreviewProps {
  targetAudience: string
  targetGroups: string[]
  targetUsers: string[]
  showDetails?: boolean
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Crown className="h-3 w-3 text-purple-500" />
    case "Priest":
      return <Church className="h-3 w-3 text-blue-500" />
    case "Trustee":
      return <Shield className="h-3 w-3 text-indigo-500" />
    case "Volunteer":
      return <Heart className="h-3 w-3 text-pink-500" />
    case "Devotee":
      return <User className="h-3 w-3 text-gray-500" />
    default:
      return <Users className="h-3 w-3 text-gray-500" />
  }
}

export function RecipientPreview({
  targetAudience,
  targetGroups,
  targetUsers,
  showDetails = true,
}: RecipientPreviewProps) {
  const { groups } = useGroupStore()
  const { users } = useUserStore()

  const calculateTotalRecipients = () => {
    let count = 0

    if (targetAudience === "all") {
      count = users.length
    } else if (targetAudience === "groups" && targetGroups) {
      targetGroups.forEach((groupId) => {
        const group = groups.find((g) => g.id === groupId)
        if (group) {
          count += group.memberCount
        }
      })
    } else if (targetAudience === "users" && targetUsers) {
      count = targetUsers.length
    } else if (targetAudience === "mixed") {
      // Count from groups
      if (targetGroups) {
        targetGroups.forEach((groupId) => {
          const group = groups.find((g) => g.id === groupId)
          if (group) {
            count += group.memberCount
          }
        })
      }
      // Add individual users (avoiding double counting would require more complex logic)
      if (targetUsers) {
        count += targetUsers.length
      }
    }

    return count
  }

  const getSelectedGroups = () => {
    return targetGroups.map((groupId) => groups.find((g) => g.id === groupId)).filter(Boolean)
  }

  const getSelectedUsers = () => {
    return targetUsers.map((userId) => users.find((u) => u.id === userId)).filter(Boolean)
  }

  const totalRecipients = calculateTotalRecipients()
  const selectedGroups = getSelectedGroups()
  const selectedUsers = getSelectedUsers()

  if (targetAudience === "all") {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            All Users Selected
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {totalRecipients} recipients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-blue-600">
            This broadcast will be sent to all registered users in the temple community.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-600" />
          Recipient Preview
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {totalRecipients} recipients
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Selected Groups */}
        {(targetAudience === "groups" || targetAudience === "mixed") && selectedGroups.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Selected Groups ({selectedGroups.length})</span>
            </div>
            <div className="space-y-1">
              {selectedGroups.slice(0, showDetails ? 10 : 3).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <span className="font-medium">{group.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {group.memberCount} members
                  </Badge>
                </div>
              ))}
              {selectedGroups.length > (showDetails ? 10 : 3) && (
                <p className="text-xs text-gray-500 px-2">
                  +{selectedGroups.length - (showDetails ? 10 : 3)} more groups
                </p>
              )}
            </div>
          </div>
        )}

        {/* Selected Users */}
        {(targetAudience === "users" || targetAudience === "mixed") && selectedUsers.length > 0 && (
          <>
            {selectedGroups.length > 0 && <Separator />}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Individual Users ({selectedUsers.length})</span>
              </div>
              <div className="space-y-1">
                {selectedUsers.slice(0, showDetails ? 10 : 3).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </div>
                ))}
                {selectedUsers.length > (showDetails ? 10 : 3) && (
                  <p className="text-xs text-gray-500 px-2">
                    +{selectedUsers.length - (showDetails ? 10 : 3)} more users
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {((targetAudience === "groups" && selectedGroups.length === 0) ||
          (targetAudience === "users" && selectedUsers.length === 0) ||
          (targetAudience === "mixed" && selectedGroups.length === 0 && selectedUsers.length === 0)) && (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No recipients selected</p>
            <p className="text-xs text-gray-400">Choose groups or users to see the preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
