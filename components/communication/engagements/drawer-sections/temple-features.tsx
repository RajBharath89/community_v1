"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Flower, 
  Camera, 
  Music, 
  Shirt, 
  Armchair, 
  Gift
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"

const offeringOptions = [
  { id: "flowers", label: "Flowers", icon: Flower },
  { id: "garlands", label: "Garlands", icon: Flower },
  { id: "fruits", label: "Fruits", icon: Gift },
  { id: "sweets", label: "Sweets", icon: Gift },
  { id: "coconut", label: "Coconut", icon: Gift },
  { id: "betel", label: "Betel Leaves/Nuts", icon: Gift },
  { id: "lamps", label: "Ghee/Oil Lamps", icon: Gift },
  { id: "incense", label: "Incense Sticks", icon: Gift },
  { id: "camphor", label: "Camphor", icon: Gift },
]

const seatingOptions = [
  { id: "mats", label: "Mats" },
  { id: "chairs", label: "Chairs" },
  { id: "canopy", label: "Canopy for Outdoor Events" },
]

const musicOptions = [
  { id: "live-bhajans", label: "Live Bhajans" },
  { id: "recorded-bhajans", label: "Recorded Bhajans" },
  { id: "no-music", label: "No Music" },
]


interface TempleFeaturesProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function TempleFeatures({ formData, setFormData, isEditing, validationErrors }: TempleFeaturesProps) {
  const isEventOrMeeting = formData.messageType === "Event" || formData.messageType === "Meeting"
  
  if (!isEventOrMeeting) {
    return null
  }

  const handleOfferingToggle = (offeringId: string) => {
    if (!isEditing) return
    
    const currentOfferings = formData.devoteeOfferings || []
    const newOfferings = currentOfferings.includes(offeringId)
      ? currentOfferings.filter(id => id !== offeringId)
      : [...currentOfferings, offeringId]
    
    setFormData({ ...formData, devoteeOfferings: newOfferings })
  }

  const handleSeatingToggle = (seatingId: string) => {
    if (!isEditing) return
    
    const currentSeating = formData.seatingArrangements || []
    const newSeating = currentSeating.includes(seatingId)
      ? currentSeating.filter(id => id !== seatingId)
      : [...currentSeating, seatingId]
    
    setFormData({ ...formData, seatingArrangements: newSeating })
  }


  return (
    <div className="space-y-6">

      {/* Temple Prasad */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-600" />
              Temple Prasad Option
            </Label>
            <p className="text-xs text-gray-500">Include temple prasad distribution</p>
          </div>
          <Switch
            checked={formData.templePrasad || false}
            onCheckedChange={(checked) => {
              if (!isEditing) return
              setFormData({ ...formData, templePrasad: checked })
            }}
            disabled={!isEditing}
          />
        </div>
      </div>

      <Separator />

      {/* Devotee Offerings */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Flower className="h-4 w-4 text-pink-600" />
          Devotee Offerings Allowed
        </Label>
        <p className="text-xs text-gray-500">Select items devotees can bring as offerings</p>
        
        {isEditing ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {offeringOptions.map((offering) => {
              const Icon = offering.icon
              const isSelected = formData.devoteeOfferings?.includes(offering.id) || false
              
              return (
                <div
                  key={offering.id}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-pink-200 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleOfferingToggle(offering.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleOfferingToggle(offering.id)}
                  />
                  <Icon className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-medium">{offering.label}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {formData.devoteeOfferings && formData.devoteeOfferings.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.devoteeOfferings.map((offeringId) => {
                  const offering = offeringOptions.find(o => o.id === offeringId)
                  return offering ? (
                    <Badge key={offeringId} variant="outline" className="text-pink-700 border-pink-200">
                      {offering.label}
                    </Badge>
                  ) : null
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No offerings selected</p>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Seating Arrangements */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Armchair className="h-4 w-4 text-red-600" />
          Seating/Arrangements
        </Label>
        <p className="text-xs text-gray-500">Select seating and arrangement options</p>
        
        {isEditing ? (
          <div className="space-y-3">
            {seatingOptions.map((seating) => (
              <div
                key={seating.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={formData.seatingArrangements?.includes(seating.id) || false}
                  onCheckedChange={() => handleSeatingToggle(seating.id)}
                />
                <Label className="font-medium cursor-pointer flex-1">
                  {seating.label}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {formData.seatingArrangements && formData.seatingArrangements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.seatingArrangements.map((seatingId) => {
                  const seating = seatingOptions.find(s => s.id === seatingId)
                  return seating ? (
                    <Badge key={seatingId} variant="outline" className="text-red-700 border-red-200">
                      {seating.label}
                    </Badge>
                  ) : null
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No seating arrangements selected</p>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Music/Chanting */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Music className="h-4 w-4 text-purple-600" />
          Music/Chanting (Bhajans)
        </Label>
        
        {isEditing ? (
          <Select
            value={formData.musicChanting || ""}
            onValueChange={(value) => setFormData({ ...formData, musicChanting: value })}
          >
            <SelectTrigger className="hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Select music option" />
            </SelectTrigger>
            <SelectContent>
              {musicOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center space-x-2">
                    <Music className="h-4 w-4 text-purple-600" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="mt-2">
            {formData.musicChanting ? (
              <Badge variant="outline" className="text-purple-700 border-purple-200">
                {musicOptions.find(m => m.id === formData.musicChanting)?.label || formData.musicChanting}
              </Badge>
            ) : (
              <p className="text-sm text-gray-500">No music option selected</p>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Dress Code */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Shirt className="h-4 w-4 text-indigo-600" />
          Dress Code
        </Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Traditional Attire Required</Label>
              <p className="text-xs text-gray-500">Require devotees to wear traditional clothing</p>
            </div>
            <Switch
              checked={formData.dressCode?.traditionalRequired || false}
              onCheckedChange={(checked) => {
                if (!isEditing) return
                setFormData({
                  ...formData,
                  dressCode: { ...formData.dressCode, traditionalRequired: checked }
                })
              }}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-theme" className="text-sm font-medium">
              Specific Color Theme (Optional)
            </Label>
            {isEditing ? (
              <Input
                id="color-theme"
                value={formData.dressCode?.colorTheme || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dressCode: { 
                      ...formData.dressCode, 
                      colorTheme: e.target.value 
                    }
                  })
                }
                placeholder="e.g., White, Yellow, Orange, etc."
                className="hover:border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {formData.dressCode?.colorTheme || "No specific color theme"}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Photography/Videography */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Camera className="h-4 w-4 text-gray-600" />
              Photography/Videography
            </Label>
            <p className="text-xs text-gray-500">Allow photo and video recording during the event</p>
          </div>
          <Switch
            checked={formData.photographyAllowed || false}
            onCheckedChange={(checked) => {
              if (!isEditing) return
              setFormData({ ...formData, photographyAllowed: checked })
            }}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  )
}
