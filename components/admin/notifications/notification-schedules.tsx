"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function NotificationSchedules() {
  const { notificationSettings, updateNotificationSettings } = useSettingsStore()

  const handleScheduleChange = (field: string, value: any) => {
    updateNotificationSettings({
      schedules: {
        ...notificationSettings.schedules,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Schedules</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Schedules</CardTitle>
              <CardDescription>Configure when automated reports are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weeklyReportDay">Weekly Report Day</Label>
                <Select
                  value={notificationSettings.schedules.weeklyReportDay}
                  onValueChange={(value) => handleScheduleChange("weeklyReportDay", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weeklyReportTime">Weekly Report Time</Label>
                <Input
                  id="weeklyReportTime"
                  type="time"
                  value={notificationSettings.schedules.weeklyReportTime}
                  onChange={(e) => handleScheduleChange("weeklyReportTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyReportDay">Monthly Report Day</Label>
                <Input
                  id="monthlyReportDay"
                  type="number"
                  value={notificationSettings.schedules.monthlyReportDay}
                  onChange={(e) => handleScheduleChange("monthlyReportDay", parseInt(e.target.value))}
                  min="1"
                  max="31"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Day of the month (1-31) to send monthly reports
                </p>
              </div>
              <div>
                <Label htmlFor="monthlyReportTime">Monthly Report Time</Label>
                <Input
                  id="monthlyReportTime"
                  type="time"
                  value={notificationSettings.schedules.monthlyReportTime}
                  onChange={(e) => handleScheduleChange("monthlyReportTime", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Reminder Schedules</CardTitle>
              <CardDescription>Configure event reminder timing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventReminderDays">Reminder Days Before Event</Label>
                <Input
                  id="eventReminderDays"
                  value={notificationSettings.schedules.eventReminderDays.join(", ")}
                  onChange={(e) => {
                    const days = e.target.value
                      .split(",")
                      .map((d) => parseInt(d.trim()))
                      .filter((d) => !isNaN(d))
                    handleScheduleChange("eventReminderDays", days)
                  }}
                  placeholder="7, 3, 1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Comma-separated list of days before event to send reminders
                </p>
              </div>
              <div>
                <Label htmlFor="eventReminderTime">Event Reminder Time</Label>
                <Input
                  id="eventReminderTime"
                  type="time"
                  value={notificationSettings.schedules.eventReminderTime}
                  onChange={(e) => handleScheduleChange("eventReminderTime", e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Time of day to send event reminders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
