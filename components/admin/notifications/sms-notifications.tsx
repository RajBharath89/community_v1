"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function SmsNotifications() {
  const { notificationSettings, updateNotificationSettings } = useSettingsStore()

  const handleSmsNotificationChange = (field: string, value: boolean) => {
    updateNotificationSettings({
      smsNotifications: {
        ...notificationSettings.smsNotifications,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">SMS Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SMS Notification Triggers</CardTitle>
            <CardDescription>Configure which events trigger SMS notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNewUserRegistration">New User Registration</Label>
                    <p className="text-sm text-gray-500">Send SMS when a new user registers</p>
                  </div>
                  <Switch
                    id="smsNewUserRegistration"
                    checked={notificationSettings.smsNotifications.newUserRegistration}
                    onCheckedChange={(checked) => handleSmsNotificationChange("newUserRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsUserStatusChange">User Status Change</Label>
                    <p className="text-sm text-gray-500">Send SMS when user status changes</p>
                  </div>
                  <Switch
                    id="smsUserStatusChange"
                    checked={notificationSettings.smsNotifications.userStatusChange}
                    onCheckedChange={(checked) => handleSmsNotificationChange("userStatusChange", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsDonationReceived">Donation Received</Label>
                    <p className="text-sm text-gray-500">Send SMS when a donation is received</p>
                  </div>
                  <Switch
                    id="smsDonationReceived"
                    checked={notificationSettings.smsNotifications.donationReceived}
                    onCheckedChange={(checked) => handleSmsNotificationChange("donationReceived", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsEventRegistration">Event Registration</Label>
                    <p className="text-sm text-gray-500">Send SMS for event registrations</p>
                  </div>
                  <Switch
                    id="smsEventRegistration"
                    checked={notificationSettings.smsNotifications.eventRegistration}
                    onCheckedChange={(checked) => handleSmsNotificationChange("eventRegistration", checked)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsEventReminder">Event Reminder</Label>
                    <p className="text-sm text-gray-500">Send SMS reminders for upcoming events</p>
                  </div>
                  <Switch
                    id="smsEventReminder"
                    checked={notificationSettings.smsNotifications.eventReminder}
                    onCheckedChange={(checked) => handleSmsNotificationChange("eventReminder", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsSystemAlerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">Send SMS for system alerts and updates</p>
                  </div>
                  <Switch
                    id="smsSystemAlerts"
                    checked={notificationSettings.smsNotifications.systemAlerts}
                    onCheckedChange={(checked) => handleSmsNotificationChange("systemAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsSecurityAlerts">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Send SMS for security-related events</p>
                  </div>
                  <Switch
                    id="smsSecurityAlerts"
                    checked={notificationSettings.smsNotifications.securityAlerts}
                    onCheckedChange={(checked) => handleSmsNotificationChange("securityAlerts", checked)}
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
