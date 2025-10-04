"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

export function LibrarySettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()
  const [newFileType, setNewFileType] = useState("")

  const handleLibraryChange = (field: string, value: any) => {
    updateTempleSettings({
      library: {
        ...templeSettings.library,
        [field]: value,
      },
    })
  }

  const addFileType = () => {
    if (newFileType.trim() && !templeSettings.library.allowedFileTypes.includes(newFileType.trim())) {
      handleLibraryChange("allowedFileTypes", [
        ...templeSettings.library.allowedFileTypes,
        newFileType.trim(),
      ])
      setNewFileType("")
    }
  }

  const removeFileType = (fileType: string) => {
    handleLibraryChange(
      "allowedFileTypes",
      templeSettings.library.allowedFileTypes.filter((type) => type !== fileType)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Library Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Access Control</CardTitle>
              <CardDescription>Configure library access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enablePublicAccess">Enable Public Access</Label>
                  <p className="text-sm text-gray-500">Allow public access to library content</p>
                </div>
                <Switch
                  id="enablePublicAccess"
                  checked={templeSettings.library.enablePublicAccess}
                  onCheckedChange={(checked) => handleLibraryChange("enablePublicAccess", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableDownload">Enable Download</Label>
                  <p className="text-sm text-gray-500">Allow users to download library files</p>
                </div>
                <Switch
                  id="enableDownload"
                  checked={templeSettings.library.enableDownload}
                  onCheckedChange={(checked) => handleLibraryChange("enableDownload", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSharing">Enable Sharing</Label>
                  <p className="text-sm text-gray-500">Allow users to share library content</p>
                </div>
                <Switch
                  id="enableSharing"
                  checked={templeSettings.library.enableSharing}
                  onCheckedChange={(checked) => handleLibraryChange("enableSharing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Management</CardTitle>
              <CardDescription>Configure file upload and storage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={templeSettings.library.maxFileSize}
                  onChange={(e) => handleLibraryChange("maxFileSize", parseInt(e.target.value))}
                  min="1"
                  max="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum file size allowed for uploads
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Auto Backup</Label>
                  <p className="text-sm text-gray-500">Automatically backup library files</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={templeSettings.library.autoBackup}
                  onCheckedChange={(checked) => handleLibraryChange("autoBackup", checked)}
                />
              </div>
              {templeSettings.library.autoBackup && (
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={templeSettings.library.backupFrequency}
                    onValueChange={(value) => handleLibraryChange("backupFrequency", value)}
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Allowed File Types</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">File Type Restrictions</CardTitle>
            <CardDescription>Manage allowed file types for library uploads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {templeSettings.library.allowedFileTypes.map((fileType) => (
                <div
                  key={fileType}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{fileType}</span>
                  <button
                    onClick={() => removeFileType(fileType)}
                    className="text-red-500 hover:text-red-700"
                    title={`Remove ${fileType} file type`}
                    aria-label={`Remove ${fileType} file type`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                placeholder="Add new file type (e.g., mp4)"
                onKeyPress={(e) => e.key === "Enter" && addFileType()}
              />
              <Button onClick={addFileType} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Common file types: pdf, doc, docx, jpg, jpeg, png, gif, mp3, mp4, avi, zip
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
