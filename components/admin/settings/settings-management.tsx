"use client"

import { useState } from "react"
import { Save, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettingsStore } from "@/stores/settings-store"
import { GeneralSettings } from "./general-settings"
import { SecuritySettings } from "./security-settings"
import { CommunicationSettings } from "./communication-settings"
import { DonationSettings } from "./donation-settings"
import { EventSettings } from "./event-settings"
import { LibrarySettings } from "./library-settings"
import { BackupSettings } from "./backup-settings"
import { SystemSettings } from "./system-settings"
import { NotificationSettings } from "./notification-settings"

export default function SettingsManagement() {
  const { saveSettings, resetSettings, isLoading, hasUnsavedChanges, lastSaved } = useSettingsStore()
  const [activeTab, setActiveTab] = useState("general")

  const handleSave = async () => {
    try {
      await saveSettings()
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values? This action cannot be undone.")) {
      resetSettings()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-50 to-orange-45 rounded-xl p-4 sm:p-6 border border-red-100">
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-70">
          <img
            src="/sai-baba-blessing-devotees-in-temple-setting-with-.png"
            alt="Sai Baba blessing devotees"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="relative z-10 ml-20 sm:ml-28 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
              Configure temple settings and preferences
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10 flex items-center gap-2">
            {hasUnsavedChanges && (
              <Alert className="mb-0 mr-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>You have unsaved changes</AlertDescription>
              </Alert>
            )}
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
              className="bg-red-500 hover:bg-red-600 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1">
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
            <TabsTrigger value="communication" className="text-xs sm:text-sm">
              Communication
            </TabsTrigger>
            <TabsTrigger value="donations" className="text-xs sm:text-sm">
              Donations
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">
              Events
            </TabsTrigger>
            <TabsTrigger value="library" className="text-xs sm:text-sm">
              Library
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-4 sm:p-6">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="security" className="p-4 sm:p-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="communication" className="p-4 sm:p-6">
            <CommunicationSettings />
          </TabsContent>

          <TabsContent value="donations" className="p-4 sm:p-6">
            <DonationSettings />
          </TabsContent>

          <TabsContent value="events" className="p-4 sm:p-6">
            <EventSettings />
          </TabsContent>

          <TabsContent value="library" className="p-4 sm:p-6">
            <LibrarySettings />
          </TabsContent>

          <TabsContent value="notifications" className="p-4 sm:p-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="system" className="p-4 sm:p-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Last Saved Info */}
      {lastSaved && (
        <div className="text-center text-sm text-gray-500">
          Last saved: {new Date(lastSaved).toLocaleString()}
        </div>
      )}
    </div>
  )
}

export { SettingsManagement }
