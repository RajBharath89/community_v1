"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Clock, MapPin, Users, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListViewProps {
  engagements: Engagement[]
  onEngagementClick: (engagement: Engagement) => void
  onCreateEngagement: (date?: string, time?: string) => void
}

export function ListView({ 
  engagements, 
  onEngagementClick, 
  onCreateEngagement 
}: ListViewProps) {
  const today = new Date()
  
  // Filter and sort engagements
  const upcomingEngagements = engagements
    .filter(engagement => {
      if (!engagement.engagementDate) return false
      const engagementDate = new Date(engagement.engagementDate)
      return engagementDate >= today
    })
    .sort((a, b) => {
      if (!a.engagementDate || !b.engagementDate) return 0
      const dateA = new Date(a.engagementDate)
      const dateB = new Date(b.engagementDate)
      
      // Sort by date first
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime()
      }
      
      // Then by time
      if (a.engagementTime && b.engagementTime) {
        return a.engagementTime.localeCompare(b.engagementTime)
      }
      
      return 0
    })

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

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
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

  // Group engagements by date
  const groupedEngagements = upcomingEngagements.reduce((groups, engagement) => {
    if (!engagement.engagementDate) return groups
    
    const dateKey = engagement.engagementDate
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(engagement)
    return groups
  }, {} as Record<string, Engagement[]>)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upcoming Engagements</h2>
          <p className="text-sm text-muted-foreground">
            {upcomingEngagements.length} engagement{upcomingEngagements.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <Button
          onClick={() => onCreateEngagement()}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Engagement
        </Button>
      </div>

      {/* Engagements list */}
      {Object.keys(groupedEngagements).length === 0 ? (
        <Card 
          className="p-8 text-center cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-muted hover:border-primary"
          onClick={() => onCreateEngagement()}
        >
          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No upcoming engagements</h3>
          <p className="text-muted-foreground mb-4">
            Click here to create your first engagement
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Plus className="h-4 w-4" />
            <span>Create Engagement</span>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEngagements)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, dateEngagements]) => (
              <div key={date} className="space-y-3">
                {/* Date header */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {formatDate(date)}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {dateEngagements.length} engagement{dateEngagements.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Engagements for this date */}
                <div className="space-y-2">
                  {dateEngagements.map((engagement) => (
                    <Card
                      key={engagement.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onEngagementClick(engagement)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">
                              {engagement.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", getEngagementColor(engagement.messageType))}
                            >
                              {engagement.messageType}
                            </Badge>
                            {engagement.rsvpEnabled && (
                              <Badge variant="outline" className="text-xs">
                                RSVP
                              </Badge>
                            )}
                            {engagement.priority === "High" && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                            {engagement.priority === "Urgent" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {engagement.subject}
                          </p>
                          
                          {/* Engagement details */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                            <div className="flex items-center gap-1">
                              <span>Status:</span>
                              <Badge 
                                variant={engagement.status === "Scheduled" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {engagement.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* RSVP stats if enabled */}
                        {engagement.rsvpEnabled && engagement.rsvpStats && (
                          <div className="ml-4 text-right">
                            <div className="text-xs text-muted-foreground mb-1">RSVP</div>
                            <div className="text-sm font-semibold text-green-600">
                              {engagement.rsvpStats.attending} attending
                            </div>
                            {engagement.rsvpStats.maybe > 0 && (
                              <div className="text-xs text-yellow-600">
                                {engagement.rsvpStats.maybe} maybe
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
