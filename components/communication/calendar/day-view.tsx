"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Clock, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayViewProps {
  currentDate: Date
  engagements: Engagement[]
  onEngagementClick: (engagement: Engagement) => void
  onCreateEngagement: (date?: string, time?: string) => void
}

export function DayView({ 
  currentDate, 
  engagements, 
  onEngagementClick, 
  onCreateEngagement 
}: DayViewProps) {
  const today = new Date()
  const isToday = currentDate.toDateString() === today.toDateString()
  const dateStr = currentDate.toISOString().split('T')[0]

  // Get engagements for the current date
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

  // Generate hourly slots (6 AM to 11 PM)
  const generateHourlySlots = () => {
    const slots = []
    for (let hour = 6; hour <= 23; hour++) {
      slots.push({
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        displayTime: formatTime(`${hour.toString().padStart(2, '0')}:00`)
      })
    }
    return slots
  }

  const dayEngagements = getEngagementsForDate(currentDate)
  const hourlySlots = generateHourlySlots()

  // Sort engagements by time
  const sortedEngagements = [...dayEngagements].sort((a, b) => {
    if (!a.engagementTime && !b.engagementTime) return 0
    if (!a.engagementTime) return 1
    if (!b.engagementTime) return -1
    return a.engagementTime.localeCompare(b.engagementTime)
  })

  // Get engagement for a specific hour
  const getEngagementForHour = (hour: number) => {
    return sortedEngagements.find(engagement => {
      if (!engagement.engagementTime) return false
      const [engagementHour] = engagement.engagementTime.split(':')
      return parseInt(engagementHour) === hour
    })
  }

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          {isToday && (
            <p className="text-sm text-muted-foreground">Today</p>
          )}
        </div>
        <Button
          onClick={() => onCreateEngagement(dateStr)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Engagement
        </Button>
      </div>

      {/* Timeline view */}
      <div className="space-y-2">
        {hourlySlots.map((slot) => {
          const engagement = getEngagementForHour(slot.hour)
          
          return (
            <div key={slot.hour} className="flex items-start gap-4">
              {/* Time column */}
              <div className="w-20 text-sm text-muted-foreground pt-2">
                {slot.displayTime}
              </div>
              
              {/* Content column */}
              <div className="flex-1 min-h-[60px] border-l-2 border-muted pl-4">
                {engagement ? (
                  <div
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity mb-2",
                      getEngagementColor(engagement.messageType)
                    )}
                    onClick={() => onEngagementClick(engagement)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {engagement.title}
                        </h3>
                        <p className="text-xs opacity-75 mt-1">
                          {engagement.subject}
                        </p>
                        
                        {/* Engagement details */}
                        <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                          {engagement.engagementTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(engagement.engagementTime)}
                            </div>
                          )}
                          {engagement.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {engagement.location}
                            </div>
                          )}
                          {engagement.totalRecipients > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {engagement.totalRecipients} recipients
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-col gap-1 ml-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                          {engagement.messageType}
                        </Badge>
                        {engagement.rsvpEnabled && (
                          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                            RSVP
                          </Badge>
                        )}
                        {engagement.priority === "High" && (
                          <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                            High
                          </Badge>
                        )}
                        {engagement.priority === "Urgent" && (
                          <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="h-12 flex items-center justify-center border-2 border-dashed border-muted rounded cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => onCreateEngagement(dateStr, slot.time)}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Click to add</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      {sortedEngagements.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Day Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Engagements</div>
              <div className="font-semibold">{sortedEngagements.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Events</div>
              <div className="font-semibold">
                {sortedEngagements.filter(e => e.messageType === "Event").length}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Meetings</div>
              <div className="font-semibold">
                {sortedEngagements.filter(e => e.messageType === "Meeting").length}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Announcements</div>
              <div className="font-semibold">
                {sortedEngagements.filter(e => e.messageType === "Announcement").length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
