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
import { CheckCircle, XCircle, HelpCircle, Users, Calendar, Clock, Download, Settings, AlertTriangle } from "lucide-react"
import { useEngagementStore } from "@/stores/engagement-store"

interface RSVPComponentProps {
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

export function RSVPComponent({
  engagementId,
  messageType,
  isEditing,
  currentUser,
  isAdmin = false,
  engagementData,
  onUpdateEngagement,
}: RSVPComponentProps) {
  const { updateRSVP, getRSVPStats, exportRSVPList, engagements } = useEngagementStore()
  const engagement = engagements.find((e) => e.id === engagementId) || engagementData
  
  const [selectedStatus, setSelectedStatus] = useState<"attending" | "not-attending" | "maybe" | null>(null)
  const [notes, setNotes] = useState("")
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  
  // Admin configuration state
  const [rsvpEnabled, setRsvpEnabled] = useState(engagement?.rsvpEnabled ?? true)
  const [rsvpCapacity, setRsvpCapacity] = useState(engagement?.rsvpCapacity?.toString() || "100")
  const [rsvpDeadline, setRsvpDeadline] = useState(engagement?.rsvpDeadline || "")
  const [rsvpDeadlineEnabled, setRsvpDeadlineEnabled] = useState(engagement?.rsvpDeadlineEnabled ?? false)

  if (!engagement || (messageType !== "Event" && messageType !== "Meeting")) {
    return null
  }

  // For new engagements, use default RSVP enabled state
  const isRSVPEnabled = engagement.rsvpEnabled !== undefined ? engagement.rsvpEnabled : true

  // Handler to update engagement configuration
  const handleConfigurationChange = (updates: any) => {
    if (onUpdateEngagement) {
      onUpdateEngagement(updates)
    }
  }

  // Determine if we should show admin configuration or user interface
  const showAdminConfig = isEditing && (engagementId === "new-engagement" || !engagementId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attending":
        return "text-green-600 bg-green-50 border-green-200"
      case "not-attending":
        return "text-red-600 bg-red-50 border-red-200"
      case "maybe":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attending":
        return <CheckCircle className="h-4 w-4" />
      case "not-attending":
        return <XCircle className="h-4 w-4" />
      case "maybe":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const currentUserResponse = engagement.rsvpResponses?.find((r) => r.userId === currentUser.id)
  const stats = getRSVPStats(engagement.id)
  
  // Check if deadline has passed based on toggle and deadline settings
  let isDeadlinePassed = false
  if (engagement.rsvpDeadlineEnabled && engagement.rsvpDeadline) {
    // If specific deadline is enabled and set, check if it has passed
    isDeadlinePassed = new Date() > new Date(engagement.rsvpDeadline)
  } else if (!engagement.rsvpDeadlineEnabled && engagement.closeDate) {
    // If no specific deadline but close date is set, use close date as deadline
    const closeDateTime = new Date(`${engagement.closeDate}T${engagement.closeTime || "23:59"}`)
    isDeadlinePassed = new Date() > closeDateTime
  }
  // If no deadline is set and no close date, deadline is not passed (RSVP remains open)
  
  const isCapacityReached = engagement.rsvpCapacity ? stats.attending >= engagement.rsvpCapacity : false

  const handleRSVPSubmit = () => {
    if (!selectedStatus) return

    updateRSVP(engagement.id, currentUser.id, {
      userName: currentUser.name,
      userEmail: currentUser.email,
      status: selectedStatus,
      respondedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    })

    setShowResponseDialog(false)
    setSelectedStatus(null)
    setNotes("")
  }

  const handleExportRSVP = () => {
    const responses = exportRSVPList(engagement.id)
    const csvContent = [
      ["Name", "Email", "Status", "Response Date", "Notes"],
      ...responses.map((r) => [
        r.userName,
        r.userEmail,
        r.status,
        new Date(r.respondedAt).toLocaleDateString(),
        r.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${engagement.title}-rsvp-responses.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Admin Configuration View (for creating/editing engagements)
  if (showAdminConfig) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Settings className="h-5 w-5" />
            RSVP Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable RSVP */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable RSVP</Label>
              <p className="text-xs text-gray-500">Allow attendees to respond to this {messageType.toLowerCase()}</p>
            </div>
            <Switch
              checked={rsvpEnabled}
              onCheckedChange={(checked) => {
                setRsvpEnabled(checked)
                handleConfigurationChange({ rsvpEnabled: checked })
              }}
            />
          </div>

          {rsvpEnabled && (
            <>
              <Separator />
              
              {/* RSVP Capacity */}
              <div className="space-y-2">
                <Label htmlFor="rsvp-capacity" className="text-sm font-medium">
                  Maximum Capacity
                </Label>
                <p className="text-xs text-gray-500">Maximum number of attendees (leave empty for unlimited)</p>
                <Input
                  id="rsvp-capacity"
                  type="number"
                  min="1"
                  value={rsvpCapacity}
                  onChange={(e) => {
                    setRsvpCapacity(e.target.value)
                    handleConfigurationChange({ 
                      rsvpCapacity: e.target.value ? parseInt(e.target.value) : undefined 
                    })
                  }}
                  placeholder="e.g., 50"
                  className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* RSVP Deadline Toggle and Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">RSVP Deadline</Label>
                    <p className="text-xs text-gray-500">Set a specific deadline for RSVP responses</p>
                  </div>
                  <Switch
                    checked={rsvpDeadlineEnabled}
                    onCheckedChange={(checked) => {
                      setRsvpDeadlineEnabled(checked)
                      handleConfigurationChange({ rsvpDeadlineEnabled: checked })
                    }}
                  />
                </div>
                
                {rsvpDeadlineEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="rsvp-deadline" className="text-sm font-medium">
                      Deadline Date & Time *
                    </Label>
                    <Input
                      id="rsvp-deadline"
                      type="datetime-local"
                      value={rsvpDeadline}
                      onChange={(e) => {
                        setRsvpDeadline(e.target.value)
                        handleConfigurationChange({ rsvpDeadline: e.target.value })
                      }}
                      min={new Date().toISOString().slice(0, 16)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      required={rsvpDeadlineEnabled}
                    />
                    <p className="text-xs text-gray-500">
                      Attendees must respond by this deadline
                    </p>
                  </div>
                )}
                
                {!rsvpDeadlineEnabled && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">Default Deadline:</p>
                        <p>• Will use the engagement close date + time</p>
                        <p>• If no close date is set, RSVP remains open indefinitely</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    {messageType === "Event" ? <Calendar className="h-4 w-4 text-red-600" /> : <Users className="h-4 w-4 text-red-600" />}
                    <span className="font-medium text-red-800">RSVP Required</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {rsvpCapacity && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Capacity: {rsvpCapacity}</span>
                      </div>
                    )}
                    {rsvpDeadlineEnabled && rsvpDeadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Deadline: {new Date(rsvpDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {rsvpDeadlineEnabled && !rsvpDeadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Deadline: Not set</span>
                      </div>
                    )}
                    {!rsvpDeadlineEnabled && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Default deadline</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Attending
                    </Button>
                    <Button size="sm" variant="outline">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Maybe
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Attending
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="text-sm font-semibold text-green-600">0</div>
                      <div className="text-xs text-green-600">Attending</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="text-sm font-semibold text-red-600">0</div>
                      <div className="text-xs text-red-600">Not Attending</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="text-sm font-semibold text-yellow-600">0</div>
                      <div className="text-xs text-yellow-600">Maybe</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="text-sm font-semibold text-gray-600">0</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Configuration Summary</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• RSVP is {rsvpEnabled ? "enabled" : "disabled"}</li>
                  {rsvpEnabled && rsvpCapacity && <li>• Maximum capacity: {rsvpCapacity} attendees</li>}
                  {rsvpEnabled && rsvpDeadlineEnabled && rsvpDeadline && <li>• Specific deadline: {new Date(rsvpDeadline).toLocaleDateString()}</li>}
                  {rsvpEnabled && rsvpDeadlineEnabled && !rsvpDeadline && <li>• Specific deadline: Not set</li>}
                  {rsvpEnabled && !rsvpDeadlineEnabled && <li>• Default deadline (engagement close date)</li>}
                  {rsvpEnabled && !rsvpCapacity && <li>• No capacity limit</li>}
                </ul>
              </div>
            </>
          )}

          {!rsvpEnabled && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">RSVP is disabled for this {messageType.toLowerCase()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // User Interface View (for viewing/responding to engagements)
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          {messageType === "Event" ? <Calendar className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          RSVP Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* RSVP Deadline & Capacity Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {engagement.rsvpDeadline && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Deadline: {new Date(engagement.rsvpDeadline).toLocaleDateString()}</span>
            </div>
          )}
          {engagement.rsvpCapacity && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                Capacity: {stats.attending}/{engagement.rsvpCapacity}
              </span>
            </div>
          )}
        </div>

        {/* Current User Response Status */}
        {currentUserResponse ? (
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(currentUserResponse.status)}>
                  {getStatusIcon(currentUserResponse.status)}
                  <span className="ml-1 capitalize">{currentUserResponse.status.replace("-", " ")}</span>
                </Badge>
                <span className="text-sm text-gray-500">
                  Responded on {new Date(currentUserResponse.respondedAt).toLocaleDateString()}
                </span>
              </div>
              {!isDeadlinePassed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStatus(currentUserResponse.status)
                    setNotes(currentUserResponse.notes || "")
                    setShowResponseDialog(true)
                  }}
                >
                  Update Response
                </Button>
              )}
            </div>
            {currentUserResponse.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">"{currentUserResponse.notes}"</p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            {isDeadlinePassed ? (
              <p className="text-red-600 font-medium">RSVP deadline has passed</p>
            ) : isCapacityReached ? (
              <p className="text-orange-600 font-medium">Event is at full capacity</p>
            ) : (
              <Button onClick={() => setShowResponseDialog(true)} className="bg-red-500 hover:bg-red-600">
                Respond to RSVP
              </Button>
            )}
          </div>
        )}

        {/* RSVP Statistics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-semibold text-green-600">{stats.attending}</div>
            <div className="text-xs text-green-600">Attending</div>
          </div>
          <div className="p-2 bg-red-50 rounded border border-red-200">
            <div className="text-lg font-semibold text-red-600">{stats.notAttending}</div>
            <div className="text-xs text-red-600">Not Attending</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-lg font-semibold text-yellow-600">{stats.maybe}</div>
            <div className="text-xs text-yellow-600">Maybe</div>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <div className="text-lg font-semibold text-gray-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdminView(!showAdminView)}>
                <Users className="h-4 w-4 mr-2" />
                {showAdminView ? "Hide" : "View"} Responses
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportRSVP}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {showAdminView && engagement.rsvpResponses && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {engagement.rsvpResponses.map((response) => (
                  <div key={response.userId} className="p-2 bg-white rounded border text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{response.userName}</span>
                        <span className="text-gray-500 ml-2">{response.userEmail}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(response.status)}>
                        {getStatusIcon(response.status)}
                        <span className="ml-1 capitalize">{response.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                    {response.notes && <p className="text-gray-600 mt-1 italic">"{response.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* RSVP Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to RSVP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Your Response</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={selectedStatus === "attending" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("attending")}
                  className={selectedStatus === "attending" ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-50"}
                  disabled={isCapacityReached && selectedStatus !== "attending"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Attending
                </Button>
                <Button
                  variant={selectedStatus === "maybe" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("maybe")}
                  className={selectedStatus === "maybe" ? "bg-yellow-500 hover:bg-yellow-600" : "hover:bg-yellow-50"}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Maybe
                </Button>
                <Button
                  variant={selectedStatus === "not-attending" ? "default" : "outline"}
                  onClick={() => setSelectedStatus("not-attending")}
                  className={selectedStatus === "not-attending" ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-50"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Not Attending
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional comments or requirements..."
                rows={3}
                className="mt-2"
              />
            </div>

            {isCapacityReached && selectedStatus === "attending" && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm text-orange-700">
                  This event is at full capacity. You may be added to a waitlist.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRSVPSubmit} disabled={!selectedStatus} className="bg-red-500 hover:bg-red-600">
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
