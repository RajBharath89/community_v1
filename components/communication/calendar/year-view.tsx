"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface YearViewProps {
  currentDate: Date
  engagements: Engagement[]
  onEngagementClick: (engagement: Engagement) => void
  onCreateEngagement: (date?: string, time?: string) => void
}

export function YearView({ 
  currentDate, 
  engagements, 
  onEngagementClick, 
  onCreateEngagement 
}: YearViewProps) {
  const today = new Date()
  const year = currentDate.getFullYear()

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

  // Generate months for the year
  const months = []
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1)
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' })
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // Get first day of month and calculate starting date for calendar grid
    const firstDayOfMonth = new Date(year, month, 1)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

    // Generate calendar days for this month
    const calendarDays = []
    const currentDay = new Date(startDate)
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      calendarDays.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    months.push({
      month,
      monthName,
      calendarDays,
      isCurrentMonth: month === today.getMonth() && year === today.getFullYear()
    })
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="space-y-6">
      {/* Year header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">{year}</h2>
      </div>

      {/* Year grid - 4 columns, 3 rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {months.map(({ month, monthName, calendarDays, isCurrentMonth }) => (
          <Card key={month} className="p-4">
            {/* Month header */}
            <div className="text-center mb-3">
              <h3 className={cn(
                "font-semibold text-sm",
                isCurrentMonth && "text-blue-600 font-bold"
              )}>
                {monthName}
              </h3>
            </div>

            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isCurrentMonthDay = date.getMonth() === month
                const isToday = date.toDateString() === today.toDateString()
                const dayEngagements = getEngagementsForDate(date)
                const dateStr = date.toISOString().split('T')[0]

                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square p-1 border rounded cursor-pointer hover:bg-muted/50 transition-colors group",
                      !isCurrentMonthDay && "bg-muted/30 text-muted-foreground",
                      isToday && "bg-blue-100 border-blue-300 text-blue-700 font-bold"
                    )}
                    onClick={() => onCreateEngagement(dateStr)}
                    title={`${date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}`}
                  >
                    {/* Date number */}
                    <div className="text-xs font-medium mb-1">
                      {date.getDate()}
                    </div>

                    {/* Engagements */}
                    <div className="space-y-0.5">
                      {dayEngagements.slice(0, 2).map((engagement) => (
                        <div
                          key={engagement.id}
                          className={cn(
                            "text-xs p-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity truncate",
                            getEngagementColor(engagement.messageType)
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEngagementClick(engagement)
                          }}
                          title={`${engagement.title} - ${formatTime(engagement.engagementTime || '')}`}
                        >
                          <div className="truncate">
                            {engagement.title}
                          </div>
                        </div>
                      ))}
                      {dayEngagements.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEngagements.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
