"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function CommunicationSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleCommunicationChange = (field: string, value: any) => {
    updateTempleSettings({
      communication: {
        ...templeSettings.communication,
        [field]: value,
      },
    })
  }

  const handleSmtpChange = (field: string, value: any) => {
    updateTempleSettings({
      communication: {
        ...templeSettings.communication,
        smtpSettings: {
          ...templeSettings.communication.smtpSettings!,
          [field]: value,
        },
      },
    })
  }

  const handleSmsChange = (field: string, value: any) => {
    updateTempleSettings({
      communication: {
        ...templeSettings.communication,
        smsSettings: {
          ...templeSettings.communication.smsSettings!,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Communication Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Enable or disable different notification types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={templeSettings.communication.emailNotifications}
                  onCheckedChange={(checked) => handleCommunicationChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={templeSettings.communication.smsNotifications}
                  onCheckedChange={(checked) => handleCommunicationChange("smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={templeSettings.communication.pushNotifications}
                  onCheckedChange={(checked) => handleCommunicationChange("pushNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Provider</CardTitle>
              <CardDescription>Configure email service provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailProvider">Email Provider</Label>
                <Select
                  value={templeSettings.communication.emailProvider}
                  onValueChange={(value) => handleCommunicationChange("emailProvider", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {templeSettings.communication.emailProvider === "smtp" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">SMTP Configuration</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SMTP Settings</CardTitle>
              <CardDescription>Configure SMTP server settings for email delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={templeSettings.communication.smtpSettings?.host || ""}
                    onChange={(e) => handleSmtpChange("host", e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={templeSettings.communication.smtpSettings?.port || ""}
                    onChange={(e) => handleSmtpChange("port", parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={templeSettings.communication.smtpSettings?.username || ""}
                    onChange={(e) => handleSmtpChange("username", e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={templeSettings.communication.smtpSettings?.password || ""}
                    onChange={(e) => handleSmtpChange("password", e.target.value)}
                    placeholder="App password"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Select
                    value={templeSettings.communication.smtpSettings?.encryption || "tls"}
                    onValueChange={(value) => handleSmtpChange("encryption", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">SMS Configuration</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SMS Provider Settings</CardTitle>
            <CardDescription>Configure SMS service provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select
                value={templeSettings.communication.smsProvider}
                onValueChange={(value) => handleCommunicationChange("smsProvider", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smsApiKey">API Key</Label>
                <Input
                  id="smsApiKey"
                  value={templeSettings.communication.smsSettings?.apiKey || ""}
                  onChange={(e) => handleSmsChange("apiKey", e.target.value)}
                  placeholder="Your API key"
                />
              </div>
              <div>
                <Label htmlFor="smsApiSecret">API Secret</Label>
                <Input
                  id="smsApiSecret"
                  type="password"
                  value={templeSettings.communication.smsSettings?.apiSecret || ""}
                  onChange={(e) => handleSmsChange("apiSecret", e.target.value)}
                  placeholder="Your API secret"
                />
              </div>
              <div>
                <Label htmlFor="smsFromNumber">From Number</Label>
                <Input
                  id="smsFromNumber"
                  value={templeSettings.communication.smsSettings?.fromNumber || ""}
                  onChange={(e) => handleSmsChange("fromNumber", e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
