"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MapPin
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"

interface EventDetailsSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function EventDetailsSection({ formData, setFormData, isEditing, validationErrors }: EventDetailsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Location & Venue Details */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <MapPin className="h-5 w-5" />
            <span>Location & Venue</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Venue/Location *
            </Label>
            {isEditing ? (
              <>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter venue or location details"
                  className="hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
                {validationErrors.location && <p className="text-sm text-red-600">{validationErrors.location}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formData.location || "No location specified"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingDetails" className="text-sm font-medium">
              Parking Information
            </Label>
            {isEditing ? (
              <Textarea
                id="parkingDetails"
                value={formData.parkingDetails || ""}
                onChange={(e) => setFormData({ ...formData, parkingDetails: e.target.value })}
                placeholder="Enter parking details, directions, or parking restrictions..."
                rows={3}
                className="hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded border min-h-[80px]">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.parkingDetails || "No parking information"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
