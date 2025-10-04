"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter, HelpCircle, Square, CheckSquare } from "lucide-react"
import { useEngagementStore, Engagement } from "@/stores/engagement-store"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { WorkWeekView } from "./work-week-view"
import { DayView } from "./day-view"
import { YearView } from "./year-view"
import { ListView } from "./list-view"
import { CalendarFilters } from "./calendar-filters"
import { CalendarEventModal } from "./calendar-event-modal"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export type CalendarViewType = "month" | "week" | "workweek" | "day" | "year" | "list"

interface CalendarViewProps {
  onEngagementClick?: (engagement: Engagement) => void
  onCreateEngagement?: (date?: string, time?: string) => void
}

export function CalendarView({ onEngagementClick, onCreateEngagement }: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<CalendarViewType>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)

  const { engagements, openDrawer, deleteEngagement, sendEngagement } = useEngagementStore()

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't handle keyboard shortcuts when typing
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          handlePrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          handleNext()
          break
        case 't':
        case 'T':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            handleToday()
          }
          break
        case 'n':
        case 'N':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            handleCreateEngagement()
          }
          break
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            setShowFilters(!showFilters)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showFilters])

  // Filter engagements based on search and filters
  const filteredEngagements = engagements.filter((engagement) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!engagement.title.toLowerCase().includes(query) &&
          !engagement.subject.toLowerCase().includes(query) &&
          !engagement.content.toLowerCase().includes(query)) {
        return false
      }
    }

    // Type filter
    if (typeFilter.length > 0 && !typeFilter.includes(engagement.messageType)) {
      return false
    }

    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(engagement.status)) {
      return false
    }

    return true
  })

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    switch (currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case "week":
      case "workweek":
        newDate.setDate(newDate.getDate() - 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() - 1)
        break
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    switch (currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "week":
      case "workweek":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() + 1)
        break
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleEngagementClick = (engagement: Engagement) => {
    if (onEngagementClick) {
      onEngagementClick(engagement)
    } else {
      setSelectedEngagement(engagement)
      setIsModalOpen(true)
    }
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

  const handleCreateEngagement = (date?: string, time?: string) => {
    if (isMultiSelectMode) {
      const dateKey = date || new Date().toISOString().split('T')[0]
      setSelectedDates(prev => 
        prev.includes(dateKey) 
          ? prev.filter(d => d !== dateKey)
          : [...prev, dateKey]
      )
    } else {
      if (onCreateEngagement) {
        onCreateEngagement(date, time)
      } else {
        openDrawer("create")
      }
    }
  }

  const handleMultiSelectToggle = () => {
    setIsMultiSelectMode(!isMultiSelectMode)
    if (isMultiSelectMode) {
      setSelectedDates([])
    }
  }

  const handleCreateMultipleEngagements = () => {
    if (selectedDates.length > 0) {
      // Create engagements for all selected dates
      selectedDates.forEach(date => {
        if (onCreateEngagement) {
          onCreateEngagement(date)
        } else {
          openDrawer("create")
        }
      })
      setSelectedDates([])
      setIsMultiSelectMode(false)
    }
  }

  const formatDateHeader = () => {
    switch (currentView) {
      case "month":
        return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      case "week":
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      case "workweek":
        const workWeekStart = new Date(currentDate)
        const dayOfWeek = currentDate.getDay()
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        workWeekStart.setDate(currentDate.getDate() + daysToMonday)
        const workWeekEnd = new Date(workWeekStart)
        workWeekEnd.setDate(workWeekStart.getDate() + 4)
        return `${workWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${workWeekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      case "day":
        return currentDate.toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })
      case "year":
        return currentDate.getFullYear().toString()
      case "list":
        return "Upcoming Engagements"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-8 px-3"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="ml-4 text-lg font-semibold">
              {formatDateHeader()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search engagements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm border rounded-md w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              size="sm"
              onClick={() => handleCreateEngagement()}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
            <Button
              variant={isMultiSelectMode ? "default" : "outline"}
              size="sm"
              onClick={handleMultiSelectToggle}
              className="h-8"
            >
              {isMultiSelectMode ? (
                <CheckSquare className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              Multi-Select
            </Button>
            {isMultiSelectMode && selectedDates.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCreateMultipleEngagements}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create {selectedDates.length} ({selectedDates.length})
              </Button>
            )}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Keyboard Shortcuts</h4>
                  <div className="text-sm space-y-1">
                    <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">←</kbd> Previous period</div>
                    <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">→</kbd> Next period</div>
                    <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+T</kbd> Go to today</div>
                    <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+N</kbd> Create engagement</div>
                    <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd> Toggle filters</div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mt-4">
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as CalendarViewType)}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="workweek">Work Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Filters */}
      {showFilters && (
        <CalendarFilters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      {/* Calendar Content */}
      <Card className="p-4">
        {currentView === "month" && (
          <MonthView
            currentDate={currentDate}
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
            isMultiSelectMode={isMultiSelectMode}
            selectedDates={selectedDates}
          />
        )}
        {currentView === "week" && (
          <WeekView
            currentDate={currentDate}
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
            isMultiSelectMode={isMultiSelectMode}
            selectedDates={selectedDates}
          />
        )}
        {currentView === "workweek" && (
          <WorkWeekView
            currentDate={currentDate}
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
            isMultiSelectMode={isMultiSelectMode}
            selectedDates={selectedDates}
          />
        )}
        {currentView === "day" && (
          <DayView
            currentDate={currentDate}
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
          />
        )}
        {currentView === "year" && (
          <YearView
            currentDate={currentDate}
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
          />
        )}
        {currentView === "list" && (
          <ListView
            engagements={filteredEngagements}
            onEngagementClick={handleEngagementClick}
            onCreateEngagement={handleCreateEngagement}
          />
        )}
      </Card>

      {/* Event Modal */}
      <CalendarEventModal
        engagement={selectedEngagement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEngagement}
        onDelete={handleDeleteEngagement}
        onSend={handleSendEngagement}
      />
    </div>
  )
}
