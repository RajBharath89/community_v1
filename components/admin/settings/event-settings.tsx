"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function EventSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleEventChange = (field: string, value: any) => {
    updateTempleSettings({
      events: {
        ...templeSettings.events,
        [field]: value,
      },
    })
  }

  const handleReminderSettingsChange = (field: string, value: any) => {
    updateTempleSettings({
      events: {
        ...templeSettings.events,
        reminderSettings: {
          ...templeSettings.events.reminderSettings,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Event Management Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Registration</CardTitle>
              <CardDescription>Configure event registration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableEventRegistration">Enable Event Registration</Label>
                  <p className="text-sm text-gray-500">Allow users to register for events</p>
                </div>
                <Switch
                  id="enableEventRegistration"
                  checked={templeSettings.events.enableEventRegistration}
                  onCheckedChange={(checked) => handleEventChange("enableEventRegistration", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireApproval">Require Approval</Label>
                  <p className="text-sm text-gray-500">Event registrations require admin approval</p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={templeSettings.events.requireApproval}
                  onCheckedChange={(checked) => handleEventChange("requireApproval", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowWaitlist">Allow Waitlist</Label>
                  <p className="text-sm text-gray-500">Allow users to join waitlist when events are full</p>
                </div>
                <Switch
                  id="allowWaitlist"
                  checked={templeSettings.events.allowWaitlist}
                  onCheckedChange={(checked) => handleEventChange("allowWaitlist", checked)}
                />
              </div>
              <div>
                <Label htmlFor="maxEventCapacity">Maximum Event Capacity</Label>
                <Input
                  id="maxEventCapacity"
                  type="number"
                  value={templeSettings.events.maxEventCapacity}
                  onChange={(e) => handleEventChange("maxEventCapacity", parseInt(e.target.value))}
                  min="1"
                  max="10000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum number of attendees per event
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Reminders</CardTitle>
              <CardDescription>Configure automatic event reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailReminder">Email Reminders</Label>
                  <p className="text-sm text-gray-500">Send email reminders for events</p>
                </div>
                <Switch
                  id="emailReminder"
                  checked={templeSettings.events.reminderSettings.emailReminder}
                  onCheckedChange={(checked) => handleReminderSettingsChange("emailReminder", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsReminder">SMS Reminders</Label>
                  <p className="text-sm text-gray-500">Send SMS reminders for events</p>
                </div>
                <Switch
                  id="smsReminder"
                  checked={templeSettings.events.reminderSettings.smsReminder}
                  onCheckedChange={(checked) => handleReminderSettingsChange("smsReminder", checked)}
                />
              </div>
              <div>
                <Label htmlFor="reminderDays">Reminder Days Before Event</Label>
                <Input
                  id="reminderDays"
                  value={templeSettings.events.reminderSettings.daysBefore.join(", ")}
                  onChange={(e) => {
                    const days = e.target.value
                      .split(",")
                      .map((d) => parseInt(d.trim()))
                      .filter((d) => !isNaN(d))
                    handleReminderSettingsChange("daysBefore", days)
                  }}
                  placeholder="7, 3, 1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Comma-separated list of days before event to send reminders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
