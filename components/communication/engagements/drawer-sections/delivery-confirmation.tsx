"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  Mail, 
  Bell,
  Calendar,
  MessageSquare
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState } from "react"

interface DeliveryConfirmationProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const confirmationMethods = [
  { value: "email", label: "Email Confirmation", icon: Mail, description: "Recipients confirm via email link" },
  { value: "in-app", label: "In-App Confirmation", icon: CheckCircle, description: "Recipients confirm within the app" },
  { value: "both", label: "Both Methods", icon: Users, description: "Allow both email and in-app confirmation" },
]

const reminderIntervals = [
  { value: "1", label: "1 day" },
  { value: "2", label: "2 days" },
  { value: "3", label: "3 days" },
  { value: "7", label: "1 week" },
  { value: "14", label: "2 weeks" },
]

export function DeliveryConfirmation({ formData, setFormData, isEditing, validationErrors }: DeliveryConfirmationProps) {
  const [showCustomMessage, setShowCustomMessage] = useState(false)

  const handleConfirmationToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      deliveryConfirmation: {
        ...formData.deliveryConfirmation,
        enabled,
        // Reset to defaults when enabling
        ...(enabled && {
          method: "both",
          deadline: "7",
          reminderEnabled: true,
          reminderInterval: "3",
          customMessage: "",
          autoEscalation: true,
          escalationRecipients: [],
        })
      }
    })
  }

  const updateConfirmationField = (field: string, value: any) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      deliveryConfirmation: {
        ...formData.deliveryConfirmation,
        [field]: value
      }
    })
  }

  const getConfirmationStats = () => {
    const totalRecipients = formData.totalRecipients || 0
    const confirmedCount = formData.deliveryConfirmation?.confirmedCount || 0
    const pendingCount = totalRecipients - confirmedCount
    const confirmationRate = totalRecipients > 0 ? (confirmedCount / totalRecipients) * 100 : 0

    return { totalRecipients, confirmedCount, pendingCount, confirmationRate }
  }

  const stats = getConfirmationStats()

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-medium">Delivery Confirmation</h3>
      </div> */}

      {/* Enable/Disable Confirmation */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Require Delivery Confirmation</CardTitle>
            <Switch
              checked={formData.deliveryConfirmation?.enabled || false}
              onCheckedChange={handleConfirmationToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Recipients will be required to confirm they have received and read this engagement.
          </p>
        </CardContent>
      </Card>

      {formData.deliveryConfirmation?.enabled && (
        <>
          {/* Confirmation Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Confirmation Method *</Label>
            <Select
              value={formData.deliveryConfirmation?.method || "in-app"}
              onValueChange={(value) => updateConfirmationField("method", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select confirmation method" />
              </SelectTrigger>
              <SelectContent>
                {confirmationMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-xs text-gray-500">{method.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Confirmation Deadline */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Confirmation Deadline *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  value={formData.deliveryConfirmation?.deadline || "7"}
                  onValueChange={(value) => updateConfirmationField("deadline", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderIntervals.map((interval) => (
                      <SelectItem key={interval.value} value={interval.value}>
                        {interval.label} after delivery
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.deliveryConfirmation?.deadline || "7"} days after delivery
                </span>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-blue-800">Reminder Settings</CardTitle>
                <Switch
                  checked={formData.deliveryConfirmation?.reminderEnabled || false}
                  onCheckedChange={(checked) => updateConfirmationField("reminderEnabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.deliveryConfirmation?.reminderEnabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Reminder Frequency</Label>
                    <Select
                      value={formData.deliveryConfirmation?.reminderInterval || "3"}
                      onValueChange={(value) => updateConfirmationField("reminderInterval", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select reminder interval" />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderIntervals.map((interval) => (
                          <SelectItem key={interval.value} value={interval.value}>
                            Every {interval.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Custom Reminder Message</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomMessage(!showCustomMessage)}
                        disabled={!isEditing}
                      >
                        {showCustomMessage ? "Hide" : "Add"}
                      </Button>
                    </div>
                    {showCustomMessage && (
                      <Textarea
                        placeholder="Enter custom reminder message..."
                        value={formData.deliveryConfirmation?.customMessage || ""}
                        onChange={(e) => updateConfirmationField("customMessage", e.target.value)}
                        rows={3}
                        className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Auto-Escalation */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-orange-800">Auto-Escalation</CardTitle>
                <Switch
                  checked={formData.deliveryConfirmation?.autoEscalation || false}
                  onCheckedChange={(checked) => updateConfirmationField("autoEscalation", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700">
                Automatically notify administrators when confirmation deadline is approaching or passed.
              </p>
            </CardContent>
          </Card>

          {/* Confirmation Statistics (View Mode) */}
          {!isEditing && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-green-800">Confirmation Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.confirmedCount}</div>
                    <div className="text-sm text-green-700">Confirmed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingCount}</div>
                    <div className="text-sm text-orange-700">Pending</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Confirmation Rate</span>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      {stats.confirmationRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
