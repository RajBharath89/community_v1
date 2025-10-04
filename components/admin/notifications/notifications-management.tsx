"use client"

import { useState } from "react"
import { Save, RotateCcw, AlertCircle, Bell, Mail, MessageSquare, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettingsStore } from "@/stores/settings-store"
import { EmailNotifications } from "./email-notifications"
import { SmsNotifications } from "./sms-notifications"
import { PushNotifications } from "./push-notifications"
import { NotificationTemplates } from "./notification-templates"
import { NotificationSchedules } from "./notification-schedules"

export default function NotificationsManagement() {
  const { notificationSettings, updateNotificationSettings, saveSettings, resetSettings, isLoading, hasUnsavedChanges, lastSaved } = useSettingsStore()
  const [activeTab, setActiveTab] = useState("email")

  const handleSave = async () => {
    try {
      await saveSettings()
    } catch (error) {
      console.error("Failed to save notification settings:", error)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all notification settings to default values? This action cannot be undone.")) {
      resetSettings()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-red-100">
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-70">
          <img
            src="/sai-baba-blessing-devotees-in-temple-setting-with-.png"
            alt="Sai Baba blessing devotees"
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="relative z-10 ml-20 sm:ml-28 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
              Manage notification triggers, templates, and delivery preferences
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

      {/* Notification Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1">
            <TabsTrigger value="email" className="text-xs sm:text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="text-xs sm:text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">SMS</span>
            </TabsTrigger>
            <TabsTrigger value="push" className="text-xs sm:text-sm flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Push</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs sm:text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="text-xs sm:text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Schedules</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="p-4 sm:p-6">
            <EmailNotifications />
          </TabsContent>

          <TabsContent value="sms" className="p-4 sm:p-6">
            <SmsNotifications />
          </TabsContent>

          <TabsContent value="push" className="p-4 sm:p-6">
            <PushNotifications />
          </TabsContent>

          <TabsContent value="templates" className="p-4 sm:p-6">
            <NotificationTemplates />
          </TabsContent>

          <TabsContent value="schedules" className="p-4 sm:p-6">
            <NotificationSchedules />
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

export { NotificationsManagement }
