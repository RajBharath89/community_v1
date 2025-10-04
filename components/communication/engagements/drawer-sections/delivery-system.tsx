"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Bell, 
  Mail, 
  Smartphone,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface DeliverySystemProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const deliveryChannels = [
  { 
    value: "in-app", 
    label: "In-App", 
    icon: Bell, 
    color: "text-blue-500",
    description: "Send notifications within the application"
  },
  { 
    value: "email", 
    label: "Email", 
    icon: Mail, 
    color: "text-green-500",
    description: "Send via email to recipients"
  },
  { 
    value: "sms", 
    label: "SMS", 
    icon: Smartphone, 
    color: "text-purple-500",
    description: "Send text messages to mobile devices"
  },
]

export function DeliverySystem({ 
  formData, 
  setFormData, 
  isEditing, 
  validationErrors 
}: DeliverySystemProps) {
  const handleDeliveryChannelToggle = (channel: string) => {
    if (!isEditing) return

    setFormData((prev: any) => {
      const currentChannels = prev.deliveryChannels || []
      const newChannels = currentChannels.includes(channel)
        ? currentChannels.filter((c: string) => c !== channel)
        : [...currentChannels, channel]

      return { ...prev, deliveryChannels: newChannels }
    })
  }

  const isChannelValid = formData.deliveryChannels && formData.deliveryChannels.length > 0

  return (
    <Card>
      <CardHeader className="py-2" />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deliveryChannels.map(({ value, label, icon: Icon, color, description }) => (
            <div
              key={value}
              className={`flex flex-col items-center space-y-2 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.deliveryChannels?.includes(value)
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleDeliveryChannelToggle(value)}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.deliveryChannels?.includes(value) || false}
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">{label}</span>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Channel Validation */}
        {!isChannelValid && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">At least one delivery channel is required</span>
          </div>
        )}

        {isChannelValid && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">
              {formData.deliveryChannels?.length} channel{formData.deliveryChannels?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        )}

        {validationErrors.deliveryChannels && (
          <p className="text-sm text-red-600">{validationErrors.deliveryChannels}</p>
        )}

        {/* Channel Status (View Mode) */}
        {!isEditing && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Channels</h4>
            <div className="flex flex-wrap gap-2">
              {formData.deliveryChannels?.map((channel: string) => {
                const channelInfo = deliveryChannels.find(c => c.value === channel)
                if (!channelInfo) return null
                const Icon = channelInfo.icon
                return (
                  <Badge key={channel} variant="outline" className="flex items-center gap-1">
                    <Icon className={`h-3 w-3 ${channelInfo.color}`} />
                    {channelInfo.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
