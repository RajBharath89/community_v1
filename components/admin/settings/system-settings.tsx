"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function SystemSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleSystemChange = (field: string, value: any) => {
    updateTempleSettings({
      system: {
        ...templeSettings.system,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">System Configuration</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
              <CardDescription>Configure system operational settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={templeSettings.system.maintenanceMode}
                  onCheckedChange={(checked) => handleSystemChange("maintenanceMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="debugMode">Debug Mode</Label>
                  <p className="text-sm text-gray-500">Enable debug logging and features</p>
                </div>
                <Switch
                  id="debugMode"
                  checked={templeSettings.system.debugMode}
                  onCheckedChange={(checked) => handleSystemChange("debugMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cacheEnabled">Cache Enabled</Label>
                  <p className="text-sm text-gray-500">Enable system caching for better performance</p>
                </div>
                <Switch
                  id="cacheEnabled"
                  checked={templeSettings.system.cacheEnabled}
                  onCheckedChange={(checked) => handleSystemChange("cacheEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Settings</CardTitle>
              <CardDescription>Configure system performance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logLevel">Log Level</Label>
                <Select
                  value={templeSettings.system.logLevel}
                  onValueChange={(value) => handleSystemChange("logLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Level of detail in system logs
                </p>
              </div>
              <div>
                <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                <Input
                  id="maxFileUploadSize"
                  type="number"
                  value={templeSettings.system.maxFileUploadSize}
                  onChange={(e) => handleSystemChange("maxFileUploadSize", parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum file size allowed for uploads
                </p>
              </div>
              <div>
                <Label htmlFor="cacheTTL">Cache TTL (minutes)</Label>
                <Input
                  id="cacheTTL"
                  type="number"
                  value={templeSettings.system.cacheTTL}
                  onChange={(e) => handleSystemChange("cacheTTL", parseInt(e.target.value))}
                  min="1"
                  max="1440"
                />
                <p className="text-sm text-gray-500 mt-1">
                  How long cached data remains valid
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Storage Configuration</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Storage</CardTitle>
            <CardDescription>Configure how user sessions are stored</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sessionStorage">Session Storage Type</Label>
              <Select
                value={templeSettings.system.sessionStorage}
                onValueChange={(value) => handleSystemChange("sessionStorage", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Memory: Fast but lost on restart. Redis: Fast and persistent. Database: Reliable but slower.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
