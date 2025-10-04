"use client"

import { Engagement } from "@/stores/engagement-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone,
  FileText,
  Link as LinkIcon,
  Download,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEngagementStore } from "@/stores/engagement-store"

interface CalendarEventModalProps {
  engagement: Engagement | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (engagement: Engagement) => void
  onDelete?: (engagement: Engagement) => void
  onSend?: (engagement: Engagement) => void
}

export function CalendarEventModal({
  engagement,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSend
}: CalendarEventModalProps) {
  const { updateRSVP, getRSVPStats } = useEngagementStore()

  if (!engagement) return null

  // Format date and time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
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

  // Handle RSVP response
  const handleRSVPResponse = (status: "attending" | "not-attending" | "maybe") => {
    // In a real app, you'd get the current user ID
    const currentUserId = "current-user-id"
    const currentUserName = "Current User"
    const currentUserEmail = "user@example.com"

    updateRSVP(engagement.id, currentUserId, {
      userName: currentUserName,
      userEmail: currentUserEmail,
      status,
      respondedAt: new Date().toISOString()
    })
  }

  const rsvpStats = getRSVPStats(engagement.id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">
                {engagement.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getEngagementColor(engagement.messageType))}
                >
                  {engagement.messageType}
                </Badge>
                <Badge 
                  variant={engagement.status === "Scheduled" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {engagement.status}
                </Badge>
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
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(engagement)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onSend && engagement.status === "Draft" && (
                <Button size="sm" onClick={() => onSend(engagement)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(engagement)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {engagement.engagementDate && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Date:</strong> {formatDate(engagement.engagementDate)}
                  </span>
                </div>
              )}
              {engagement.engagementTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Time:</strong> {formatTime(engagement.engagementTime)}
                  </span>
                </div>
              )}
              {engagement.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Location:</strong> {engagement.location}
                  </span>
                </div>
              )}
              {engagement.totalRecipients > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Recipients:</strong> {engagement.totalRecipients}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Description</h3>
            <div className="space-y-2">
              <div>
                <strong>Subject:</strong> {engagement.subject}
              </div>
              <div className="text-sm text-muted-foreground">
                {engagement.content}
              </div>
            </div>
          </Card>

          {/* RSVP Section */}
          {engagement.rsvpEnabled && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">RSVP</h3>
              <div className="space-y-4">
                {/* RSVP Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {rsvpStats.attending}
                    </div>
                    <div className="text-sm text-muted-foreground">Attending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {rsvpStats.notAttending}
                    </div>
                    <div className="text-sm text-muted-foreground">Not Attending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {rsvpStats.maybe}
                    </div>
                    <div className="text-sm text-muted-foreground">Maybe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {rsvpStats.pending}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>

                {/* RSVP Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your Response:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRSVPResponse("attending")}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Attending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRSVPResponse("not-attending")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Not Attending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRSVPResponse("maybe")}
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Maybe
                    </Button>
                  </div>
                </div>

                {engagement.rsvpCapacity && (
                  <div className="text-sm text-muted-foreground">
                    Capacity: {rsvpStats.attending} / {engagement.rsvpCapacity}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Attachments */}
          {engagement.attachments && engagement.attachments.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Attachments</h3>
              <div className="space-y-2">
                {engagement.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {attachment.type}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Links */}
          {engagement.links && engagement.links.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Links</h3>
              <div className="space-y-2">
                {engagement.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {link.label}
                    </a>
                    {link.description && (
                      <span className="text-sm text-muted-foreground">
                        - {link.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Delivery Channels */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Delivery Information</h3>
            <div className="space-y-2">
              <div>
                <strong>Channels:</strong> {engagement.deliveryChannels.join(", ")}
              </div>
              <div>
                <strong>Target Audience:</strong> {engagement.targetAudience}
              </div>
              {engagement.deliveredCount > 0 && (
                <div>
                  <strong>Delivered:</strong> {engagement.deliveredCount} / {engagement.totalRecipients}
                </div>
              )}
              {engagement.readCount > 0 && (
                <div>
                  <strong>Read:</strong> {engagement.readCount} / {engagement.deliveredCount}
                </div>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
