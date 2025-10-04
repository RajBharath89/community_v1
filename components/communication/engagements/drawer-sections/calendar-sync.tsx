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
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Settings,
  RefreshCw,
  Link,
  Unlink,
  Globe,
  Mail
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState } from "react"

interface CalendarSyncProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const calendarProviders = [
  { value: "google", label: "Google Calendar", icon: "📅", description: "Sync with Google Calendar" },
  { value: "outlook", label: "Outlook Calendar", icon: "📧", description: "Sync with Microsoft Outlook" },
  { value: "apple", label: "Apple Calendar", icon: "🍎", description: "Sync with Apple Calendar" },
  { value: "ical", label: "iCal Feed", icon: "📋", description: "Generate iCal feed URL" },
]

const syncOptions = [
  { value: "one-way", label: "One-Way Sync", description: "Push events to external calendar" },
  { value: "two-way", label: "Two-Way Sync", description: "Bidirectional sync (read/write)" },
  { value: "manual", label: "Manual Export", description: "Generate calendar file for download" },
]

const reminderTypes = [
  { value: "none", label: "No Reminder" },
  { value: "5min", label: "5 minutes before" },
  { value: "15min", label: "15 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1hour", label: "1 hour before" },
  { value: "1day", label: "1 day before" },
  { value: "1week", label: "1 week before" },
]

export function CalendarSync({ formData, setFormData, isEditing, validationErrors }: CalendarSyncProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const handleCalendarToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      calendarSync: {
        ...formData.calendarSync,
        enabled,
        // Reset to defaults when enabling
        ...(enabled && {
          providers: ["google"],
          syncType: "one-way",
          autoSync: true,
          includeDescription: true,
          includeLocation: true,
          includeAttendees: true,
          reminders: ["1day"],
          customCalendarName: "",
          timezone: "Asia/Kolkata",
        })
      }
    })
  }

  const updateCalendarField = (field: string, value: any) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      calendarSync: {
        ...formData.calendarSync,
        [field]: value
      }
    })
  }

  const handleProviderToggle = (provider: string) => {
    if (!isEditing) return
    
    const currentProviders = formData.calendarSync?.providers || []
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(p => p !== provider)
      : [...currentProviders, provider]
    
    updateCalendarField("providers", newProviders)
  }

  const handleReminderToggle = (reminder: string) => {
    if (!isEditing) return
    
    const currentReminders = formData.calendarSync?.reminders || []
    const newReminders = currentReminders.includes(reminder)
      ? currentReminders.filter(r => r !== reminder)
      : [...currentReminders, reminder]
    
    updateCalendarField("reminders", newReminders)
  }

  const getSyncStatus = () => {
    const lastSync = formData.calendarSync?.lastSyncTime
    const syncStatus = formData.calendarSync?.syncStatus || "not-synced"
    
    if (syncStatus === "synced" && lastSync) {
      return { status: "success", message: `Last synced: ${new Date(lastSync).toLocaleString()}` }
    } else if (syncStatus === "failed") {
      return { status: "error", message: "Sync failed" }
    } else if (syncStatus === "syncing") {
      return { status: "pending", message: "Syncing..." }
    } else {
      return { status: "not-synced", message: "Not synced yet" }
    }
  }

  const syncStatus = getSyncStatus()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Calendar Integration</h3>
      </div>

      {/* Enable/Disable Calendar Sync */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Enable Calendar Integration</CardTitle>
            <Switch
              checked={formData.calendarSync?.enabled || false}
              onCheckedChange={handleCalendarToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sync this engagement with external calendar applications.
          </p>
        </CardContent>
      </Card>

      {formData.calendarSync?.enabled && (
        <>
          {/* Calendar Providers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Calendar Providers *</Label>
            <div className="grid grid-cols-2 gap-3">
              {calendarProviders.map((provider) => (
                <div
                  key={provider.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.calendarSync?.providers?.includes(provider.value)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleProviderToggle(provider.value)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{provider.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{provider.label}</div>
                      <div className="text-xs text-gray-500">{provider.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sync Type</Label>
            <Select
              value={formData.calendarSync?.syncType || "one-way"}
              onValueChange={(value) => updateCalendarField("syncType", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select sync type" />
              </SelectTrigger>
              <SelectContent>
                {syncOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Auto Sync</Label>
              <p className="text-xs text-gray-500">Automatically sync when engagement is updated</p>
            </div>
            <Switch
              checked={formData.calendarSync?.autoSync || false}
              onCheckedChange={(checked) => updateCalendarField("autoSync", checked)}
              disabled={!isEditing}
            />
          </div>

          {/* Calendar Content Options */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-800">Calendar Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Include Description</Label>
                  <p className="text-xs text-gray-500">Add engagement content to calendar event</p>
                </div>
                <Switch
                  checked={formData.calendarSync?.includeDescription || false}
                  onCheckedChange={(checked) => updateCalendarField("includeDescription", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Include Location</Label>
                  <p className="text-xs text-gray-500">Add venue information to calendar event</p>
                </div>
                <Switch
                  checked={formData.calendarSync?.includeLocation || false}
                  onCheckedChange={(checked) => updateCalendarField("includeLocation", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Include Attendees</Label>
                  <p className="text-xs text-gray-500">Add attendee list to calendar event</p>
                </div>
                <Switch
                  checked={formData.calendarSync?.includeAttendees || false}
                  onCheckedChange={(checked) => updateCalendarField("includeAttendees", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reminders */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Calendar Reminders</Label>
            <div className="grid grid-cols-2 gap-2">
              {reminderTypes.map((reminder) => (
                <div
                  key={reminder.value}
                  className={`p-2 border rounded text-sm cursor-pointer transition-all ${
                    formData.calendarSync?.reminders?.includes(reminder.value)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleReminderToggle(reminder.value)}
                >
                  {reminder.label}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Advanced Settings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  disabled={!isEditing}
                >
                  {showAdvancedSettings ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showAdvancedSettings && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-calendar-name" className="text-sm font-medium">
                    Custom Calendar Name
                  </Label>
                  <Input
                    id="custom-calendar-name"
                    placeholder="Temple Events"
                    value={formData.calendarSync?.customCalendarName || ""}
                    onChange={(e) => updateCalendarField("customCalendarName", e.target.value)}
                    className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={formData.calendarSync?.timezone || "Asia/Kolkata"}
                    onValueChange={(value) => updateCalendarField("timezone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Sync Status and Actions */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-800">Sync Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {syncStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {syncStatus.status === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {syncStatus.status === "pending" && <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />}
                  {syncStatus.status === "not-synced" && <Clock className="h-4 w-4 text-gray-600" />}
                  <span className="text-sm">{syncStatus.message}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCalendarField("syncStatus", "syncing")}
                    disabled={!isEditing || syncStatus.status === "pending"}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Sync Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("#", "_blank")}
                    disabled={!isEditing}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>

              {/* Calendar Links */}
              {formData.calendarSync?.providers?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Calendar Links</Label>
                  <div className="space-y-1">
                    {formData.calendarSync.providers.map((provider) => (
                      <div key={provider} className="flex items-center justify-between p-2 bg-white border rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{provider}</span>
                          <Badge variant="outline" className="text-xs">Connected</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCalendarField("providers", formData.calendarSync?.providers?.filter(p => p !== provider))}
                          disabled={!isEditing}
                        >
                          <Unlink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
