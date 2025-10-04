"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function PushNotifications() {
  const { notificationSettings, updateNotificationSettings } = useSettingsStore()

  const handlePushNotificationChange = (field: string, value: boolean) => {
    updateNotificationSettings({
      pushNotifications: {
        ...notificationSettings.pushNotifications,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Push Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Push Notification Triggers</CardTitle>
            <CardDescription>Configure which events trigger push notifications to mobile apps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNewUserRegistration">New User Registration</Label>
                    <p className="text-sm text-gray-500">Send push notification when a new user registers</p>
                  </div>
                  <Switch
                    id="pushNewUserRegistration"
                    checked={notificationSettings.pushNotifications.newUserRegistration}
                    onCheckedChange={(checked) => handlePushNotificationChange("newUserRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushUserStatusChange">User Status Change</Label>
                    <p className="text-sm text-gray-500">Send push notification when user status changes</p>
                  </div>
                  <Switch
                    id="pushUserStatusChange"
                    checked={notificationSettings.pushNotifications.userStatusChange}
                    onCheckedChange={(checked) => handlePushNotificationChange("userStatusChange", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushDonationReceived">Donation Received</Label>
                    <p className="text-sm text-gray-500">Send push notification when a donation is received</p>
                  </div>
                  <Switch
                    id="pushDonationReceived"
                    checked={notificationSettings.pushNotifications.donationReceived}
                    onCheckedChange={(checked) => handlePushNotificationChange("donationReceived", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushEventRegistration">Event Registration</Label>
                    <p className="text-sm text-gray-500">Send push notification for event registrations</p>
                  </div>
                  <Switch
                    id="pushEventRegistration"
                    checked={notificationSettings.pushNotifications.eventRegistration}
                    onCheckedChange={(checked) => handlePushNotificationChange("eventRegistration", checked)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushEventReminder">Event Reminder</Label>
                    <p className="text-sm text-gray-500">Send push notification reminders for upcoming events</p>
                  </div>
                  <Switch
                    id="pushEventReminder"
                    checked={notificationSettings.pushNotifications.eventReminder}
                    onCheckedChange={(checked) => handlePushNotificationChange("eventReminder", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushSystemAlerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">Send push notification for system alerts and updates</p>
                  </div>
                  <Switch
                    id="pushSystemAlerts"
                    checked={notificationSettings.pushNotifications.systemAlerts}
                    onCheckedChange={(checked) => handlePushNotificationChange("systemAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushSecurityAlerts">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Send push notification for security-related events</p>
                  </div>
                  <Switch
                    id="pushSecurityAlerts"
                    checked={notificationSettings.pushNotifications.securityAlerts}
                    onCheckedChange={(checked) => handlePushNotificationChange("securityAlerts", checked)}
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
