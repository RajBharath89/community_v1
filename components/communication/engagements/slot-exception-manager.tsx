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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Coffee,
  Shield,
  Zap,
  Wrench,
  Star,
  Repeat,
  Settings
} from "lucide-react"
import { useEngagementStore, type SlotException } from "@/stores/engagement-store"

interface SlotExceptionManagerProps {
  engagementId: string
  isEditing: boolean
  currentUser: {
    id: string
    name: string
    email: string
  }
  onUpdateEngagement?: (updates: any) => void
}

const EXCEPTION_TYPES = [
  { value: "break", label: "Break", icon: Coffee, color: "bg-orange-100 text-orange-700 border-orange-200", description: "Scheduled breaks between slots" },
  { value: "buffer", label: "Buffer Time", icon: Clock, color: "bg-blue-100 text-blue-700 border-blue-200", description: "Buffer time for transitions" },
  { value: "overflow", label: "Overflow", icon: Zap, color: "bg-yellow-100 text-yellow-700 border-yellow-200", description: "Extra slots for overflow capacity" },
  { value: "reserved", label: "Reserved", icon: Shield, color: "bg-purple-100 text-purple-700 border-purple-200", description: "Reserved slots for special purposes" },
  { value: "maintenance", label: "Maintenance", icon: Wrench, color: "bg-gray-100 text-gray-700 border-gray-200", description: "Maintenance or setup time" },
  { value: "special", label: "Special", icon: Star, color: "bg-pink-100 text-pink-700 border-pink-200", description: "Special events or activities" },
]

const RECURRING_PATTERNS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

export function SlotExceptionManager({
  engagementId,
  isEditing,
  currentUser,
  onUpdateEngagement,
}: SlotExceptionManagerProps) {
  const {
    getSlotExceptions,
    addSlotException,
    updateSlotException,
    deleteSlotException,
  } = useEngagementStore()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingException, setEditingException] = useState<SlotException | null>(null)
  const [deletingException, setDeletingException] = useState<SlotException | null>(null)

  // Form state for new/edit exception
  const [formData, setFormData] = useState({
    type: "break" as SlotException["type"],
    slotNumbers: [] as number[],
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    isRecurring: false,
    recurringPattern: "daily" as SlotException["recurringPattern"],
    recurringDays: [] as string[],
    isActive: true,
  })

  const exceptions = getSlotExceptions(engagementId)
  const activeExceptions = exceptions.filter(ex => ex.isActive)

  const getExceptionIcon = (type: SlotException["type"]) => {
    const exceptionType = EXCEPTION_TYPES.find(t => t.value === type)
    return exceptionType ? exceptionType.icon : AlertCircle
  }

  const getExceptionColor = (type: SlotException["type"]) => {
    const exceptionType = EXCEPTION_TYPES.find(t => t.value === type)
    return exceptionType ? exceptionType.color : "bg-gray-100 text-gray-700 border-gray-200"
  }

  const handleAddException = () => {
    if (!formData.title.trim() || formData.slotNumbers.length === 0) return

    addSlotException(engagementId, {
      type: formData.type,
      slotNumbers: formData.slotNumbers,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      title: formData.title,
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
      recurringDays: formData.isRecurring ? formData.recurringDays : undefined,
      isActive: formData.isActive,
      createdBy: currentUser.id,
    })

    resetForm()
    setShowAddDialog(false)
  }

  const handleEditException = () => {
    if (!editingException || !formData.title.trim() || formData.slotNumbers.length === 0) return

    updateSlotException(engagementId, editingException.id, {
      type: formData.type,
      slotNumbers: formData.slotNumbers,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      title: formData.title,
      description: formData.description || undefined,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
      recurringDays: formData.isRecurring ? formData.recurringDays : undefined,
      isActive: formData.isActive,
    })

    resetForm()
    setShowEditDialog(false)
    setEditingException(null)
  }

  const handleDeleteException = () => {
    if (!deletingException) return

    deleteSlotException(engagementId, deletingException.id)
    setShowDeleteDialog(false)
    setDeletingException(null)
  }

  const resetForm = () => {
    setFormData({
      type: "break",
      slotNumbers: [],
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      isRecurring: false,
      recurringPattern: "daily",
      recurringDays: [],
      isActive: true,
    })
  }

  const openEditDialog = (exception: SlotException) => {
    setEditingException(exception)
    setFormData({
      type: exception.type,
      slotNumbers: exception.slotNumbers,
      startTime: exception.startTime || "",
      endTime: exception.endTime || "",
      title: exception.title,
      description: exception.description || "",
      isRecurring: exception.isRecurring,
      recurringPattern: exception.recurringPattern || "daily",
      recurringDays: exception.recurringDays || [],
      isActive: exception.isActive,
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (exception: SlotException) => {
    setDeletingException(exception)
    setShowDeleteDialog(true)
  }

  const toggleSlotNumber = (slotNumber: number) => {
    setFormData(prev => ({
      ...prev,
      slotNumbers: prev.slotNumbers.includes(slotNumber)
        ? prev.slotNumbers.filter(n => n !== slotNumber)
        : [...prev.slotNumbers, slotNumber].sort((a, b) => a - b)
    }))
  }

  const toggleRecurringDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }))
  }

  return (
    <>
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Settings className="h-5 w-5" />
            Slot Exception Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Exception Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-indigo-500 hover:bg-indigo-600"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exception
              </Button>
            </div>
          )}

          {/* Exceptions List */}
          {exceptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No slot exceptions configured</p>
              <p className="text-sm mt-1">Add exceptions to define special slot conditions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exceptions.map((exception) => {
                const IconComponent = getExceptionIcon(exception.type)
                const colorClass = getExceptionColor(exception.type)
                
                return (
                  <div key={exception.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border ${colorClass}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{exception.title}</h4>
                            <Badge variant="outline" className={colorClass}>
                              {EXCEPTION_TYPES.find(t => t.value === exception.type)?.label}
                            </Badge>
                            {!exception.isActive && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                                Inactive
                              </Badge>
                            )}
                            {exception.isRecurring && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
                                <Repeat className="h-3 w-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                          
                          {exception.description && (
                            <p className="text-sm text-gray-600 mb-2">{exception.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Slots:</span>
                              <span>{exception.slotNumbers.join(", ")}</span>
                            </div>
                            {exception.startTime && exception.endTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{exception.startTime} - {exception.endTime}</span>
                              </div>
                            )}
                            {exception.isRecurring && exception.recurringPattern && (
                              <div className="flex items-center gap-1">
                                <Repeat className="h-3 w-3" />
                                <span className="capitalize">{exception.recurringPattern}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(exception)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(exception)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary */}
          {exceptions.length > 0 && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-800">Exception Summary</span>
              </div>
              <div className="text-sm text-indigo-700 space-y-1">
                <p>• {exceptions.length} total exceptions configured</p>
                <p>• {activeExceptions.length} active exceptions</p>
                <p>• {exceptions.filter(ex => ex.isRecurring).length} recurring exceptions</p>
                <p>• Affects {[...new Set(exceptions.flatMap(ex => ex.slotNumbers))].length} unique slots</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Exception Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Slot Exception</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Exception Type */}
            <div>
              <Label className="text-sm font-medium">Exception Type *</Label>
              <Select value={formData.type} onValueChange={(value: SlotException["type"]) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXCEPTION_TYPES.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="exception-title" className="text-sm font-medium">Title *</Label>
              <Input
                id="exception-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Lunch Break, Buffer Time, Reserved for VIP"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="exception-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="exception-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of this exception..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Slot Numbers */}
            <div>
              <Label className="text-sm font-medium">Affected Slots *</Label>
              <p className="text-xs text-gray-500 mb-2">Select which slot numbers this exception applies to</p>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((slotNumber) => (
                  <Button
                    key={slotNumber}
                    variant={formData.slotNumbers.includes(slotNumber) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSlotNumber(slotNumber)}
                    className="h-8"
                  >
                    {slotNumber}
                  </Button>
                ))}
              </div>
              {formData.slotNumbers.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {formData.slotNumbers.join(", ")}
                </p>
              )}
            </div>

            {/* Time Range (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exception-start-time" className="text-sm font-medium">Start Time (Optional)</Label>
                <Input
                  id="exception-start-time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="exception-end-time" className="text-sm font-medium">End Time (Optional)</Label>
                <Input
                  id="exception-end-time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Recurring Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Recurring Exception</Label>
                  <p className="text-xs text-gray-500">Apply this exception on a recurring basis</p>
                </div>
                <Switch
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                />
              </div>

              {formData.isRecurring && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                  <div>
                    <Label className="text-sm font-medium">Recurring Pattern</Label>
                    <Select value={formData.recurringPattern} onValueChange={(value: SlotException["recurringPattern"]) => setFormData(prev => ({ ...prev, recurringPattern: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RECURRING_PATTERNS.map((pattern) => (
                          <SelectItem key={pattern.value} value={pattern.value}>
                            {pattern.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.recurringPattern === "weekly" && (
                    <div>
                      <Label className="text-sm font-medium">Days of Week</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {DAYS_OF_WEEK.map((day) => (
                          <Button
                            key={day.value}
                            variant={formData.recurringDays.includes(day.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRecurringDay(day.value)}
                            className="h-8 text-xs"
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-gray-500">Enable this exception immediately</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddException} disabled={!formData.title.trim() || formData.slotNumbers.length === 0}>
              Add Exception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exception Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Slot Exception</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as Add Dialog */}
            {/* Exception Type */}
            <div>
              <Label className="text-sm font-medium">Exception Type *</Label>
              <Select value={formData.type} onValueChange={(value: SlotException["type"]) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXCEPTION_TYPES.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="edit-exception-title" className="text-sm font-medium">Title *</Label>
              <Input
                id="edit-exception-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Lunch Break, Buffer Time, Reserved for VIP"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-exception-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="edit-exception-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of this exception..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Slot Numbers */}
            <div>
              <Label className="text-sm font-medium">Affected Slots *</Label>
              <p className="text-xs text-gray-500 mb-2">Select which slot numbers this exception applies to</p>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((slotNumber) => (
                  <Button
                    key={slotNumber}
                    variant={formData.slotNumbers.includes(slotNumber) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSlotNumber(slotNumber)}
                    className="h-8"
                  >
                    {slotNumber}
                  </Button>
                ))}
              </div>
              {formData.slotNumbers.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {formData.slotNumbers.join(", ")}
                </p>
              )}
            </div>

            {/* Time Range (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-exception-start-time" className="text-sm font-medium">Start Time (Optional)</Label>
                <Input
                  id="edit-exception-start-time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-exception-end-time" className="text-sm font-medium">End Time (Optional)</Label>
                <Input
                  id="edit-exception-end-time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Recurring Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Recurring Exception</Label>
                  <p className="text-xs text-gray-500">Apply this exception on a recurring basis</p>
                </div>
                <Switch
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                />
              </div>

              {formData.isRecurring && (
                <div className="space-y-3 pl-4 border-l-2 border-indigo-200">
                  <div>
                    <Label className="text-sm font-medium">Recurring Pattern</Label>
                    <Select value={formData.recurringPattern} onValueChange={(value: SlotException["recurringPattern"]) => setFormData(prev => ({ ...prev, recurringPattern: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RECURRING_PATTERNS.map((pattern) => (
                          <SelectItem key={pattern.value} value={pattern.value}>
                            {pattern.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.recurringPattern === "weekly" && (
                    <div>
                      <Label className="text-sm font-medium">Days of Week</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {DAYS_OF_WEEK.map((day) => (
                          <Button
                            key={day.value}
                            variant={formData.recurringDays.includes(day.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRecurringDay(day.value)}
                            className="h-8 text-xs"
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-gray-500">Enable this exception immediately</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditException} disabled={!formData.title.trim() || formData.slotNumbers.length === 0}>
              Update Exception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Exception Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Slot Exception
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the exception "{deletingException?.title}"? This action cannot be undone.
            </p>
            {deletingException && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <div className="text-sm text-gray-700">
                  <p><strong>Type:</strong> {EXCEPTION_TYPES.find(t => t.value === deletingException.type)?.label}</p>
                  <p><strong>Slots:</strong> {deletingException.slotNumbers.join(", ")}</p>
                  {deletingException.description && (
                    <p><strong>Description:</strong> {deletingException.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteException}>
              Delete Exception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
