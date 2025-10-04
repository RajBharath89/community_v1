"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettingsStore } from "@/stores/settings-store"

export function BackupSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()

  const handleBackupChange = (field: string, value: any) => {
    updateTempleSettings({
      backup: {
        ...templeSettings.backup,
        [field]: value,
      },
    })
  }

  const handleCloudSettingsChange = (field: string, value: any) => {
    updateTempleSettings({
      backup: {
        ...templeSettings.backup,
        cloudSettings: {
          ...templeSettings.backup.cloudSettings!,
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Backup Configuration</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Backup Settings</CardTitle>
              <CardDescription>Configure automatic backup preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAutoBackup">Enable Auto Backup</Label>
                  <p className="text-sm text-gray-500">Automatically backup system data</p>
                </div>
                <Switch
                  id="enableAutoBackup"
                  checked={templeSettings.backup.enableAutoBackup}
                  onCheckedChange={(checked) => handleBackupChange("enableAutoBackup", checked)}
                />
              </div>
              <div>
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={templeSettings.backup.backupFrequency}
                  onValueChange={(value) => handleBackupChange("backupFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                <Input
                  id="backupRetention"
                  type="number"
                  value={templeSettings.backup.backupRetention}
                  onChange={(e) => handleBackupChange("backupRetention", parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
                <p className="text-sm text-gray-500 mt-1">
                  How long to keep backup files before deletion
                </p>
              </div>
              <div>
                <Label htmlFor="backupLocation">Backup Location</Label>
                <Select
                  value={templeSettings.backup.backupLocation}
                  onValueChange={(value) => handleBackupChange("backupLocation", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="both">Both Local & Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cloud Backup</CardTitle>
              <CardDescription>Configure cloud storage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cloudProvider">Cloud Provider</Label>
                <Select
                  value={templeSettings.backup.cloudProvider || "aws"}
                  onValueChange={(value) => handleBackupChange("cloudProvider", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                    <SelectItem value="google">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cloudBucketName">Bucket/Container Name</Label>
                <Input
                  id="cloudBucketName"
                  value={templeSettings.backup.cloudSettings?.bucketName || ""}
                  onChange={(e) => handleCloudSettingsChange("bucketName", e.target.value)}
                  placeholder="temple-backups"
                />
              </div>
              <div>
                <Label htmlFor="cloudAccessKey">Access Key</Label>
                <Input
                  id="cloudAccessKey"
                  value={templeSettings.backup.cloudSettings?.accessKey || ""}
                  onChange={(e) => handleCloudSettingsChange("accessKey", e.target.value)}
                  placeholder="Your access key"
                />
              </div>
              <div>
                <Label htmlFor="cloudSecretKey">Secret Key</Label>
                <Input
                  id="cloudSecretKey"
                  type="password"
                  value={templeSettings.backup.cloudSettings?.secretKey || ""}
                  onChange={(e) => handleCloudSettingsChange("secretKey", e.target.value)}
                  placeholder="Your secret key"
                />
              </div>
              <div>
                <Label htmlFor="cloudRegion">Region</Label>
                <Input
                  id="cloudRegion"
                  value={templeSettings.backup.cloudSettings?.region || ""}
                  onChange={(e) => handleCloudSettingsChange("region", e.target.value)}
                  placeholder="ap-south-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
