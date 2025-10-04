"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Send, Timer, Globe } from "lucide-react"

interface SchedulingComponentProps {
  onSchedule: (scheduleData: {
    type: "immediate" | "scheduled"
    scheduledDate?: string
    scheduledTime?: string
    timezone?: string
  }) => void
  disabled?: boolean
}

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "EST", label: "EST (Eastern Standard Time)" },
  { value: "PST", label: "PST (Pacific Standard Time)" },
  { value: "IST", label: "IST (India Standard Time)" },
  { value: "GMT", label: "GMT (Greenwich Mean Time)" },
]

export function SchedulingComponent({ onSchedule, disabled = false }: SchedulingComponentProps) {
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">("immediate")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [timezone, setTimezone] = useState("UTC")

  const handleSchedule = () => {
    onSchedule({
      type: scheduleType,
      scheduledDate: scheduleType === "scheduled" ? scheduledDate : undefined,
      scheduledTime: scheduleType === "scheduled" ? scheduledTime : undefined,
      timezone: scheduleType === "scheduled" ? timezone : undefined,
    })
  }

  const isScheduleValid = scheduleType === "immediate" || (scheduledDate && scheduledTime)

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-red-500" />
          Delivery Scheduling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedule Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Delivery Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={scheduleType === "immediate" ? "default" : "outline"}
              onClick={() => setScheduleType("immediate")}
              disabled={disabled}
              className={`flex items-center gap-2 ${
                scheduleType === "immediate"
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
            >
              <Send className="h-4 w-4" />
              Send Now
            </Button>
            <Button
              variant={scheduleType === "scheduled" ? "default" : "outline"}
              onClick={() => setScheduleType("scheduled")}
              disabled={disabled}
              className={`flex items-center gap-2 ${
                scheduleType === "scheduled"
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
            >
              <Clock className="h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        {scheduleType === "scheduled" && (
          <>
            <Separator />

            {/* Date and Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-date" className="text-sm font-medium">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    disabled={disabled}
                    className="pl-10 hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled-time" className="text-sm font-medium">
                  Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    disabled={disabled}
                    className="pl-10 hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Timezone Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone} disabled={disabled}>
                <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Preview */}
            {scheduledDate && scheduledTime && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Scheduled Delivery</span>
                </div>
                <div className="text-sm text-red-700">
                  <p>Date: {new Date(scheduledDate).toLocaleDateString()}</p>
                  <p>Time: {scheduledTime}</p>
                  <p>Timezone: {timezone}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={handleSchedule}
            disabled={disabled || !isScheduleValid}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
          >
            {scheduleType === "immediate" ? (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Broadcast Now
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Broadcast
              </>
            )}
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            {scheduleType === "immediate" ? "Immediate Delivery" : "Scheduled Delivery"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
