"use client"

import { useEffect, useState } from "react"
import { useEngagementStore } from "@/stores/engagement-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"

interface ConflictCheckerProps {
  date: string
  time: string
  recurrence?: Engagement['recurrence']
  excludeId?: string
  isEditing: boolean
}

export function ConflictChecker({ date, time, recurrence, excludeId, isEditing }: ConflictCheckerProps) {
  const { checkScheduleConflicts, checkRecurrenceConflicts, getConflictSummary } = useEngagementStore()
  const [showDetails, setShowDetails] = useState(false)
  const [scheduleConflicts, setScheduleConflicts] = useState<any[]>([])
  const [recurrenceConflicts, setRecurrenceConflicts] = useState<any[]>([])
  const [conflictSummary, setConflictSummary] = useState<any>(null)

  useEffect(() => {
    if (!date || !time || !isEditing) {
      setScheduleConflicts([])
      setRecurrenceConflicts([])
      setConflictSummary({ hasConflicts: false, severity: "none", summary: "No conflicts detected" })
      return
    }

    // Check schedule conflicts
    const scheduleConflicts = checkScheduleConflicts(date, time, 60, excludeId)
    setScheduleConflicts(scheduleConflicts)

    // Check recurrence conflicts if applicable
    let recurrenceConflicts: any[] = []
    if (recurrence && recurrence.pattern !== "none") {
      recurrenceConflicts = checkRecurrenceConflicts(date, time, recurrence, excludeId)
    }
    setRecurrenceConflicts(recurrenceConflicts)

    // Get combined conflict summary
    const allConflicts = [...scheduleConflicts, ...recurrenceConflicts]
    const summary = getConflictSummary(allConflicts)
    setConflictSummary(summary)
  }, [date, time, recurrence, excludeId, isEditing, checkScheduleConflicts, checkRecurrenceConflicts, getConflictSummary])

  if (!isEditing || !date || !time) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <Info className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const allConflicts = [...scheduleConflicts, ...recurrenceConflicts]

  return (
    <Card className={`border-2 ${
      conflictSummary?.hasConflicts 
        ? conflictSummary.severity === "high" 
          ? "border-red-200 bg-red-50/30" 
          : conflictSummary.severity === "medium"
          ? "border-yellow-200 bg-yellow-50/30"
          : "border-blue-200 bg-blue-50/30"
        : "border-green-200 bg-green-50/30"
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {conflictSummary?.hasConflicts ? (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <span>Schedule Conflict Check</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 w-6 p-0"
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getSeverityColor(conflictSummary?.severity || "none")}
            >
              {getSeverityIcon(conflictSummary?.severity || "none")}
              <span className="ml-1">
                {conflictSummary?.hasConflicts 
                  ? `${conflictSummary.counts?.total || 0} Conflict${conflictSummary.counts?.total !== 1 ? 's' : ''}`
                  : "No Conflicts"
                }
              </span>
            </Badge>
          </div>
          <span className="text-sm text-gray-600">
            {conflictSummary?.summary}
          </span>
        </div>

        {/* Conflict Details */}
        {showDetails && allConflicts.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Conflict Details:</div>
            
            {allConflicts.map((conflict, index) => (
              <Alert key={index} className={`border-l-4 ${
                conflict.severity === "high" ? "border-l-red-500 bg-red-50" :
                conflict.severity === "medium" ? "border-l-yellow-500 bg-yellow-50" :
                "border-l-blue-500 bg-blue-50"
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <div className="font-medium">{conflict.message}</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{conflict.engagement.engagementDate}</span>
                      <Clock className="h-3 w-3" />
                      <span>{conflict.engagement.engagementTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {conflict.engagement.messageType}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {conflict.engagement.status}
                      </span>
                    </div>
                    {conflict.affectedDates && conflict.affectedDates.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Affected dates: {conflict.affectedDates.slice(0, 3).join(", ")}
                        {conflict.affectedDates.length > 3 && ` and ${conflict.affectedDates.length - 3} more`}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* No Conflicts Message */}
        {showDetails && allConflicts.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">No scheduling conflicts detected</p>
            <p className="text-xs text-gray-500 mt-1">
              This time slot is available for scheduling
            </p>
          </div>
        )}

        {/* Recommendations */}
        {conflictSummary?.hasConflicts && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Recommendations:</div>
            <ul className="text-xs text-gray-600 space-y-1">
              {conflictSummary.severity === "high" && (
                <li>• Consider rescheduling to avoid conflicts with existing events</li>
              )}
              {conflictSummary.severity === "medium" && (
                <li>• Review adjacent events to ensure adequate preparation time</li>
              )}
              <li>• Check if any events can be moved or combined</li>
              <li>• Consider different time slots or dates</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
