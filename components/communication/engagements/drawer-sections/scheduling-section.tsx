"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarDays, Clock } from "lucide-react"

interface SchedulingSectionProps {
  scheduledDate: string
  setScheduledDate: (date: string) => void
  scheduledTime: string
  setScheduledTime: (time: string) => void
  isScheduleEnabled: boolean
  setIsScheduleEnabled: (enabled: boolean) => void
  validationErrors: Record<string, string>
  setValidationErrors: (errors: Record<string, string>) => void
}

export function SchedulingSection({
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  isScheduleEnabled,
  setIsScheduleEnabled,
  validationErrors,
  setValidationErrors,
}: SchedulingSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Label htmlFor="schedule-toggle" className="text-sm font-medium">
            Enable Scheduling
          </Label>
          <Switch id="schedule-toggle" checked={isScheduleEnabled} onCheckedChange={setIsScheduleEnabled} />
        </div>
      </div>

      {isScheduleEnabled && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledDate" className="text-sm font-medium">
              Scheduled Date
            </Label>
            <Input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => {
                setScheduledDate(e.target.value)
                if (validationErrors.scheduledDate) {
                  setValidationErrors({ ...validationErrors, scheduledDate: "" })
                }
              }}
              min={new Date().toISOString().split("T")[0]}
              className="focus-visible:ring-red-500 focus-visible:border-red-500"
            />
            <p className="text-xs text-muted-foreground">dd-mm-yyyy</p>
            {validationErrors.scheduledDate && <p className="text-sm text-red-500">{validationErrors.scheduledDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledTime" className="text-sm font-medium">
              Scheduled Time
            </Label>
            <Input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => {
                setScheduledTime(e.target.value)
                if (validationErrors.scheduledTime) {
                  setValidationErrors({ ...validationErrors, scheduledTime: "" })
                }
              }}
              className="focus-visible:ring-red-500 focus-visible:border-red-500"
            />
            {validationErrors.scheduledTime && <p className="text-sm text-red-500">{validationErrors.scheduledTime}</p>}
          </div>
        </div>
      )}

      {isScheduleEnabled && scheduledDate && scheduledTime && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-700">
              This engagement will be sent on {new Date(scheduledDate).toLocaleDateString()} at {scheduledTime}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
