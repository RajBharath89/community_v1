"use client"

import { useState, useEffect } from "react"
import { useVolunteerStore } from "@/stores/volunteer-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  X, 
  Save, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  FileText, 
  Star,
  Users,
  AlertCircle,
  Heart
} from "lucide-react"
import { getStatusBadgeColor } from "@/utils/badgeColors"

export function VolunteerDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedApplication,
    closeDrawer,
    approveApplication,
    rejectApplication,
    updateApplication,
  } = useVolunteerStore()

  const [adminNotes, setAdminNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedApplication?.adminNotes) {
      setAdminNotes(selectedApplication.adminNotes)
    } else {
      setAdminNotes("")
    }
  }, [selectedApplication])

  if (!selectedApplication) return null

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      approveApplication(selectedApplication.id, adminNotes)
      closeDrawer()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    setIsSubmitting(true)
    try {
      rejectApplication(selectedApplication.id, adminNotes)
      closeDrawer()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveNotes = () => {
    updateApplication(selectedApplication.id, { adminNotes })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">
              Volunteer Application Details
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDrawer}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Application Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Application Status</h3>
              <p className="text-sm text-gray-500">Current status of this volunteer application</p>
            </div>
            <Badge className={getStatusBadgeColor(selectedApplication.status)}>
              {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
            </Badge>
          </div>

          {/* Volunteer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Volunteer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedApplication.userName}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{selectedApplication.userEmail}</p>
                </div>
              </div>
              
              {selectedApplication.userPhone && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <div className="p-3 bg-gray-50 rounded-md flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p>{selectedApplication.userPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Engagement Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Engagement Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Event/Meeting</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedApplication.engagementTitle}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Role Applied For</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedApplication.roleTitle}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedApplication.roleDescription}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Event Date</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{formatDate(selectedApplication.engagementDate)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Event Time</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{selectedApplication.engagementTime}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Application Details
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Applied Date</Label>
                <div className="p-3 bg-gray-50 rounded-md flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{formatDateTime(selectedApplication.requestedAt)}</p>
                </div>
              </div>

              {selectedApplication.experience && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Previous Experience</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedApplication.experience}</p>
                  </div>
                </div>
              )}

              {selectedApplication.motivation && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Motivation</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedApplication.motivation}</p>
                  </div>
                </div>
              )}

              {selectedApplication.availability && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Availability</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedApplication.availability}</p>
                  </div>
                </div>
              )}

              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplication.languages && selectedApplication.languages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedApplication.transportation && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Transportation</Label>
                  <div className="p-3 bg-gray-50 rounded-md flex items-center">
                    <Car className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="capitalize">{selectedApplication.transportation}</p>
                  </div>
                </div>
              )}

              {selectedApplication.tshirtSize && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">T-Shirt Size</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p>{selectedApplication.tshirtSize}</p>
                  </div>
                </div>
              )}

              {selectedApplication.previousVolunteering !== undefined && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Previous Volunteering</Label>
                  <div className="p-3 bg-gray-50 rounded-md flex items-center">
                    {selectedApplication.previousVolunteering ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <p className="text-green-700">Yes</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-gray-500">No</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedApplication.emergencyContact && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Emergency Contact</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedApplication.emergencyContact.name}</p>
                  <p className="text-sm text-gray-500">{selectedApplication.emergencyContact.phone}</p>
                  <p className="text-sm text-gray-500">{selectedApplication.emergencyContact.relationship}</p>
                </div>
              </div>
            )}

            {selectedApplication.medicalConditions && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Medical Conditions</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{selectedApplication.medicalConditions}</p>
                </div>
              </div>
            )}

            {selectedApplication.dietaryRestrictions && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Dietary Restrictions</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{selectedApplication.dietaryRestrictions}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* References */}
          {selectedApplication.references && selectedApplication.references.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Star className="h-5 w-5 mr-2" />
                References
              </h3>
              
              <div className="space-y-3">
                {selectedApplication.references.map((reference, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{reference.name}</p>
                    <p className="text-sm text-gray-500">{reference.phone}</p>
                    <p className="text-sm text-gray-500">{reference.relationship}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Admin Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Admin Notes
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="adminNotes" className="text-sm font-medium text-gray-700">
                Notes for this application
              </Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this volunteer application..."
                className="min-h-[100px]"
              />
              <Button
                onClick={handleSaveNotes}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>

          {/* Review History */}
          {selectedApplication.reviewedAt && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review History</h3>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">
                  <strong>Reviewed by:</strong> {selectedApplication.reviewedBy}
                </p>
                <p className="text-sm">
                  <strong>Reviewed on:</strong> {formatDateTime(selectedApplication.reviewedAt)}
                </p>
                {selectedApplication.adminNotes && (
                  <p className="text-sm mt-2">
                    <strong>Notes:</strong> {selectedApplication.adminNotes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedApplication.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Application
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
