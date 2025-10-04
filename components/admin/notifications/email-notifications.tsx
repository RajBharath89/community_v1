"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function EmailNotifications() {
  const { notificationSettings, updateNotificationSettings } = useSettingsStore()

  const handleEmailNotificationChange = (field: string, value: boolean) => {
    updateNotificationSettings({
      emailNotifications: {
        ...notificationSettings.emailNotifications,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email Notification Triggers</CardTitle>
            <CardDescription>Configure which events trigger email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newUserRegistration">New User Registration</Label>
                    <p className="text-sm text-gray-500">Send email when a new user registers</p>
                  </div>
                  <Switch
                    id="newUserRegistration"
                    checked={notificationSettings.emailNotifications.newUserRegistration}
                    onCheckedChange={(checked) => handleEmailNotificationChange("newUserRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="userStatusChange">User Status Change</Label>
                    <p className="text-sm text-gray-500">Send email when user status changes</p>
                  </div>
                  <Switch
                    id="userStatusChange"
                    checked={notificationSettings.emailNotifications.userStatusChange}
                    onCheckedChange={(checked) => handleEmailNotificationChange("userStatusChange", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="donationReceived">Donation Received</Label>
                    <p className="text-sm text-gray-500">Send email when a donation is received</p>
                  </div>
                  <Switch
                    id="donationReceived"
                    checked={notificationSettings.emailNotifications.donationReceived}
                    onCheckedChange={(checked) => handleEmailNotificationChange("donationReceived", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="eventRegistration">Event Registration</Label>
                    <p className="text-sm text-gray-500">Send email for event registrations</p>
                  </div>
                  <Switch
                    id="eventRegistration"
                    checked={notificationSettings.emailNotifications.eventRegistration}
                    onCheckedChange={(checked) => handleEmailNotificationChange("eventRegistration", checked)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="eventReminder">Event Reminder</Label>
                    <p className="text-sm text-gray-500">Send email reminders for upcoming events</p>
                  </div>
                  <Switch
                    id="eventReminder"
                    checked={notificationSettings.emailNotifications.eventReminder}
                    onCheckedChange={(checked) => handleEmailNotificationChange("eventReminder", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">Send email for system alerts and updates</p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={notificationSettings.emailNotifications.systemAlerts}
                    onCheckedChange={(checked) => handleEmailNotificationChange("systemAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="securityAlerts">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Send email for security-related events</p>
                  </div>
                  <Switch
                    id="securityAlerts"
                    checked={notificationSettings.emailNotifications.securityAlerts}
                    onCheckedChange={(checked) => handleEmailNotificationChange("securityAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReport">Weekly Report</Label>
                    <p className="text-sm text-gray-500">Send weekly summary reports</p>
                  </div>
                  <Switch
                    id="weeklyReport"
                    checked={notificationSettings.emailNotifications.weeklyReport}
                    onCheckedChange={(checked) => handleEmailNotificationChange("weeklyReport", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="monthlyReport">Monthly Report</Label>
                    <p className="text-sm text-gray-500">Send monthly summary reports</p>
                  </div>
                  <Switch
                    id="monthlyReport"
                    checked={notificationSettings.emailNotifications.monthlyReport}
                    onCheckedChange={(checked) => handleEmailNotificationChange("monthlyReport", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
