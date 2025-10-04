"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  currentDate: Date
  engagements: Engagement[]
  onEngagementClick: (engagement: Engagement) => void
  onCreateEngagement: (date?: string, time?: string) => void
  isMultiSelectMode?: boolean
  selectedDates?: string[]
}

export function MonthView({ 
  currentDate, 
  engagements, 
  onEngagementClick, 
  onCreateEngagement,
  isMultiSelectMode = false,
  selectedDates = []
}: MonthViewProps) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and calculate starting date for calendar grid
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

  // Generate calendar days
  const calendarDays = []
  const currentDay = new Date(startDate)
  
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    calendarDays.push(new Date(currentDay))
    currentDay.setDate(currentDay.getDate() + 1)
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 overflow-x-auto">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month
          const isToday = date.toDateString() === today.toDateString()
          const dayEngagements = getEngagementsForDate(date)
          const dateStr = date.toISOString().split('T')[0]

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] p-2 border rounded-lg group cursor-pointer hover:bg-muted/30 transition-colors",
                !isCurrentMonth && "bg-muted/50 text-muted-foreground",
                isToday && "bg-blue-50 border-blue-200",
                isMultiSelectMode && selectedDates.includes(dateStr) && "bg-primary/20 border-primary"
              )}
              onClick={() => onCreateEngagement(dateStr)}
              aria-label={`${date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-sm font-medium",
                  isToday && "text-blue-600 font-bold"
                )}>
                  {date.getDate()}
                </span>
                {isMultiSelectMode && selectedDates.includes(dateStr) && (
                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                    <CheckSquare className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Engagements */}
              <div className="space-y-1">
                {dayEngagements.slice(0, 3).map((engagement) => (
                  <div
                    key={engagement.id}
                    className={cn(
                      "text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity",
                      getEngagementColor(engagement.messageType)
                    )}
                    onClick={() => onEngagementClick(engagement)}
                    title={`${engagement.title} - ${formatTime(engagement.engagementTime || '')}`}
                  >
                    <div className="truncate font-medium">
                      {engagement.title}
                    </div>
                    {engagement.engagementTime && (
                      <div className="text-xs opacity-75">
                        {formatTime(engagement.engagementTime)}
                      </div>
                    )}
                    {engagement.rsvpEnabled && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        RSVP
                      </Badge>
                    )}
                  </div>
                ))}
                {dayEngagements.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEngagements.length - 3} more
                  </div>
                )}
                
                {/* Empty state indicator */}
                {dayEngagements.length === 0 && (
                  <div className="h-16 flex items-center justify-center text-center text-muted-foreground text-xs">
                    <div>
                      <Plus className="h-4 w-4 mx-auto mb-1 opacity-30" />
                      <div>Click to add</div>
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
