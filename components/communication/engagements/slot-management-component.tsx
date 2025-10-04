"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Clock, Calendar, Users, CheckCircle, XCircle, AlertCircle, Download, Timer, Settings } from "lucide-react"
import { useEngagementStore, type SlotBooking } from "@/stores/engagement-store"
import { SlotExceptionManager } from "./slot-exception-manager"

interface SlotManagementComponentProps {
  engagementId: string
  messageType: "Event" | "Meeting"
  isEditing: boolean
  currentUser: {
    id: string
    name: string
    email: string
  }
  isAdmin?: boolean
  engagementData?: any
  onUpdateEngagement?: (updates: any) => void
}

export function SlotManagementComponent({
  engagementId,
  messageType,
  isEditing,
  currentUser,
  isAdmin = false,
  engagementData,
  onUpdateEngagement,
}: SlotManagementComponentProps) {
  const {
    bookSlot,
    cancelSlotBooking,
    getSlotStats,
    getAvailableSlots,
    exportSlotBookings,
    processWaitlist,
    engagements,
  } = useEngagementStore()

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [bookingNotes, setBookingNotes] = useState("")
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<SlotBooking | null>(null)

  const engagement = engagements.find((e) => e.id === engagementId) || engagementData

  // Admin configuration state
  const [slotEnabled, setSlotEnabled] = useState(engagement?.slotManagement?.enabled ?? true)
  const [totalSlots, setTotalSlots] = useState(engagement?.slotManagement?.totalSlots?.toString() || "10")
  const [slotDuration, setSlotDuration] = useState(engagement?.slotManagement?.slotDuration?.toString() || "30")
  const [startTime, setStartTime] = useState(engagement?.slotManagement?.startTime || "09:00")
  const [endTime, setEndTime] = useState(engagement?.slotManagement?.endTime || "17:00")
  const [bookingDeadline, setBookingDeadline] = useState(engagement?.slotManagement?.bookingDeadline || "")
  const [allowWaitlist, setAllowWaitlist] = useState(engagement?.slotManagement?.allowWaitlist ?? true)

  // Early return if engagement is not found or slot management is not enabled
  if (!engagement || messageType !== "Meeting") {
    return null
  }

  // Handler to update engagement configuration
  const handleConfigurationChange = (updates: any) => {
    if (onUpdateEngagement) {
      onUpdateEngagement(updates)
    }
  }

  // Determine if we should show admin configuration or user interface
  const showAdminConfig = isEditing && (engagementId === "new-engagement" || !engagementId)

  // For new engagements, use default slot management enabled state
  const isSlotManagementEnabled = engagement.slotManagement?.enabled !== undefined ? engagement.slotManagement.enabled : true
  
  if (!showAdminConfig && !isSlotManagementEnabled) {
    return null
  }

  const stats = getSlotStats(engagement.id)
  const availableSlots = getAvailableSlots(engagement.id)
  const userBooking = engagement.slotBookings?.find((b) => b.userId === currentUser.id && b.status !== "cancelled")
  const isDeadlinePassed = engagement.slotManagement.bookingDeadline
    ? new Date() > new Date(engagement.slotManagement.bookingDeadline)
    : false

  const handleSlotBooking = () => {
    if (!selectedSlot) return

    const selectedSlotInfo = availableSlots.find((s) => s.slotNumber === selectedSlot)
    if (!selectedSlotInfo) return

    const result = bookSlot(engagement.id, currentUser.id, {
      userName: currentUser.name,
      userEmail: currentUser.email,
      slotNumber: selectedSlot,
      startTime: selectedSlotInfo.startTime,
      endTime: selectedSlotInfo.endTime,
      notes: bookingNotes.trim() || undefined,
    })

    if (result.success) {
      setShowBookingDialog(false)
      setSelectedSlot(null)
      setBookingNotes("")
    }
  }

  const handleCancelBooking = () => {
    if (!bookingToCancel) return

    cancelSlotBooking(engagement.id, bookingToCancel.id)
    setShowCancelDialog(false)
    setBookingToCancel(null)
  }

  const handleExportBookings = () => {
    const bookings = exportSlotBookings(engagement.id)
    const csvContent = [
      ["Name", "Email", "Slot Number", "Start Time", "End Time", "Status", "Booked At", "Waitlist Position", "Notes"],
      ...bookings.map((b) => [
        b.userName,
        b.userEmail,
        b.slotNumber.toString(),
        b.startTime,
        b.endTime,
        b.status,
        new Date(b.bookedAt).toLocaleDateString(),
        b.waitlistPosition?.toString() || "",
        b.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${engagement.title}-slot-bookings.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50 border-green-200"
      case "waitlisted":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "waitlisted":
        return <AlertCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Admin Configuration View (for creating/editing engagements)
  if (showAdminConfig) {
    const calculateTotalSlots = () => {
      if (!startTime || !endTime || !slotDuration) return 0
      
      const start = new Date(`2000-01-01T${startTime}:00`)
      const end = new Date(`2000-01-01T${endTime}:00`)
      const durationMs = parseInt(slotDuration) * 60 * 1000
      const totalMs = end.getTime() - start.getTime()
      
      return Math.floor(totalMs / durationMs)
    }

    const calculatedSlots = calculateTotalSlots()

    return (
      <>
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Settings className="h-5 w-5" />
            Slot Management Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Slot Management */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Slot Management</Label>
              <p className="text-xs text-gray-500">Allow attendees to book time slots for this meeting</p>
            </div>
            <Switch
              checked={slotEnabled}
              onCheckedChange={(checked) => {
                setSlotEnabled(checked)
                handleConfigurationChange({ 
                  slotManagement: { 
                    ...engagement?.slotManagement,
                    enabled: checked 
                  }
                })
              }}
            />
          </div>

          {slotEnabled && (
            <>
              <Separator />
              
              {/* Time Configuration */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Time Configuration</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-sm font-medium">
                      Start Time *
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        handleConfigurationChange({
                          slotManagement: {
                            ...engagement?.slotManagement,
                            enabled: slotEnabled,
                            startTime: e.target.value,
                            totalSlots: calculateTotalSlots()
                          }
                        })
                      }}
                      className="hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-sm font-medium">
                      End Time *
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value)
                        handleConfigurationChange({
                          slotManagement: {
                            ...engagement?.slotManagement,
                            enabled: slotEnabled,
                            endTime: e.target.value,
                            totalSlots: calculateTotalSlots()
                          }
                        })
                      }}
                      className="hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot-duration" className="text-sm font-medium">
                    Slot Duration (minutes) *
                  </Label>
                  <Input
                    id="slot-duration"
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={slotDuration}
                    onChange={(e) => {
                      setSlotDuration(e.target.value)
                      handleConfigurationChange({
                        slotManagement: {
                          ...engagement?.slotManagement,
                          enabled: slotEnabled,
                          slotDuration: parseInt(e.target.value) || 30,
                          totalSlots: calculateTotalSlots()
                        }
                      })
                    }}
                    placeholder="30"
                    className="hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500">Recommended: 15, 30, 45, or 60 minutes</p>
                </div>

                {calculatedSlots > 0 && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-800">
                        Calculated Slots: {calculatedSlots}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 mt-1">
                      Based on {startTime} - {endTime} with {slotDuration} minute slots
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Booking Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Booking Settings</Label>

                <div className="space-y-2">
                  <Label htmlFor="booking-deadline" className="text-sm font-medium">
                    Booking Deadline (Optional)
                  </Label>
                  <p className="text-xs text-gray-500">Last date attendees can book slots</p>
                  <Input
                    id="booking-deadline"
                    type="date"
                    value={bookingDeadline}
                    onChange={(e) => {
                      setBookingDeadline(e.target.value)
                      handleConfigurationChange({
                        slotManagement: {
                          ...engagement?.slotManagement,
                          enabled: slotEnabled,
                          bookingDeadline: e.target.value
                        }
                      })
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Allow Waitlist</Label>
                    <p className="text-xs text-gray-500">Let attendees join waitlist when slots are full</p>
                  </div>
                  <Switch
                    checked={allowWaitlist}
                    onCheckedChange={(checked) => {
                      setAllowWaitlist(checked)
                      handleConfigurationChange({
                        slotManagement: {
                          ...engagement?.slotManagement,
                          enabled: slotEnabled,
                          allowWaitlist: checked
                        }
                      })
                    }}
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="p-4 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-800">Meeting Slot Booking</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{startTime} - {endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      <span>{slotDuration} min slots</span>
                    </div>
                    {bookingDeadline && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Deadline: {new Date(bookingDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
                      <div className="text-sm font-semibold text-indigo-600">{calculatedSlots}</div>
                      <div className="text-xs text-indigo-600">Total Slots</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="text-sm font-semibold text-green-600">0</div>
                      <div className="text-xs text-green-600">Booked</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm font-semibold text-blue-600">{calculatedSlots}</div>
                      <div className="text-xs text-blue-600">Available</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="text-sm font-semibold text-yellow-600">0</div>
                      <div className="text-xs text-yellow-600">Waitlisted</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: Math.min(calculatedSlots, 6) }, (_, i) => {
                      const slotStart = new Date(`2000-01-01T${startTime}:00`)
                      slotStart.setMinutes(slotStart.getMinutes() + i * parseInt(slotDuration))
                      const slotEnd = new Date(slotStart.getTime() + parseInt(slotDuration) * 60 * 1000)
                      
                      return (
                        <div key={i} className="p-2 bg-gray-50 rounded border text-center text-xs">
                          <div className="font-medium">Slot {i + 1}</div>
                          <div className="text-gray-600">
                            {slotStart.toTimeString().slice(0, 5)} - {slotEnd.toTimeString().slice(0, 5)}
                          </div>
                        </div>
                      )
                    })}
                    {calculatedSlots > 6 && (
                      <div className="p-2 text-center text-xs text-gray-500 flex items-center justify-center">
                        +{calculatedSlots - 6} more
                      </div>
                    )}
                  </div>

                  {allowWaitlist && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Waitlist is enabled - attendees can join when slots are full
                    </p>
                  )}
                </div>
              </div>

              {/* Slot Exception Management */}
              <Separator />
              <div className="space-y-4">
                <Label className="text-sm font-medium">Slot Exceptions</Label>
                <p className="text-xs text-gray-500">
                  Configure special conditions for specific slots such as breaks, buffer times, or reserved slots
                </p>
                <SlotExceptionManager
                  engagementId={engagementId}
                  isEditing={isEditing}
                  currentUser={currentUser}
                  onUpdateEngagement={onUpdateEngagement}
                />
              </div>

              {/* Configuration Summary */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-indigo-800">Configuration Summary</span>
                </div>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Slot management is {slotEnabled ? "enabled" : "disabled"}</li>
                  {slotEnabled && <li>• {calculatedSlots} time slots available ({startTime} - {endTime})</li>}
                  {slotEnabled && <li>• Each slot is {slotDuration} minutes long</li>}
                  {slotEnabled && bookingDeadline && <li>• Booking deadline: {new Date(bookingDeadline).toLocaleDateString()}</li>}
                  {slotEnabled && !bookingDeadline && <li>• No booking deadline set</li>}
                  {slotEnabled && <li>• Waitlist is {allowWaitlist ? "enabled" : "disabled"}</li>}
                  {slotEnabled && engagement?.slotManagement?.slotExceptions && (
                    <li>• {engagement.slotManagement.slotExceptions.length} slot exceptions configured</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {!slotEnabled && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">Slot management is disabled for this meeting</p>
            </div>
          )}
        </CardContent>
      </Card>
      </>
    )
  }

  // User Interface View (for viewing/responding to engagements)
  return (
    <Card className="border-indigo-200 bg-indigo-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Timer className="h-5 w-5" />
          Meeting Slot Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meeting Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{engagement.scheduledDate ? new Date(engagement.scheduledDate).toLocaleDateString() : "TBD"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {engagement.slotManagement.startTime} - {engagement.slotManagement.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            <span>{engagement.slotManagement.slotDuration} min slots</span>
          </div>
          {engagement.slotManagement.bookingDeadline && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Deadline: {new Date(engagement.slotManagement.bookingDeadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Slot Statistics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
            <div className="text-lg font-semibold text-indigo-600">{stats.totalSlots}</div>
            <div className="text-xs text-indigo-600">Total Slots</div>
          </div>
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-semibold text-green-600">{stats.bookedSlots}</div>
            <div className="text-xs text-green-600">Booked</div>
          </div>
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-lg font-semibold text-blue-600">{stats.availableSlots}</div>
            <div className="text-xs text-blue-600">Available</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-lg font-semibold text-yellow-600">{stats.waitlistCount}</div>
            <div className="text-xs text-yellow-600">Waitlisted</div>
          </div>
        </div>

        {/* User's Current Booking */}
        {userBooking && (
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Your Booking</h4>
              <Badge variant="outline" className={getStatusColor(userBooking.status)}>
                {getStatusIcon(userBooking.status)}
                <span className="ml-1 capitalize">{userBooking.status}</span>
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Slot {userBooking.slotNumber}:</strong> {userBooking.startTime} - {userBooking.endTime}
              </p>
              <p>
                <strong>Booked:</strong> {new Date(userBooking.bookedAt).toLocaleDateString()}
              </p>
              {userBooking.waitlistPosition && (
                <p>
                  <strong>Waitlist Position:</strong> #{userBooking.waitlistPosition}
                </p>
              )}
              {userBooking.notes && (
                <p>
                  <strong>Notes:</strong> {userBooking.notes}
                </p>
              )}
            </div>
            {!isDeadlinePassed && userBooking.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBookingToCancel(userBooking)
                  setShowCancelDialog(true)
                }}
                className="mt-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Cancel Booking
              </Button>
            )}
          </div>
        )}

        {/* Available Slots Grid */}
        {!userBooking && !isDeadlinePassed && (
          <div className="space-y-3">
            <h4 className="font-medium text-indigo-800">Available Time Slots</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.slotNumber}
                  variant={slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  onClick={() => {
                    if (slot.available) {
                      setSelectedSlot(slot.slotNumber)
                      setShowBookingDialog(true)
                    }
                  }}
                  className={`p-3 h-auto flex flex-col items-center ${
                    slot.available ? "hover:bg-indigo-50 hover:border-indigo-300" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="font-medium">Slot {slot.slotNumber}</div>
                  <div className="text-xs">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  {!slot.available && slot.isBooked && <div className="text-xs text-red-500 mt-1">Booked</div>}
                  {!slot.available && slot.hasException && slot.exception && (
                    <div className="text-xs text-orange-500 mt-1" title={slot.exception.description}>
                      {slot.exception.title}
                    </div>
                  )}
                </Button>
              ))}
            </div>
            {engagement.slotManagement.allowWaitlist && (
              <p className="text-xs text-gray-500 text-center">
                Slots are full? You can still book and join the waitlist!
              </p>
            )}
          </div>
        )}

        {/* Deadline Passed Message */}
        {isDeadlinePassed && !userBooking && (
          <div className="text-center py-4">
            <p className="text-red-600 font-medium">Booking deadline has passed</p>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdminView(!showAdminView)}>
                <Users className="h-4 w-4 mr-2" />
                {showAdminView ? "Hide" : "Manage"} Bookings
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportBookings}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => processWaitlist(engagement.id)}>
                <Timer className="h-4 w-4 mr-2" />
                Process Waitlist
              </Button>
            </div>

            {showAdminView && engagement.slotBookings && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {engagement.slotBookings
                  .filter((b) => b.status !== "cancelled")
                  .sort(
                    (a, b) =>
                      a.slotNumber - b.slotNumber || new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime(),
                  )
                  .map((booking) => (
                    <div key={booking.id} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{booking.userName}</span>
                          <span className="text-gray-500 ml-2">{booking.userEmail}</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Slot {booking.slotNumber}:</strong> {booking.startTime} - {booking.endTime}
                        </p>
                        <p>
                          <strong>Booked:</strong> {new Date(booking.bookedAt).toLocaleDateString()}
                        </p>
                        {booking.waitlistPosition && (
                          <p>
                            <strong>Waitlist Position:</strong> #{booking.waitlistPosition}
                          </p>
                        )}
                        {booking.notes && (
                          <p>
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Slot Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Meeting Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSlot && (
              <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
                {(() => {
                  const slot = availableSlots.find((s) => s.slotNumber === selectedSlot)
                  return slot ? (
                    <div>
                      <h4 className="font-medium text-indigo-800 mb-2">Slot {slot.slotNumber}</h4>
                      <div className="text-sm text-indigo-700 space-y-1">
                        <p>
                          <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                        </p>
                        <p>
                          <strong>Duration:</strong> {engagement.slotManagement?.slotDuration} minutes
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {engagement.scheduledDate ? new Date(engagement.scheduledDate).toLocaleDateString() : "TBD"}
                        </p>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <div>
              <Label htmlFor="booking-notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="booking-notes"
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Any special requirements or notes for this meeting..."
                rows={3}
                className="mt-2"
              />
            </div>

            {selectedSlot &&
              !availableSlots.find((s) => s.slotNumber === selectedSlot)?.available &&
              engagement.slotManagement?.allowWaitlist && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-700">
                    This slot is currently booked. You will be added to the waitlist and notified if it becomes
                    available.
                  </p>
                </div>
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSlotBooking} disabled={!selectedSlot} className="bg-indigo-500 hover:bg-indigo-600">
              {selectedSlot && !availableSlots.find((s) => s.slotNumber === selectedSlot)?.available
                ? "Join Waitlist"
                : "Book Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel your booking for Slot {bookingToCancel?.slotNumber}?
              {bookingToCancel?.status === "confirmed" && " This will make the slot available for others."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
