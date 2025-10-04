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
  Car, 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Route,
  Info
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState } from "react"

interface ParkingInfoProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const parkingTypes = [
  { value: "on-site", label: "On-Site Parking", description: "Parking available at the venue" },
  { value: "street", label: "Street Parking", description: "Street parking available nearby" },
  { value: "public-lot", label: "Public Parking Lot", description: "Nearby public parking facility" },
  { value: "none", label: "No Parking Available", description: "No parking options available" },
]

const shuttleTypes = [
  { value: "temple-shuttle", label: "Temple Shuttle Service", description: "Free shuttle from designated pickup points" },
  { value: "public-transit", label: "Public Transit", description: "Public bus/train connections" },
  { value: "carpool", label: "Carpool Coordination", description: "Organized carpool arrangements" },
  { value: "none", label: "No Shuttle Service", description: "No transportation assistance" },
]

export function ParkingInfo({ formData, setFormData, isEditing, validationErrors }: ParkingInfoProps) {
  const [showCustomParking, setShowCustomParking] = useState(false)
  const [showCustomShuttle, setShowCustomShuttle] = useState(false)

  const handleParkingToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      parkingInfo: {
        ...formData.parkingInfo,
        enabled,
        // Reset to defaults when enabling
        ...(enabled && {
          parkingType: "on-site",
          totalSpots: 50,
          reservedSpots: 10,
          handicapSpots: 5,
          shuttleService: false,
          shuttleType: "none",
          parkingInstructions: "",
          shuttleSchedule: "",
          pickupLocations: [],
        })
      }
    })
  }

  const updateParkingField = (field: string, value: any) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      parkingInfo: {
        ...formData.parkingInfo,
        [field]: value
      }
    })
  }

  const getParkingStats = () => {
    const totalSpots = formData.parkingInfo?.totalSpots || 0
    const reservedSpots = formData.parkingInfo?.reservedSpots || 0
    const handicapSpots = formData.parkingInfo?.handicapSpots || 0
    const availableSpots = totalSpots - reservedSpots
    const generalSpots = availableSpots - handicapSpots

    return {
      totalSpots,
      reservedSpots,
      handicapSpots,
      availableSpots,
      generalSpots
    }
  }

  const stats = getParkingStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Car className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Parking & Transportation</h3>
      </div>

      {/* Enable/Disable Parking Info */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Enable Parking Information</CardTitle>
            <Switch
              checked={formData.parkingInfo?.enabled || false}
              onCheckedChange={handleParkingToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Provide parking and transportation information for event attendees.
          </p>
        </CardContent>
      </Card>

      {formData.parkingInfo?.enabled && (
        <>
          {/* Parking Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Parking Type *</Label>
            <Select
              value={formData.parkingInfo?.parkingType || "on-site"}
              onValueChange={(value) => {
                updateParkingField("parkingType", value)
                if (value === "none") {
                  setShowCustomParking(false)
                } else if (value === "custom") {
                  setShowCustomParking(true)
                } else {
                  setShowCustomParking(false)
                }
              }}
              disabled={!isEditing}
            >
              <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select parking type" />
              </SelectTrigger>
              <SelectContent>
                {parkingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Parking Details */}
          {showCustomParking && (
            <div className="space-y-3">
              <Label htmlFor="custom-parking-name" className="text-sm font-medium">
                Custom Parking Location *
              </Label>
              <Input
                id="custom-parking-name"
                placeholder="Enter parking location name"
                value={formData.parkingInfo?.customParkingName || ""}
                onChange={(e) => updateParkingField("customParkingName", e.target.value)}
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              />
              
              <Label htmlFor="custom-parking-address" className="text-sm font-medium">
                Parking Address
              </Label>
              <Textarea
                id="custom-parking-address"
                placeholder="Enter parking address"
                value={formData.parkingInfo?.customParkingAddress || ""}
                onChange={(e) => updateParkingField("customParkingAddress", e.target.value)}
                rows={2}
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}

          {/* Parking Capacity (only show if parking is available) */}
          {formData.parkingInfo?.parkingType !== "none" && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-blue-800">Parking Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total-spots" className="text-sm font-medium">
                      Total Spots
                    </Label>
                    <Input
                      id="total-spots"
                      type="number"
                      min="0"
                      placeholder="50"
                      value={formData.parkingInfo?.totalSpots || ""}
                      onChange={(e) => updateParkingField("totalSpots", parseInt(e.target.value) || 0)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reserved-spots" className="text-sm font-medium">
                      Reserved Spots
                    </Label>
                    <Input
                      id="reserved-spots"
                      type="number"
                      min="0"
                      placeholder="10"
                      value={formData.parkingInfo?.reservedSpots || ""}
                      onChange={(e) => updateParkingField("reservedSpots", parseInt(e.target.value) || 0)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="handicap-spots" className="text-sm font-medium">
                      Handicap Spots
                    </Label>
                    <Input
                      id="handicap-spots"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.parkingInfo?.handicapSpots || ""}
                      onChange={(e) => updateParkingField("handicapSpots", parseInt(e.target.value) || 0)}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Parking Availability Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Available Spots</Label>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      {stats.availableSpots} spots
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>General: {stats.generalSpots} spots</div>
                    <div>Handicap: {stats.handicapSpots} spots</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shuttle Service */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-green-800">Shuttle Service</CardTitle>
                <Switch
                  checked={formData.parkingInfo?.shuttleService || false}
                  onCheckedChange={(checked) => {
                    updateParkingField("shuttleService", checked)
                    if (!checked) {
                      setShowCustomShuttle(false)
                    }
                  }}
                  disabled={!isEditing}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.parkingInfo?.shuttleService && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shuttle Type</Label>
                    <Select
                      value={formData.parkingInfo?.shuttleType || "temple-shuttle"}
                      onValueChange={(value) => {
                        updateParkingField("shuttleType", value)
                        if (value === "custom") {
                          setShowCustomShuttle(true)
                        } else {
                          setShowCustomShuttle(false)
                        }
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select shuttle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {shuttleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <Bus className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Shuttle Details */}
                  {showCustomShuttle && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-shuttle-name" className="text-sm font-medium">
                        Custom Shuttle Service Name
                      </Label>
                      <Input
                        id="custom-shuttle-name"
                        placeholder="Enter shuttle service name"
                        value={formData.parkingInfo?.customShuttleName || ""}
                        onChange={(e) => updateParkingField("customShuttleName", e.target.value)}
                        className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  )}

                  {/* Shuttle Schedule */}
                  <div className="space-y-2">
                    <Label htmlFor="shuttle-schedule" className="text-sm font-medium">
                      Shuttle Schedule
                    </Label>
                    <Textarea
                      id="shuttle-schedule"
                      placeholder="Enter shuttle schedule details (e.g., Every 15 minutes from 8 AM to 6 PM)"
                      value={formData.parkingInfo?.shuttleSchedule || ""}
                      onChange={(e) => updateParkingField("shuttleSchedule", e.target.value)}
                      rows={2}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Pickup Locations */}
                  <div className="space-y-2">
                    <Label htmlFor="pickup-locations" className="text-sm font-medium">
                      Pickup Locations
                    </Label>
                    <Textarea
                      id="pickup-locations"
                      placeholder="Enter pickup locations (e.g., Main Street Bus Stop, Central Park, etc.)"
                      value={formData.parkingInfo?.pickupLocations?.join(", ") || ""}
                      onChange={(e) => updateParkingField("pickupLocations", e.target.value.split(", ").filter(loc => loc.trim()))}
                      rows={2}
                      className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                      disabled={!isEditing}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Parking Instructions */}
          <div className="space-y-3">
            <Label htmlFor="parking-instructions" className="text-sm font-medium">
              Parking Instructions
            </Label>
            <Textarea
              id="parking-instructions"
              placeholder="Enter parking instructions, rules, or special notes for attendees..."
              value={formData.parkingInfo?.parkingInstructions || ""}
              onChange={(e) => updateParkingField("parkingInstructions", e.target.value)}
              rows={3}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500">
              Provide clear instructions for parking, including any fees, restrictions, or special arrangements.
            </p>
          </div>

          {/* Parking Statistics (View Mode) */}
          {!isEditing && formData.parkingInfo?.parkingType !== "none" && (
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-purple-800">Parking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalSpots}</div>
                    <div className="text-sm text-purple-700">Total Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.availableSpots}</div>
                    <div className="text-sm text-green-700">Available</div>
                  </div>
                </div>
                {formData.parkingInfo?.shuttleService && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex items-center justify-center space-x-2">
                      <Bus className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Shuttle service available</span>
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
