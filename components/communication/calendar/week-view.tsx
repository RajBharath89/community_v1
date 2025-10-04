"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  engagements: Engagement[]
  onEngagementClick: (engagement: Engagement) => void
  onCreateEngagement: (date?: string, time?: string) => void
  isMultiSelectMode?: boolean
  selectedDates?: string[]
}

export function WeekView({ 
  currentDate, 
  engagements, 
  onEngagementClick, 
  onCreateEngagement,
  isMultiSelectMode = false,
  selectedDates = []
}: WeekViewProps) {
  const today = new Date()
  
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
  
  // Generate week days
  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    weekDays.push(day)
  }

  // Get engagements for a specific date
  const getEngagementsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return engagements.filter(engagement => {
      if (!engagement.engagementDate) return false
      
      // Check for exact date match
      if (engagement.engagementDate === dateStr) return true
      
      // Check for recurring events
      if (engagement.recurrence && engagement.recurrence.pattern !== "none") {
        return isRecurringDateMatch(date, engagement)
      }
      
      return false
    })
  }

  // Check if a date matches a recurring pattern
  const isRecurringDateMatch = (date: Date, engagement: Engagement) => {
    if (!engagement.recurrence || !engagement.engagementDate) return false
    
    const baseDate = new Date(engagement.engagementDate)
    const { pattern, selectedDays, endDate } = engagement.recurrence
    
    // Check if date is before end date
    if (endDate && date > new Date(endDate)) return false
    
    switch (pattern) {
      case "daily":
        return date >= baseDate
      case "weekly":
        if (!selectedDays || selectedDays.length === 0) return false
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        return selectedDays.includes(dayName) && date >= baseDate
      case "bi-weekly":
        if (!selectedDays || selectedDays.length === 0) return false
        const biWeekDayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        if (!selectedDays.includes(biWeekDayName)) return false
        const weeksDiff = Math.floor((date.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
        return weeksDiff >= 0 && weeksDiff % 2 === 0
      case "monthly":
        return date.getDate() === baseDate.getDate() && date >= baseDate
      case "yearly":
        return date.getMonth() === baseDate.getMonth() && 
               date.getDate() === baseDate.getDate() && 
               date >= baseDate
      default:
        return false
    }
  }

  // Get color for engagement type
  const getEngagementColor = (type: string) => {
    switch (type) {
      case "Announcement":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Event":
        return "bg-green-100 text-green-800 border-green-200"
      case "Meeting":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Sort engagements by time
  const sortEngagementsByTime = (engagements: Engagement[]) => {
    return [...engagements].sort((a, b) => {
      if (!a.engagementTime && !b.engagementTime) return 0
      if (!a.engagementTime) return 1
      if (!b.engagementTime) return -1
      return a.engagementTime.localeCompare(b.engagementTime)
    })
  }

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="grid grid-cols-7 gap-1 overflow-x-auto">
        {weekDays.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString()
          const dayEngagements = getEngagementsForDate(day)
          const dateStr = day.toISOString().split('T')[0]

          return (
            <div
              key={index}
              className={cn(
                "p-3 border rounded-lg",
                isToday && "bg-blue-50 border-blue-200"
              )}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={cn(
                    "text-lg font-semibold",
                    isToday && "text-blue-600"
                  )}>
                    {day.getDate()}
                  </div>
                </div>
              </div>

              {/* Engagements count */}
              {dayEngagements.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  {dayEngagements.length} engagement{dayEngagements.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Week content - detailed view */}
      <div className="grid grid-cols-7 gap-1 overflow-x-auto">
                 {weekDays.map((day, index) => {
           const isToday = day.toDateString() === today.toDateString()
           const dayEngagements = sortEngagementsByTime(getEngagementsForDate(day))
           const dateStr = day.toISOString().split('T')[0]

           return (
            <div
              key={index}
              className={cn(
                "min-h-[400px] p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors",
                isToday && "bg-blue-50 border-blue-200",
                isMultiSelectMode && selectedDates.includes(dateStr) && "bg-primary/20 border-primary"
              )}
              onClick={() => onCreateEngagement(dateStr)}
            >
              {/* Engagements list */}
              <div className="space-y-2">
                {dayEngagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className={cn(
                      "p-2 rounded cursor-pointer hover:opacity-80 transition-opacity",
                      getEngagementColor(engagement.messageType)
                    )}
                    onClick={() => onEngagementClick(engagement)}
                  >
                    <div className="font-medium text-sm truncate">
                      {engagement.title}
                    </div>
                    {engagement.engagementTime && (
                      <div className="text-xs opacity-75 font-medium">
                        {formatTime(engagement.engagementTime)}
                      </div>
                    )}
                    <div className="text-xs opacity-75 truncate">
                      {engagement.subject}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        {engagement.messageType}
                      </Badge>
                      {engagement.rsvpEnabled && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                          RSVP
                        </Badge>
                      )}
                      {engagement.priority === "High" && (
                        <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                          High
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {dayEngagements.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-center text-muted-foreground text-sm">
                    <div>
                      <Plus className="h-6 w-6 mx-auto mb-2 opacity-30" />
                      <div>Click to add engagement</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
