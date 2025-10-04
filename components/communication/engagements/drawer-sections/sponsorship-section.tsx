"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Utensils } from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"

interface SponsorshipSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function SponsorshipSection({ formData, setFormData, isEditing, validationErrors }: SponsorshipSectionProps) {
  const isEventOrMeeting = formData.messageType === "Event" || formData.messageType === "Meeting"
  
  if (!isEventOrMeeting) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Puja Sponsorship */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800 text-base">
            <Heart className="h-4 w-4" />
            Puja Sponsorship
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Puja Sponsorship</Label>
              <p className="text-xs text-gray-500">Allow devotees to sponsor the puja</p>
            </div>
            <Switch
              checked={formData.pujaSponsorship?.enabled || false}
              onCheckedChange={(checked) => {
                if (!isEditing) return
                setFormData({
                  ...formData,
                  pujaSponsorship: { ...formData.pujaSponsorship, enabled: checked }
                })
              }}
              disabled={!isEditing}
            />
          </div>

          {formData.pujaSponsorship?.enabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="puja-sponsors-count" className="text-sm font-medium">
                  Number of sponsors allowed
                </Label>
                {isEditing ? (
                  <Input
                    id="puja-sponsors-count"
                    type="number"
                    min="2"
                    max="3"
                    value={formData.pujaSponsorship?.numberOfSponsors || 2}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (value >= 2 && value <= 3) {
                        setFormData({
                          ...formData,
                          pujaSponsorship: { 
                            ...formData.pujaSponsorship, 
                            enabled: true,
                            numberOfSponsors: value
                          }
                        })
                      }
                    }}
                    placeholder="2-3 sponsors allowed"
                    className="hover:border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                    {formData.pujaSponsorship?.numberOfSponsors || 2} sponsors allowed
                  </p>
                )}
                <p className="text-xs text-gray-500">Minimum 2, Maximum 3 sponsors</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Food/Snack Sponsorship */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800 text-base">
            <Utensils className="h-4 w-4" />
            Food/Snack Sponsorship
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Food Sponsorship</Label>
              <p className="text-xs text-gray-500">Allow devotees to sponsor food/snacks</p>
            </div>
            <Switch
              checked={formData.foodSponsorship?.enabled || false}
              onCheckedChange={(checked) => {
                if (!isEditing) return
                setFormData({
                  ...formData,
                  foodSponsorship: { ...formData.foodSponsorship, enabled: checked }
                })
              }}
              disabled={!isEditing}
            />
          </div>

          {formData.foodSponsorship?.enabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="food-details" className="text-sm font-medium">
                  Food Details
                </Label>
                {isEditing ? (
                  <Textarea
                    id="food-details"
                    value={formData.foodSponsorship?.details || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        foodSponsorship: { 
                          ...formData.foodSponsorship, 
                          enabled: true,
                          details: e.target.value 
                        }
                      })
                    }
                    placeholder="Describe the food items to be sponsored (e.g., Lunch for 50 people, Evening snacks, etc.)"
                    rows={3}
                    className="hover:border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {formData.foodSponsorship?.details || "No details provided"}
                    </p>
                  </div>
                )}
              </div>
              
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="food-sponsors-count" className="text-sm font-medium">
                  Number of sponsors allowed
                </Label>
                {isEditing ? (
                  <Input
                    id="food-sponsors-count"
                    type="number"
                    min="2"
                    max="3"
                    value={formData.foodSponsorship?.numberOfSponsors || 2}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (value >= 2 && value <= 3) {
                        setFormData({
                          ...formData,
                          foodSponsorship: { 
                            ...formData.foodSponsorship, 
                            enabled: true,
                            numberOfSponsors: value
                          }
                        })
                      }
                    }}
                    placeholder="2-3 sponsors allowed"
                    className="hover:border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                    {formData.foodSponsorship?.numberOfSponsors || 2} sponsors allowed
                  </p>
                )}
                <p className="text-xs text-gray-500">Minimum 2, Maximum 3 sponsors</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
