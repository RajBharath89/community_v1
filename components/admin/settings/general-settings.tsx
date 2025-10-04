"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function GeneralSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleInputChange = (field: string, value: string) => {
    updateTempleSettings({ [field]: value })
  }

  const handleOpeningHoursChange = (day: string, field: string, value: string | boolean) => {
    updateTempleSettings({
      openingHours: {
        ...templeSettings.openingHours,
        [day]: {
          ...templeSettings.openingHours[day as keyof typeof templeSettings.openingHours],
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">General Temple Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Configure basic temple details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="templeName">Temple Name</Label>
                <Input
                  id="templeName"
                  value={templeSettings.templeName}
                  onChange={(e) => handleInputChange("templeName", e.target.value)}
                  placeholder="Enter temple name"
                />
              </div>
              <div>
                <Label htmlFor="templeAddress">Address</Label>
                <Input
                  id="templeAddress"
                  value={templeSettings.templeAddress}
                  onChange={(e) => handleInputChange("templeAddress", e.target.value)}
                  placeholder="Enter temple address"
                />
              </div>
              <div>
                <Label htmlFor="templePhone">Phone Number</Label>
                <Input
                  id="templePhone"
                  value={templeSettings.templePhone}
                  onChange={(e) => handleInputChange("templePhone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="templeEmail">Email Address</Label>
                <Input
                  id="templeEmail"
                  type="email"
                  value={templeSettings.templeEmail}
                  onChange={(e) => handleInputChange("templeEmail", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="templeWebsite">Website</Label>
                <Input
                  id="templeWebsite"
                  value={templeSettings.templeWebsite}
                  onChange={(e) => handleInputChange("templeWebsite", e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>
              <div>
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  value={templeSettings.establishedYear}
                  onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                  placeholder="Enter established year"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regional Settings</CardTitle>
              <CardDescription>Configure timezone, language, and currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={templeSettings.timezone}
                  onValueChange={(value) => handleInputChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={templeSettings.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="gu">Gujarati</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={templeSettings.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="AED">UAE Dirham (د.إ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Temple Hours</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opening Hours</CardTitle>
            <CardDescription>Set temple opening and closing hours for each day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(templeSettings.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium capitalize">{day}</div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) => handleOpeningHoursChange(day, "closed", !checked)}
                    />
                    <span className="text-sm text-gray-500">
                      {hours.closed ? "Closed" : "Open"}
                    </span>
                  </div>
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOpeningHoursChange(day, "open", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOpeningHoursChange(day, "close", e.target.value)}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
