"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function NotificationTemplates() {
  const { notificationSettings, updateNotificationSettings } = useSettingsStore()

  const handleTemplateChange = (field: string, value: string) => {
    updateNotificationSettings({
      templates: {
        ...notificationSettings.templates,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Templates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Templates</CardTitle>
              <CardDescription>Customize email notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="welcomeEmail">Welcome Email Template</Label>
                <Textarea
                  id="welcomeEmail"
                  value={notificationSettings.templates.welcomeEmail}
                  onChange={(e) => handleTemplateChange("welcomeEmail", e.target.value)}
                  rows={3}
                  placeholder="Welcome to {{templeName}}! We're glad to have you as part of our community."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{userName}"}, {"{userEmail}"}
                </p>
              </div>
              <div>
                <Label htmlFor="donationReceipt">Donation Receipt Template</Label>
                <Textarea
                  id="donationReceipt"
                  value={notificationSettings.templates.donationReceipt}
                  onChange={(e) => handleTemplateChange("donationReceipt", e.target.value)}
                  rows={3}
                  placeholder="Thank you for your generous donation of {{amount}} to {{templeName}}."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{amount}"}, {"{donorName}"}, {"{date}"}
                </p>
              </div>
              <div>
                <Label htmlFor="passwordReset">Password Reset Template</Label>
                <Textarea
                  id="passwordReset"
                  value={notificationSettings.templates.passwordReset}
                  onChange={(e) => handleTemplateChange("passwordReset", e.target.value)}
                  rows={3}
                  placeholder="Your password reset link for {{templeName}} account."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{userName}"}, {"{resetLink}"}
                </p>
              </div>
              <div>
                <Label htmlFor="accountActivation">Account Activation Template</Label>
                <Textarea
                  id="accountActivation"
                  value={notificationSettings.templates.accountActivation}
                  onChange={(e) => handleTemplateChange("accountActivation", e.target.value)}
                  rows={3}
                  placeholder="Please activate your {{templeName}} account by clicking the link below."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{userName}"}, {"{activationLink}"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event & Report Templates</CardTitle>
              <CardDescription>Customize event and report notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventReminder">Event Reminder Template</Label>
                <Textarea
                  id="eventReminder"
                  value={notificationSettings.templates.eventReminder}
                  onChange={(e) => handleTemplateChange("eventReminder", e.target.value)}
                  rows={3}
                  placeholder="Reminder: {{eventName}} is scheduled for {{eventDate}} at {{eventTime}}."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{eventName}"}, {"{eventDate}"}, {"{eventTime}"}, {"{location}"}
                </p>
              </div>
              <div>
                <Label htmlFor="weeklyReport">Weekly Report Template</Label>
                <Textarea
                  id="weeklyReport"
                  value={notificationSettings.templates.weeklyReport}
                  onChange={(e) => handleTemplateChange("weeklyReport", e.target.value)}
                  rows={3}
                  placeholder="Weekly report for {{templeName}} - {{weekDate}}"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{weekDate}"}, {"{totalDonations}"}, {"{newUsers}"}
                </p>
              </div>
              <div>
                <Label htmlFor="monthlyReport">Monthly Report Template</Label>
                <Textarea
                  id="monthlyReport"
                  value={notificationSettings.templates.monthlyReport}
                  onChange={(e) => handleTemplateChange("monthlyReport", e.target.value)}
                  rows={3}
                  placeholder="Monthly report for {{templeName}} - {{monthDate}}"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available variables: {"{templeName}"}, {"{monthDate}"}, {"{totalDonations}"}, {"{newUsers}"}, {"{events}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
