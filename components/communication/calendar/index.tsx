export { CalendarView } from "./calendar-view"
export { FullCalendarView } from "./fullcalendar-view"
export { MonthView } from "./month-view"
export { WeekView } from "./week-view"
export { WorkWeekView } from "./work-week-view"
export { DayView } from "./day-view"
export { YearView } from "./year-view"
export { ListView } from "./list-view"
export { CalendarFilters } from "./calendar-filters"
export { CalendarEventModal } from "./calendar-event-modal"

export default function CalendarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p className="text-muted-foreground">View scheduled events and important dates</p>
    </div>
  )
}
