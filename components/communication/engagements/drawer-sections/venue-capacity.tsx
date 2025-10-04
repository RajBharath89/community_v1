"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Building, 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  Settings
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState } from "react"

interface VenueCapacityProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const venueTypes = [
  { value: "temple-hall", label: "Temple Main Hall", description: "Main prayer and gathering hall" },
  { value: "community-center", label: "Community Center", description: "Multi-purpose community space" },
  { value: "outdoor-grounds", label: "Outdoor Grounds", description: "Open air venue" },
  { value: "classroom", label: "Classroom", description: "Small group meeting space" },
  { value: "kitchen", label: "Kitchen Area", description: "Food preparation and dining area" },
  { value: "custom", label: "Custom Venue", description: "Specify custom venue details" },
]

const capacityWarnings = [
  { threshold: 80, color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  { threshold: 90, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { threshold: 100, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
]

export function VenueCapacity({ formData, setFormData, isEditing, validationErrors }: VenueCapacityProps) {
  const [showCustomVenue, setShowCustomVenue] = useState(false)

  const handleCapacityToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      venueCapacity: {
        ...formData.venueCapacity,
        enabled,
        // Reset to defaults when enabling
        ...(enabled && {
          venueType: "temple-hall",
          maxCapacity: 100,
          currentRegistrations: 0,
          waitlistEnabled: false,
          waitlistCapacity: 20,
          overflowVenue: "",
          capacityWarnings: true,
          registrationDeadline: "",
          venueNotes: "",
        })
      }
    })
  }

  const updateVenueField = (field: string, value: any) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      venueCapacity: {
        ...formData.venueCapacity,
        [field]: value
      }
    })
  }

  const getCapacityStats = () => {
    const maxCapacity = formData.venueCapacity?.maxCapacity || 0
    const currentRegistrations = formData.venueCapacity?.currentRegistrations || 0
    const waitlistCount = formData.venueCapacity?.waitlistCount || 0
    const availableSpots = maxCapacity - currentRegistrations
    const capacityPercentage = maxCapacity > 0 ? (currentRegistrations / maxCapacity) * 100 : 0
    const isFull = currentRegistrations >= maxCapacity
    const isNearCapacity = capacityPercentage >= 80

    return {
      maxCapacity,
      currentRegistrations,
      waitlistCount,
      availableSpots,
      capacityPercentage,
      isFull,
      isNearCapacity
    }
  }

  const getCapacityWarning = () => {
    const stats = getCapacityStats()
    if (stats.capacityPercentage >= 100) {
      return { level: "full", message: "Venue is at full capacity", color: "text-red-600" }
    } else if (stats.capacityPercentage >= 90) {
      return { level: "critical", message: "Venue is nearly full", color: "text-orange-600" }
    } else if (stats.capacityPercentage >= 80) {
      return { level: "warning", message: "Venue is getting full", color: "text-yellow-600" }
    }
    return null
  }

  const stats = getCapacityStats()
  const warning = getCapacityWarning()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Venue Capacity Management</h3>
      </div>

      {/* Enable/Disable Capacity Management */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Enable Capacity Management</CardTitle>
            <Switch
              checked={formData.venueCapacity?.enabled || false}
              onCheckedChange={handleCapacityToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Track venue capacity and manage registrations to prevent overcrowding.
          </p>
        </CardContent>
      </Card>

      {formData.venueCapacity?.enabled && (
        <>
          {/* Venue Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Venue Type *</Label>
            <Select
              value={formData.venueCapacity?.venueType || "temple-hall"}
              onValueChange={(value) => {
                updateVenueField("venueType", value)
                if (value === "custom") {
                  setShowCustomVenue(true)
                } else {
                  setShowCustomVenue(false)
                }
              }}
              disabled={!isEditing}
            >
              <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent>
                {venueTypes.map((venue) => (
                  <SelectItem key={venue.value} value={venue.value}>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{venue.label}</div>
                        <div className="text-xs text-gray-500">{venue.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Venue Details */}
          {showCustomVenue && (
            <div className="space-y-3">
              <Label htmlFor="custom-venue-name" className="text-sm font-medium">
                Custom Venue Name *
              </Label>
              <Input
                id="custom-venue-name"
                placeholder="Enter custom venue name"
                value={formData.venueCapacity?.customVenueName || ""}
                onChange={(e) => updateVenueField("customVenueName", e.target.value)}
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              />
              
              <Label htmlFor="custom-venue-address" className="text-sm font-medium">
                Venue Address
              </Label>
              <Textarea
                id="custom-venue-address"
                placeholder="Enter venue address"
                value={formData.venueCapacity?.customVenueAddress || ""}
                onChange={(e) => updateVenueField("customVenueAddress", e.target.value)}
                rows={2}
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}

          {/* Capacity Settings */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-800">Capacity Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-capacity" className="text-sm font-medium">
                    Maximum Capacity *
                  </Label>
                  <Input
                    id="max-capacity"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={formData.venueCapacity?.maxCapacity || ""}
                    onChange={(e) => updateVenueField("maxCapacity", parseInt(e.target.value) || 0)}
                    className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-registrations" className="text-sm font-medium">
                    Current Registrations
                  </Label>
                  <Input
                    id="current-registrations"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.venueCapacity?.currentRegistrations || ""}
                    onChange={(e) => updateVenueField("currentRegistrations", parseInt(e.target.value) || 0)}
                    className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Capacity Status</Label>
                  <Badge 
                    variant="outline" 
                    className={warning?.color || "text-green-600 border-green-300"}
                  >
                    {stats.currentRegistrations}/{stats.maxCapacity}
                  </Badge>
                </div>
                <Progress value={stats.capacityPercentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Available: {stats.availableSpots} spots</span>
                  <span>{stats.capacityPercentage.toFixed(1)}% full</span>
                </div>
              </div>

              {/* Capacity Warning */}
              {warning && (
                <div className={`p-3 rounded-lg border ${warning.color.replace('text-', 'bg-').replace('-600', '-50')} ${warning.color.replace('text-', 'border-').replace('-600', '-200')}`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`h-4 w-4 ${warning.color}`} />
                    <span className={`text-sm font-medium ${warning.color}`}>{warning.message}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waitlist Management */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-green-800">Waitlist Management</CardTitle>
                <Switch
                  checked={formData.venueCapacity?.waitlistEnabled || false}
                  onCheckedChange={(checked) => updateVenueField("waitlistEnabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.venueCapacity?.waitlistEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-capacity" className="text-sm font-medium">
                      Waitlist Capacity
                    </Label>
                    <Input
                      id="waitlist-capacity"
                      type="number"
                      min="1"
                      placeholder="20"
                      value={formData.venueCapacity?.waitlistCapacity || ""}
                      onChange={(e) => updateVenueField("waitlistCapacity", parseInt(e.target.value) || 0)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="overflow-venue" className="text-sm font-medium">
                      Overflow Venue (Optional)
                    </Label>
                    <Input
                      id="overflow-venue"
                      placeholder="Alternative venue for overflow"
                      value={formData.venueCapacity?.overflowVenue || ""}
                      onChange={(e) => updateVenueField("overflowVenue", e.target.value)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Registration Deadline */}
          <div className="space-y-3">
            <Label htmlFor="registration-deadline" className="text-sm font-medium">
              Registration Deadline
            </Label>
            <Input
              id="registration-deadline"
              type="datetime-local"
              value={formData.venueCapacity?.registrationDeadline || ""}
              onChange={(e) => updateVenueField("registrationDeadline", e.target.value)}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500">
              Set a deadline for venue registrations
            </p>
          </div>

          {/* Venue Notes */}
          <div className="space-y-3">
            <Label htmlFor="venue-notes" className="text-sm font-medium">
              Venue Notes
            </Label>
            <Textarea
              id="venue-notes"
              placeholder="Additional venue information, setup requirements, etc."
              value={formData.venueCapacity?.venueNotes || ""}
              onChange={(e) => updateVenueField("venueNotes", e.target.value)}
              rows={3}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={!isEditing}
            />
          </div>

          {/* Capacity Statistics (View Mode) */}
          {!isEditing && (
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-purple-800">Capacity Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.currentRegistrations}</div>
                    <div className="text-sm text-purple-700">Registered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.availableSpots}</div>
                    <div className="text-sm text-green-700">Available</div>
                  </div>
                </div>
                {formData.venueCapacity?.waitlistEnabled && stats.waitlistCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{stats.waitlistCount}</div>
                      <div className="text-sm text-orange-700">On Waitlist</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
