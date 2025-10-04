"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function SecuritySettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleSecurityChange = (field: string, value: any) => {
    updateTempleSettings({
      security: {
        ...templeSettings.security,
        [field]: value,
      },
    })
  }

  const handlePasswordPolicyChange = (field: string, value: any) => {
    updateTempleSettings({
      security: {
        ...templeSettings.security,
        passwordPolicy: {
          ...templeSettings.security.passwordPolicy,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Security Configuration</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Management</CardTitle>
              <CardDescription>Configure user session settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={templeSettings.security.sessionTimeout}
                  onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value))}
                  min="5"
                  max="480"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Users will be automatically logged out after this period of inactivity
                </p>
              </div>
              <div>
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={templeSettings.security.loginAttempts}
                  onChange={(e) => handleSecurityChange("loginAttempts", parseInt(e.target.value))}
                  min="3"
                  max="10"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Number of failed login attempts before account lockout
                </p>
              </div>
              <div>
                <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={templeSettings.security.lockoutDuration}
                  onChange={(e) => handleSecurityChange("lockoutDuration", parseInt(e.target.value))}
                  min="5"
                  max="60"
                />
                <p className="text-sm text-gray-500 mt-1">
                  How long accounts remain locked after max login attempts
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>Configure 2FA settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Enable 2FA</Label>
                  <p className="text-sm text-gray-500">
                    Require two-factor authentication for all users
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={templeSettings.security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Password Policy</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Password Requirements</CardTitle>
            <CardDescription>Configure password complexity requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="minLength">Minimum Length</Label>
              <Input
                id="minLength"
                type="number"
                value={templeSettings.security.passwordPolicy.minLength}
                onChange={(e) => handlePasswordPolicyChange("minLength", parseInt(e.target.value))}
                min="6"
                max="32"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                  <p className="text-sm text-gray-500">At least one uppercase letter (A-Z)</p>
                </div>
                <Switch
                  id="requireUppercase"
                  checked={templeSettings.security.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => handlePasswordPolicyChange("requireUppercase", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                  <p className="text-sm text-gray-500">At least one lowercase letter (a-z)</p>
                </div>
                <Switch
                  id="requireLowercase"
                  checked={templeSettings.security.passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => handlePasswordPolicyChange("requireLowercase", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                  <p className="text-sm text-gray-500">At least one number (0-9)</p>
                </div>
                <Switch
                  id="requireNumbers"
                  checked={templeSettings.security.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => handlePasswordPolicyChange("requireNumbers", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                  <p className="text-sm text-gray-500">At least one special character (!@#$%^&*)</p>
                </div>
                <Switch
                  id="requireSpecialChars"
                  checked={templeSettings.security.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => handlePasswordPolicyChange("requireSpecialChars", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
