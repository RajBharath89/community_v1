"use client"

import { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import rrulePlugin from "@fullcalendar/rrule"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Search, Megaphone, Users, Clock, FileText, AlertTriangle, Bell, Zap, Send, ChevronLeft, ChevronRight } from "lucide-react"
import { useEngagementStore, Engagement } from "@/stores/engagement-store"
import { useBroadcastStore } from "@/stores/broadcast-store"
import { cn } from "@/lib/utils"

interface FullCalendarViewProps {
  onEngagementClick?: (engagement: Engagement) => void
  onCreateEngagement?: (date?: string, time?: string) => void
}

export function FullCalendarView({ onEngagementClick, onCreateEngagement }: FullCalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    filteredEngagements,
    openDrawer,
    deleteEngagement,
    sendEngagement
  } = useEngagementStore()

  // Ensure FullCalendar switches views when currentView changes
  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (api && api.view?.type !== currentView) {
      // Defer to avoid nested flush during render lifecycle
      queueMicrotask(() => api.changeView(currentView))
    }
  }, [currentView])

  const formatRangeLabel = (viewType: string, date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    if (viewType === 'dayGridMonth') {
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    }
    if (viewType === 'timeGridWeek') {
      const start = new Date(date)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      return `${startStr} - ${endStr}`
    }
    if (viewType === 'timeGridDay') {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }
    return ''
  }

  // Convert engagements to FullCalendar events
  const convertEngagementsToEvents = (engagements: Engagement[]) => {
    const events: any[] = []
    
    engagements.forEach(engagement => {
      if (!engagement.engagementDate) return

      // No need to filter here - filteredEngagements already contains filtered data

      const baseEvent = {
        id: engagement.id,
        title: engagement.title,
        start: engagement.engagementDate + (engagement.engagementTime ? `T${engagement.engagementTime}` : ''),
        end: engagement.engagementDate + (engagement.engagementTime ? `T${engagement.engagementTime}` : ''),
        allDay: !engagement.engagementTime,
        extendedProps: {
          engagement: engagement,
          type: engagement.messageType,
          status: engagement.status,
          priority: engagement.priority,
          rsvpEnabled: engagement.rsvpEnabled,
          location: engagement.location,
          subject: engagement.subject,
          content: engagement.content
        }
      }

      // Add recurring events
      if (engagement.recurrence && engagement.recurrence.pattern !== "none") {
        const recurringEvent = {
          ...baseEvent,
          rrule: generateRRule(engagement.recurrence, engagement.engagementDate)
        }
        events.push(recurringEvent)
      } else {
        events.push(baseEvent)
      }
    })

    return events
  }

  // Generate RRule for recurring events
  const generateRRule = (recurrence: any, startDate: string) => {
    const { pattern, selectedDays, interval = 1, endDate } = recurrence
    
    let freq = 'DAILY'
    let byweekday: string[] = []
    let finalInterval = interval
    
    switch (pattern) {
      case 'daily':
        freq = 'DAILY'
        break
      case 'weekly':
        freq = 'WEEKLY'
        if (selectedDays && selectedDays.length > 0) {
          byweekday = selectedDays.map((day: string) => {
            const dayMap: { [key: string]: string } = {
              'monday': 'MO',
              'tuesday': 'TU', 
              'wednesday': 'WE',
              'thursday': 'TH',
              'friday': 'FR',
              'saturday': 'SA',
              'sunday': 'SU'
            }
            return dayMap[day] || 'MO'
          })
        }
        break
      case 'bi-weekly':
        freq = 'WEEKLY'
        finalInterval = 2
        if (selectedDays && selectedDays.length > 0) {
          byweekday = selectedDays.map((day: string) => {
            const dayMap: { [key: string]: string } = {
              'monday': 'MO',
              'tuesday': 'TU', 
              'wednesday': 'WE',
              'thursday': 'TH',
              'friday': 'FR',
              'saturday': 'SA',
              'sunday': 'SU'
            }
            return dayMap[day] || 'MO'
          })
        }
        break
      case 'monthly':
        freq = 'MONTHLY'
        break
      case 'yearly':
        freq = 'YEARLY'
        break
    }

    let rrule = `FREQ=${freq};INTERVAL=${finalInterval}`
    if (byweekday.length > 0) {
      rrule += `;BYDAY=${byweekday.join(',')}`
    }
    if (endDate) {
      rrule += `;UNTIL=${endDate.replace(/-/g, '')}`
    }

    return rrule
  }

  // Event rendering
  const eventContent = (arg: any) => {
    const engagement = arg.event.extendedProps.engagement
    const type = arg.event.extendedProps.type
    const priority = arg.event.extendedProps.priority
    const rsvpEnabled = arg.event.extendedProps.rsvpEnabled

    const getTypeColor = (type: string) => {
      switch (type) {
        case "Announcement": return "bg-blue-100 text-blue-800 border-blue-200"
        case "Event": return "bg-green-100 text-green-800 border-green-200"
        case "Meeting": return "bg-purple-100 text-purple-800 border-purple-200"
        default: return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    return (
      <div className={cn(
        "p-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity border",
        getTypeColor(type)
      )}>
        <div className="font-semibold truncate">{arg.event.title}</div>
        {arg.event.extendedProps.engagement.engagementTime && (
          <div className="text-xs opacity-75">
            {formatTime(arg.event.extendedProps.engagement.engagementTime)}
          </div>
        )}
        <div className="flex items-center gap-1 mt-1">
          {priority === "High" && (
            <Badge variant="destructive" className="text-xs px-1 py-0 h-3">
              High
            </Badge>
          )}
          {rsvpEnabled && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-3">
              RSVP
            </Badge>
          )}
        </div>
      </div>
    )
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

  // Event handlers
  const handleEventClick = (info: any) => {
    const engagement = info.event.extendedProps.engagement
    if (onEngagementClick) {
      onEngagementClick(engagement)
    } else {
      setSelectedEngagement(engagement)
      setIsModalOpen(true)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    const startDate = selectInfo.startStr
    const startTime = selectInfo.start.toTimeString().slice(0, 5)
    
    if (onCreateEngagement) {
      onCreateEngagement(startDate, startTime)
    } else {
      openDrawer("create")
    }
    
    calendarRef.current?.getApi().unselect()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEngagement(null)
  }

  const handleEditEngagement = (engagement: Engagement) => {
    setIsModalOpen(false)
    openDrawer("edit", engagement)
  }

  const handleDeleteEngagement = (engagement: Engagement) => {
    deleteEngagement(engagement.id)
    setIsModalOpen(false)
    setSelectedEngagement(null)
  }

  const handleSendEngagement = (engagement: Engagement) => {
    sendEngagement(engagement.id)
    setIsModalOpen(false)
    setSelectedEngagement(null)
  }

  const events = convertEngagementsToEvents(filteredEngagements)

  return (
    <div className="space-y-4">
        {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {/* View & Navigation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (!api) return
                api.prev()
                setCurrentDate(new Date(api.getDate()))
              }}
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (!api) return
                api.today()
                setCurrentDate(new Date(api.getDate()))
              }}
              title="Today"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (!api) return
                api.next()
                setCurrentDate(new Date(api.getDate()))
              }}
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant={currentView === 'dayGridMonth' ? 'outline' : 'outline'}
              size="sm"
              className={currentView === 'dayGridMonth' ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' : ''}
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (api) {
                  api.changeView('dayGridMonth')
                  setCurrentDate(new Date(api.getDate()))
                }
                setCurrentView('dayGridMonth')
              }}
            >
              Month
            </Button>
            <Button
              variant={currentView === 'timeGridWeek' ? 'outline' : 'outline'}
              size="sm"
              className={currentView === 'timeGridWeek' ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' : ''}
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (api) {
                  api.changeView('timeGridWeek')
                  setCurrentDate(new Date(api.getDate()))
                }
                setCurrentView('timeGridWeek')
              }}
            >
              Week
            </Button>
            <Button
              variant={currentView === 'timeGridDay' ? 'outline' : 'outline'}
              size="sm"
              className={currentView === 'timeGridDay' ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' : ''}
              onClick={() => {
                const api = calendarRef.current?.getApi()
                if (api) {
                  api.changeView('timeGridDay')
                  setCurrentDate(new Date(api.getDate()))
                }
                setCurrentView('timeGridDay')
              }}
            >
              Day
            </Button>
            
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <div className="flex items-center gap-1">
                <Megaphone className="h-3 w-3" /> Announcement
              </div>
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Event
              </div>
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Meeting
              </div>
            </Badge>
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search engagements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-gray-500" />
                  <span>All Status</span>
                </div>
              </SelectItem>
              <SelectItem value="Sent">
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4 text-green-500" />
                  <span>Sent</span>
                </div>
              </SelectItem>
              <SelectItem value="Scheduled">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Scheduled</span>
                </div>
              </SelectItem>
              <SelectItem value="Draft">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Draft</span>
                </div>
              </SelectItem>
              <SelectItem value="Failed">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Failed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>All Priorities</span>
                </div>
              </SelectItem>
              <SelectItem value="Urgent">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <span>Urgent</span>
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="Normal">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span>Normal</span>
                </div>
              </SelectItem>
              <SelectItem value="Low">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={messageTypeFilter} onValueChange={setMessageTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-gray-500" />
                  <span>All Types</span>
                </div>
              </SelectItem>
              <SelectItem value="Announcement">
                <div className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4 text-green-500" />
                  <span>Announcement</span>
                </div>
              </SelectItem>
              <SelectItem value="Event">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>Event</span>
                </div>
              </SelectItem>
              <SelectItem value="Meeting">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>Meeting</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {null}
        </div>

        
      </Card>

      {/* FullCalendar Component */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">
            {formatRangeLabel(currentView, currentDate)}
          </div>
        </div>
        <div className="fullcalendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={false}
            initialView={currentView}
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
              }
            }}
            events={events}
            eventContent={eventContent}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            expandRows={true}
            stickyHeaderDates={true}
            nowIndicator={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '09:00',
              endTime: '17:00',
            }}
          />
        </div>
      </Card>

      {/* Event Detail Modal */}
      {selectedEngagement && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge variant="secondary">{selectedEngagement.messageType}</Badge>
                {selectedEngagement.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Subject</h4>
                <p className="text-sm text-muted-foreground">{selectedEngagement.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold">Content</h4>
                <p className="text-sm text-muted-foreground">{selectedEngagement.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span>
                  <p>{selectedEngagement.engagementDate}</p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p>{selectedEngagement.engagementTime || 'All day'}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p>{selectedEngagement.status}</p>
                </div>
                <div>
                  <span className="font-medium">Priority:</span>
                  <p>{selectedEngagement.priority}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {selectedEngagement.status !== "Sent" && (
                  <Button variant="outline" size="sm" onClick={() => handleSendEngagement(selectedEngagement)}>
                    Send
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleEditEngagement(selectedEngagement)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteEngagement(selectedEngagement)}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
                 </Dialog>
       )}
     </div>
   )
 }
