"use client"

import { useState, useEffect } from "react"
import { useEngagementStore } from "@/stores/engagement-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  Calendar,
  Users,
  Send,
  Clock,
  FileText,
  AlertTriangle,
  Megaphone,
  Bell,
  Zap,
  Mail,
  Smartphone,
  RotateCcw,
  Hash,
} from "lucide-react"

const statuses = ["Sent", "Scheduled", "Draft", "Failed"]
const priorities = ["Low", "Normal", "High", "Urgent"]
const messageTypes = ["Announcement", "Event", "Meeting"]
const deliveryChannels = ["in-app", "email", "sms"]
const targetAudiences = ["all", "groups", "users", "mixed"]
const creators = ["Admin", "Sunita Devi", "Rajesh Kumar", "Priya Sharma"]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Sent":
      return <Send className="h-4 w-4 text-green-500" />
    case "Scheduled":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "Draft":
      return <FileText className="h-4 w-4 text-gray-500" />
    case "Failed":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Megaphone className="h-4 w-4" />
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return <Zap className="h-4 w-4 text-red-500" />
    case "High":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case "Normal":
      return <Bell className="h-4 w-4 text-blue-500" />
    case "Low":
      return <Bell className="h-4 w-4 text-gray-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case "Announcement":
      return <Megaphone className="h-4 w-4 text-green-500" />
    case "Event":
      return <Calendar className="h-4 w-4 text-purple-500" />
    case "Meeting":
      return <Users className="h-4 w-4 text-indigo-500" />
    default:
      return <Megaphone className="h-4 w-4" />
  }
}

const getDeliveryChannelIcon = (channel: string) => {
  switch (channel) {
    case "in-app":
      return <Bell className="h-4 w-4 text-blue-500" />
    case "email":
      return <Mail className="h-4 w-4 text-green-500" />
    case "sms":
      return <Smartphone className="h-4 w-4 text-purple-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function AdvancedFilterDrawer() {
  const {
    advancedFilterOpen,
    setAdvancedFilterOpen,
    advancedFilters,
    setAdvancedFilters,
    resetAdvancedFilters,
  } = useEngagementStore()

  // Local UI state (richer than store schema). We map to store on apply
  const [localFilters, setLocalFilters] = useState({
    selectedStatuses: [] as string[],
    selectedPriorities: [] as string[],
    selectedMessageTypes: [] as string[],
    selectedDeliveryChannels: [] as string[],
    selectedTargetAudiences: [] as string[],
    selectedCreators: [] as string[],
    createdDateFrom: "",
    createdDateTo: "",
    scheduledDateFrom: "",
    scheduledDateTo: "",
    sentDateFrom: "",
    sentDateTo: "",
    recipientCountMin: null as number | null,
    recipientCountMax: null as number | null,
    deliveryRateMin: null as number | null,
    deliveryRateMax: null as number | null,
    readRateMin: null as number | null,
    readRateMax: null as number | null,
    hasAttachments: null as boolean | null,
    titleContains: "",
    subjectContains: "",
    contentContains: "",
    createdByContains: "",
  })

  // Hydrate local UI state from store on mount/changes
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedStatuses: advancedFilters.status,
      selectedPriorities: advancedFilters.priority,
      selectedMessageTypes: advancedFilters.messageType,
      selectedDeliveryChannels: advancedFilters.deliveryChannels,
      selectedCreators: advancedFilters.createdBy,
      createdDateFrom: advancedFilters.dateRange.start,
      createdDateTo: advancedFilters.dateRange.end,
      // Numeric ranges (use null when default/full range)
      recipientCountMin:
        advancedFilters.recipientCountRange.min !== 0 ? advancedFilters.recipientCountRange.min : null,
      recipientCountMax:
        advancedFilters.recipientCountRange.max !== 10000 ? advancedFilters.recipientCountRange.max : null,
      deliveryRateMin:
        advancedFilters.deliveryRateRange.min !== 0 ? advancedFilters.deliveryRateRange.min : null,
      deliveryRateMax:
        advancedFilters.deliveryRateRange.max !== 100 ? advancedFilters.deliveryRateRange.max : null,
      readRateMin: advancedFilters.readRateRange.min !== 0 ? advancedFilters.readRateRange.min : null,
      readRateMax: advancedFilters.readRateRange.max !== 100 ? advancedFilters.readRateRange.max : null,
      hasAttachments: advancedFilters.hasAttachments,
      titleContains: advancedFilters.searchText,
      subjectContains: "",
      contentContains: "",
      createdByContains: "",
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedFilters])

  const handleApplyFilters = () => {
    // Map UI state to store schema
    setAdvancedFilters({
      status: localFilters.selectedStatuses,
      priority: localFilters.selectedPriorities,
      messageType: localFilters.selectedMessageTypes,
      deliveryChannels: localFilters.selectedDeliveryChannels,
      createdBy: localFilters.selectedCreators,
      dateRange: { start: localFilters.createdDateFrom, end: localFilters.createdDateTo },
      recipientCountRange: {
        min: localFilters.recipientCountMin ?? 0,
        max: localFilters.recipientCountMax ?? 10000,
      },
      deliveryRateRange: {
        min: localFilters.deliveryRateMin ?? 0,
        max: localFilters.deliveryRateMax ?? 100,
      },
      readRateRange: {
        min: localFilters.readRateMin ?? 0,
        max: localFilters.readRateMax ?? 100,
      },
      hasAttachments: localFilters.hasAttachments,
      searchText: localFilters.titleContains?.trim() || "",
    })
    setAdvancedFilterOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      selectedStatuses: [],
      selectedPriorities: [],
      selectedMessageTypes: [],
      selectedDeliveryChannels: [],
      selectedTargetAudiences: [],
      selectedCreators: [],
      createdDateFrom: "",
      createdDateTo: "",
      scheduledDateFrom: "",
      scheduledDateTo: "",
      sentDateFrom: "",
      sentDateTo: "",
      recipientCountMin: null,
      recipientCountMax: null,
      deliveryRateMin: null,
      deliveryRateMax: null,
      readRateMin: null,
      readRateMax: null,
      hasAttachments: null,
      titleContains: "",
      subjectContains: "",
      contentContains: "",
      createdByContains: "",
    }
    setLocalFilters(clearedFilters)
    resetAdvancedFilters()
  }

  const toggleStatus = (status: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter((s) => s !== status)
        : [...prev.selectedStatuses, status],
    }))
  }

  const togglePriority = (priority: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedPriorities: prev.selectedPriorities.includes(priority)
        ? prev.selectedPriorities.filter((p) => p !== priority)
        : [...prev.selectedPriorities, priority],
    }))
  }

  const toggleMessageType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedMessageTypes: prev.selectedMessageTypes.includes(type)
        ? prev.selectedMessageTypes.filter((t) => t !== type)
        : [...prev.selectedMessageTypes, type],
    }))
  }

  const toggleDeliveryChannel = (channel: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedDeliveryChannels: prev.selectedDeliveryChannels.includes(channel)
        ? prev.selectedDeliveryChannels.filter((c) => c !== channel)
        : [...prev.selectedDeliveryChannels, channel],
    }))
  }

  const toggleTargetAudience = (audience: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedTargetAudiences: prev.selectedTargetAudiences.includes(audience)
        ? prev.selectedTargetAudiences.filter((a) => a !== audience)
        : [...prev.selectedTargetAudiences, audience],
    }))
  }

  const toggleCreator = (creator: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedCreators: prev.selectedCreators.includes(creator)
        ? prev.selectedCreators.filter((c) => c !== creator)
        : [...prev.selectedCreators, creator],
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.selectedStatuses.length > 0) count++
    if (localFilters.selectedPriorities.length > 0) count++
    if (localFilters.selectedMessageTypes.length > 0) count++
    if (localFilters.selectedDeliveryChannels.length > 0) count++
    if (localFilters.selectedTargetAudiences.length > 0) count++
    if (localFilters.selectedCreators.length > 0) count++
    if (localFilters.createdDateFrom || localFilters.createdDateTo) count++
    if (localFilters.scheduledDateFrom || localFilters.scheduledDateTo) count++
    if (localFilters.sentDateFrom || localFilters.sentDateTo) count++
    if (localFilters.recipientCountMin !== null || localFilters.recipientCountMax !== null) count++
    if (localFilters.deliveryRateMin !== null || localFilters.deliveryRateMax !== null) count++
    if (localFilters.readRateMin !== null || localFilters.readRateMax !== null) count++
    if (localFilters.hasAttachments !== null) count++
    if (localFilters.titleContains) count++
    if (localFilters.subjectContains) count++
    if (localFilters.contentContains) count++
    if (localFilters.createdByContains) count++
    return count
  }

  return (
    <Sheet open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-500" />
              <SheetTitle>Advanced Filters</SheetTitle>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          <SheetDescription>
            Apply advanced filters to find specific engagements based on detailed criteria
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Send className="h-4 w-4" />
              Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={localFilters.selectedStatuses.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getStatusIcon(status)}
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Priority Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Priority
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={localFilters.selectedPriorities.includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`priority-${priority}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getPriorityIcon(priority)}
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Message Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Message Types
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {messageTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={localFilters.selectedMessageTypes.includes(type)}
                    onCheckedChange={() => toggleMessageType(type)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getMessageTypeIcon(type)}
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Channels */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Delivery Channels
            </Label>
            <div className="space-y-2">
              {deliveryChannels.map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={localFilters.selectedDeliveryChannels.includes(channel)}
                    onCheckedChange={() => toggleDeliveryChannel(channel)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`channel-${channel}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {getDeliveryChannelIcon(channel)}
                    {channel === "in-app" ? "In-App" : channel.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Target Audience */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Target Audience
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {targetAudiences.map((audience) => (
                <div key={audience} className="flex items-center space-x-2">
                  <Checkbox
                    id={`audience-${audience}`}
                    checked={localFilters.selectedTargetAudiences.includes(audience)}
                    onCheckedChange={() => toggleTargetAudience(audience)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`audience-${audience}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    {audience === "all"
                      ? "All Users"
                      : audience === "groups"
                        ? "Groups"
                        : audience === "users"
                          ? "Users"
                          : "Mixed"}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Creator Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Created By
            </Label>
            <div className="space-y-2">
              {creators.map((creator) => (
                <div key={creator} className="flex items-center space-x-2">
                  <Checkbox
                    id={`creator-${creator}`}
                    checked={localFilters.selectedCreators.includes(creator)}
                    onCheckedChange={() => toggleCreator(creator)}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <Label htmlFor={`creator-${creator}`} className="text-sm cursor-pointer">
                    {creator}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Ranges */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Ranges
            </Label>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Created Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="createdDateFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="createdDateFrom"
                      type="date"
                      value={localFilters.createdDateFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdDateFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="createdDateTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="createdDateTo"
                      type="date"
                      value={localFilters.createdDateTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdDateTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Scheduled Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="scheduledDateFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="scheduledDateFrom"
                      type="date"
                      value={localFilters.scheduledDateFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, scheduledDateFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledDateTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="scheduledDateTo"
                      type="date"
                      value={localFilters.scheduledDateTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, scheduledDateTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Sent Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="sentDateFrom" className="text-xs">
                      From
                    </Label>
                    <Input
                      id="sentDateFrom"
                      type="date"
                      value={localFilters.sentDateFrom}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, sentDateFrom: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sentDateTo" className="text-xs">
                      To
                    </Label>
                    <Input
                      id="sentDateTo"
                      type="date"
                      value={localFilters.sentDateTo}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, sentDateTo: e.target.value }))}
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Numeric Ranges */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Numeric Ranges
            </Label>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Recipient Count Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="recipientCountMin" className="text-xs">
                      Minimum
                    </Label>
                    <Input
                      id="recipientCountMin"
                      type="number"
                      min="0"
                      value={localFilters.recipientCountMin || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          recipientCountMin: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Min recipients"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientCountMax" className="text-xs">
                      Maximum
                    </Label>
                    <Input
                      id="recipientCountMax"
                      type="number"
                      min="0"
                      value={localFilters.recipientCountMax || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          recipientCountMax: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Max recipients"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Delivery Rate Range (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="deliveryRateMin" className="text-xs">
                      Minimum
                    </Label>
                    <Input
                      id="deliveryRateMin"
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.deliveryRateMin || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          deliveryRateMin: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Min %"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryRateMax" className="text-xs">
                      Maximum
                    </Label>
                    <Input
                      id="deliveryRateMax"
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.deliveryRateMax || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          deliveryRateMax: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Max %"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Read Rate Range (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="readRateMin" className="text-xs">
                      Minimum
                    </Label>
                    <Input
                      id="readRateMin"
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.readRateMin || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          readRateMin: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Min %"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="readRateMax" className="text-xs">
                      Maximum
                    </Label>
                    <Input
                      id="readRateMax"
                      type="number"
                      min="0"
                      max="100"
                      value={localFilters.readRateMax || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          readRateMax: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Max %"
                      className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Field Presence */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Field Presence</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Has Attachments</Label>
                <Select
                  value={localFilters.hasAttachments === null ? "any" : localFilters.hasAttachments ? "yes" : "no"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      hasAttachments: value === "any" ? null : value === "yes",
                    }))
                  }
                >
                  <SelectTrigger className="w-24 border-0 bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Search in Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search in Fields</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="titleContains" className="text-xs">
                  Title contains
                </Label>
                <Input
                  id="titleContains"
                  value={localFilters.titleContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, titleContains: e.target.value }))}
                  placeholder="Search in titles..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectContains" className="text-xs">
                  Subject contains
                </Label>
                <Input
                  id="subjectContains"
                  value={localFilters.subjectContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, subjectContains: e.target.value }))}
                  placeholder="Search in subjects..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentContains" className="text-xs">
                  Content contains
                </Label>
                <Input
                  id="contentContains"
                  value={localFilters.contentContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, contentContains: e.target.value }))}
                  placeholder="Search in content..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdByContains" className="text-xs">
                  Created by contains
                </Label>
                <Input
                  id="createdByContains"
                  value={localFilters.createdByContains}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, createdByContains: e.target.value }))}
                  placeholder="Search in creator names..."
                  className="border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-red-500 hover:bg-muted/70 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => setAdvancedFilterOpen(false)}
              className="hover:scale-105 hover:shadow-md transition-all duration-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
