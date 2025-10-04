"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailNotifications } from "../notifications/email-notifications"
import { SmsNotifications } from "../notifications/sms-notifications"
import { PushNotifications } from "../notifications/push-notifications"
import { NotificationTemplates } from "../notifications/notification-templates"
import { NotificationSchedules } from "../notifications/notification-schedules"

export function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("email")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure notification triggers, templates, and delivery preferences
        </p>
      </div>

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
  )
}
