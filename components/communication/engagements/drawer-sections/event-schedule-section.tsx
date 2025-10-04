"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar,
  Clock
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { ConflictChecker } from "./conflict-checker"

interface EventScheduleSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function EventScheduleSection({ formData, setFormData, isEditing, validationErrors }: EventScheduleSectionProps) {
  return (
    <div className="space-y-6">
      {/* Engagement Date and Time */}
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800 text-base">
            <Calendar className="h-4 w-4" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engagement-date" className="text-sm font-medium">
                Event Date *
              </Label>
              {isEditing ? (
                <>
                  <Input
                    id="engagement-date"
                    type="date"
                    value={formData.engagementDate || ""}
                    onChange={(e) => setFormData({ ...formData, engagementDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                  {validationErrors.engagementDate && <p className="text-sm text-red-600">{validationErrors.engagementDate}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                  {formData.engagementDate ? new Date(formData.engagementDate).toLocaleDateString() : "No date set"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engagement-time" className="text-sm font-medium">
                Event Time *
              </Label>
              {isEditing ? (
                <>
                  <Input
                    id="engagement-time"
                    type="time"
                    value={formData.engagementTime || ""}
                    onChange={(e) => setFormData({ ...formData, engagementTime: e.target.value })}
                    className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                  {validationErrors.engagementTime && <p className="text-sm text-red-600">{validationErrors.engagementTime}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                  {formData.engagementTime || "No time set"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Conflict Checker */}
      <ConflictChecker
        date={formData.engagementDate || ""}
        time={formData.engagementTime || ""}
        excludeId={formData.id}
        isEditing={isEditing}
      />
    </div>
  )
}
