"use client"

import { useState, useEffect } from "react"
import { useEngagementStore } from "@/stores/engagement-store"
import { useGroupStore } from "@/stores/group-store"
import { useUserStore } from "@/stores/user-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Save, Send, Copy, Trash2, AlertTriangle, Clock, ChevronDown, ChevronRight } from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"

import { BasicFormFields } from "./drawer-sections/basic-form-fields"
import { EventScheduleSection } from "./drawer-sections/event-schedule-section"
import { EventDetailsSection } from "./drawer-sections/event-details-section"
import { SchedulingSection } from "./drawer-sections/scheduling-section"
import { DeliverySystem } from "./drawer-sections/delivery-system"
import { AdvancedTargeting } from "./drawer-sections/advanced-targeting"
import { TempleFeatures } from "./drawer-sections/temple-features"
import { SponsorshipSection } from "./drawer-sections/sponsorship-section"
import { RSVPComponent } from "./rsvp-component"
import { VolunteerComponent } from "./volunteer-component"
import { SlotManagementComponent } from "./slot-management-component"
import { DeliveryConfirmation } from "./drawer-sections/delivery-confirmation"
import { DonationIntegration } from "./drawer-sections/donation-integration"

// Tab configuration
const TABS = [
  {
    id: "basic",
    label: "Basic Information",
    icon: "📝",
    description: "Core details and content"
  },
  {
    id: "audience",
    label: "Audience & Delivery",
    icon: "👥",
    description: "Target audience and delivery channels"
  },
  {
    id: "features",
    label: "Event Features",
    icon: "✨",
    description: "RSVP, volunteering, and slot management"
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    icon: "⚙️",
    description: "Temple features and integrations"
  }
]

// Accordion configuration for each tab
const ACCORDIONS = {
  basic: [
    { id: "core", label: "Core Details", icon: "📝", defaultOpen: true },
    { id: "event-schedule", label: "Event Schedule", icon: "📅", defaultOpen: true },
    { id: "event-details", label: "Event Details", icon: "🏛️", defaultOpen: true }
  ],
  audience: [
    { id: "datetime", label: "Schedule Engagement", icon: "📅", defaultOpen: true },
    { id: "target", label: "Target Audience", icon: "👥", defaultOpen: true },
    { id: "delivery", label: "Delivery Channels", icon: "📤", defaultOpen: true }
  ],
  features: [
    { id: "sponsorship", label: "Sponsorship", icon: "💰", defaultOpen: true },
    { id: "rsvp", label: "RSVP Management", icon: "✅", defaultOpen: true },
    { id: "volunteering", label: "Volunteering", icon: "🤝", defaultOpen: false },
    { id: "slots", label: "Slot Management", icon: "⏰", defaultOpen: false }
  ],
  advanced: [
    { id: "temple", label: "Temple Features", icon: "🕉️", defaultOpen: true },
    { id: "delivery-confirmation", label: "Delivery Confirmation", icon: "📨", defaultOpen: false },
    { id: "donation-integration", label: "Donation Integration", icon: "💰", defaultOpen: false }
  ]
}

export function EngagementDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedEngagement,
    closeDrawer,
    addEngagement,
    updateEngagement,
    deleteEngagement,
    duplicateEngagement,
    sendEngagement,
    scheduleEngagement,
  } = useEngagementStore()

  const { groups } = useGroupStore()
  const { users } = useUserStore()

  const [formData, setFormData] = useState<Partial<Engagement>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false)
  
  // Tab and accordion state
  const [activeTab, setActiveTab] = useState("basic")
  const [openAccordions, setOpenAccordions] = useState<Record<string, Set<string>>>({
    basic: new Set(["core", "event-schedule", "event-details"]),
    audience: new Set(["datetime", "target", "delivery"]),
    features: new Set(["sponsorship", "rsvp"]),
    advanced: new Set(["temple"])
  })

  // Toggle accordion
  const toggleAccordion = (tabId: string, accordionId: string) => {
    setOpenAccordions(prev => {
      const newState = { ...prev }
      const tabAccordions = new Set(newState[tabId] || [])
      
      if (tabAccordions.has(accordionId)) {
        tabAccordions.delete(accordionId)
      } else {
        tabAccordions.add(accordionId)
      }
      
      newState[tabId] = tabAccordions
      return newState
    })
  }

  // Check if accordion is open
  const isAccordionOpen = (tabId: string, accordionId: string) => {
    return openAccordions[tabId]?.has(accordionId) || false
  }

  // Expand/collapse all accordions in current tab
  const toggleAllAccordions = (expand: boolean) => {
    const currentTabAccordions = ACCORDIONS[activeTab as keyof typeof ACCORDIONS] || []
    const accordionIds = currentTabAccordions.map(acc => acc.id)
    
    setOpenAccordions(prev => {
      const newState = { ...prev }
      newState[activeTab] = expand ? new Set(accordionIds) : new Set()
      return newState
    })
  }

  // Check if all accordions in current tab are open
  const areAllAccordionsOpen = () => {
    const currentTabAccordions = ACCORDIONS[activeTab as keyof typeof ACCORDIONS] || []
    const openCount = openAccordions[activeTab]?.size || 0
    return openCount === currentTabAccordions.length
  }

  // Get visible accordions based on message type
  const getVisibleAccordions = (tabId: string) => {
    const allAccordions = ACCORDIONS[tabId as keyof typeof ACCORDIONS] || []
    
    if (tabId === "basic") {
      if (formData.messageType === "Announcement") {
        return allAccordions.filter(acc => acc.id !== "event-schedule" && acc.id !== "event-details") // No event sections for announcements
      } else {
        return allAccordions // All sections for Events and Meetings
      }
    }
    
    if (tabId === "features") {
      if (formData.messageType === "Announcement") {
        return [] // No features for announcements
      } else if (formData.messageType === "Event") {
        return allAccordions.filter(acc => acc.id !== "slots") // No slot management for events
      } else if (formData.messageType === "Meeting") {
        return allAccordions // All features for meetings
      }
    }
    
    if (tabId === "audience") {
      if (formData.messageType === "Announcement") {
        return allAccordions.filter(acc => acc.id !== "datetime") // No date/time for announcements
      }
    }
    
    return allAccordions
  }

  useEffect(() => {
    if (selectedEngagement) {
      setFormData(selectedEngagement)
      if (selectedEngagement.scheduledDate) {
        setScheduledDate(selectedEngagement.scheduledDate)
        setScheduledTime("09:00")
      }
    } else {
      setFormData({
        title: "",
        content: "",
        priority: "Normal",
        messageType: "Meeting",
        status: "Draft",
        targetAudience: "all",
        targetGroups: [],
        targetUsers: [],
        deliveryChannels: ["in-app"],
        attachments: [],
        attachedForms: [],
        mediaAttachments: [],
        links: [],
        totalRecipients: 0,
        deliveredCount: 0,
        readCount: 0,
        clickCount: 0,
        createdBy: "Admin",
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        // General form - removed as not in interface
        // Enable RSVP for Events and Meetings
        rsvpEnabled: true,
        rsvpDeadline: "",
        rsvpDeadlineEnabled: false,
        rsvpCapacity: 100,
        rsvpResponses: [],
        rsvpStats: {
          attending: 0,
          notAttending: 0,
          maybe: 0,
          pending: 0,
        },
        // Enable volunteer features
        volunteershipEnabled: true,
        volunteerRoles: [
          {
            id: "role-1",
            title: "Event Coordinator",
            description: "Help coordinate the event activities",
            requirements: "Good organizational skills",
            timeCommitment: "2-3 hours",
            spotsAvailable: 2,
            spotsFilledCount: 0,
            applicationForm: "",
            formDeadline: undefined,
            formDeadlineEnabled: false,
            autoApproval: false,
          },
          {
            id: "role-2",
            title: "Registration Assistant",
            description: "Help with check-in and registration",
            requirements: "Friendly and organized",
            timeCommitment: "1-2 hours",
            spotsAvailable: 3,
            spotsFilledCount: 0,
            applicationForm: "",
            formDeadline: undefined,
            formDeadlineEnabled: false,
            autoApproval: false,
          },
        ],
        volunteerRequests: [],
        volunteerStats: {
          totalRoles: 2,
          totalSpots: 5,
          filledSpots: 0,
          pendingRequests: 0,
        },
        // Enable slot management for meetings
        slotManagement: {
          enabled: true,
          totalSlots: 10,
          slotDuration: 30,
          startTime: "09:00",
          endTime: "17:00",
          bookingDeadline: "",
          allowWaitlist: true,
        },
        slotBookings: [],
        slotStats: {
          totalSlots: 10,
          bookedSlots: 0,
          availableSlots: 10,
          waitlistCount: 0,
        },
      })
      setScheduledDate("")
      setScheduledTime("09:00")
    }
    setIsEditing(drawerMode === "create" || drawerMode === "edit")
    setValidationErrors({})
  }, [selectedEngagement, drawerMode])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title?.trim()) errors.title = "Title is required"
    if (!formData.content?.trim()) errors.content = "Content is required"
    if (!formData.priority) errors.priority = "Priority is required"
    if (!formData.messageType) errors.messageType = "Message type is required"
    
    // Engagement date, time, and location validation only for Events and Meetings
    if (formData.messageType === "Event" || formData.messageType === "Meeting") {
      if (!formData.engagementDate) errors.engagementDate = "Event date is required"
      if (!formData.engagementTime) errors.engagementTime = "Event time is required"
      if (!formData.location?.trim()) errors.location = "Location is required"
    }
    if (!formData.targetAudience) errors.targetAudience = "Target audience is required"
    if (!formData.deliveryChannels || formData.deliveryChannels.length === 0) {
      errors.deliveryChannels = "At least one delivery channel is required"
    }

    if (formData.targetAudience === "groups" && (!formData.targetGroups || formData.targetGroups.length === 0)) {
      errors.targetGroups = "At least one group must be selected"
    }

    if (formData.targetAudience === "users" && (!formData.targetUsers || formData.targetUsers.length === 0)) {
      errors.targetUsers = "At least one user must be selected"
    }

    if (formData.targetAudience === "mixed") {
      if ((!formData.targetGroups || formData.targetGroups.length === 0) &&
          (!formData.targetUsers || formData.targetUsers.length === 0)) {
        errors.targetSelection = "At least one group or user must be selected"
      }
    }

    if (scheduledDate && !scheduledTime) {
      errors.scheduledTime = "Scheduled time is required"
    }

    if (scheduledTime && !scheduledDate) {
      errors.scheduledDate = "Scheduled date is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const engagementData = {
      ...formData,
      lastModified: new Date().toISOString().split("T")[0],
    } as Engagement

    if (drawerMode === "create") {
      addEngagement(engagementData)
    } else if (drawerMode === "edit") {
      updateEngagement(selectedEngagement!.id, engagementData)
    }

    closeDrawer()
  }

  const handleSend = () => {
    if (!validateForm()) return

    const engagementData = {
      ...formData,
      status: "Sent" as const,
      sentDate: new Date().toISOString().split("T")[0],
    } as Engagement

    if (drawerMode === "create") {
      addEngagement(engagementData)
    } else {
      updateEngagement(selectedEngagement!.id, engagementData)
    }

    closeDrawer()
  }

  const handleSchedule = () => {
    if (!validateForm()) return

    const engagementData = {
      ...formData,
      status: "Scheduled" as const,
      scheduledDate,
      scheduledTime,
    } as Engagement

    if (drawerMode === "create") {
      addEngagement(engagementData)
    } else {
      updateEngagement(selectedEngagement!.id, engagementData)
    }

    closeDrawer()
  }

  const confirmDelete = () => {
    if (selectedEngagement) {
      deleteEngagement(selectedEngagement.id)
      setShowDeleteDialog(false)
      closeDrawer()
    }
  }

  const confirmDuplicate = () => {
    if (selectedEngagement) {
      duplicateEngagement(selectedEngagement.id)
      setShowDuplicateDialog(false)
      closeDrawer()
    }
  }

  const isEventOrMeeting = formData.messageType === "Event" || formData.messageType === "Meeting"
  const isMeeting = formData.messageType === "Meeting"

  return (
    <>
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">
                {drawerMode === "create" && "Create New Engagement"}
                {drawerMode === "edit" && "Edit Engagement"}
                  {drawerMode === "view" && "View Engagement"}
                </span>
                {selectedEngagement && (
                  <span className="text-sm text-muted-foreground">
                    ID: {selectedEngagement.id}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {drawerMode === "view" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </SheetTitle>
          </SheetHeader>

            {/* Auto-save indicator */}
            {isEditing && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">Auto-saving...</span>
                </div>
                <div className="text-xs text-green-600">
                  Last saved: {formData.lastModified || "Never"}
                </div>
              </div>
            )}

          {/* Status and Priority Display */}
          {selectedEngagement && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedEngagement.status === "Draft" ? "bg-gray-100 text-gray-700" :
                    selectedEngagement.status === "Scheduled" ? "bg-red-100 text-red-700" :
                    selectedEngagement.status === "Sent" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {selectedEngagement.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedEngagement.priority === "Low" ? "bg-gray-100 text-gray-700" :
                    selectedEngagement.priority === "Normal" ? "bg-red-100 text-red-700" :
                    selectedEngagement.priority === "High" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {selectedEngagement.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Type:</span>
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                  {selectedEngagement.messageType}
                </span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* Expand/Collapse All Toggle */}
            <div className="flex justify-end">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllAccordions(true)}
                  className="text-xs"
                >
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllAccordions(false)}
                  className="text-xs"
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {activeTab === "basic" && (
              <div className="space-y-4">
                {getVisibleAccordions("basic").map((accordion) => (
                  <div key={accordion.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleAccordion("basic", accordion.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{accordion.icon}</span>
                        <span className="font-medium">{accordion.label}</span>
                      </div>
                      {isAccordionOpen("basic", accordion.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    {isAccordionOpen("basic", accordion.id) && (
                      <div className="px-4 pb-4">
                        {accordion.id === "core" && (
                          <BasicFormFields
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            validationErrors={validationErrors}
                          />
                        )}
                        {accordion.id === "event-schedule" && (
                          <EventScheduleSection
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            validationErrors={validationErrors}
                          />
                        )}
                        {accordion.id === "event-details" && (
                          <EventDetailsSection
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            validationErrors={validationErrors}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}


            {activeTab === "audience" && (
              <div className="space-y-4">
                {getVisibleAccordions("audience").map((accordion) => (
                  <div key={accordion.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleAccordion("audience", accordion.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{accordion.icon}</span>
                        <span className="font-medium">{accordion.label}</span>
                      </div>
                      {isAccordionOpen("audience", accordion.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    {isAccordionOpen("audience", accordion.id) && (
                      <div className="px-4 pb-4">
                        {accordion.id === "datetime" && isEditing && (
                          <SchedulingSection
                            scheduledDate={scheduledDate}
                            setScheduledDate={setScheduledDate}
                            scheduledTime={scheduledTime}
                            setScheduledTime={setScheduledTime}
                            isScheduleEnabled={isScheduleEnabled}
                            setIsScheduleEnabled={setIsScheduleEnabled}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                          />
                        )}
                        {accordion.id === "target" && (
                          <AdvancedTargeting
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            validationErrors={validationErrors}
                            groups={groups}
                            users={users}
                          />
                        )}
                        {accordion.id === "delivery" && (
                          <DeliverySystem
                            formData={formData}
                            setFormData={setFormData}
                            isEditing={isEditing}
                            validationErrors={validationErrors}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-4">
                {getVisibleAccordions("features").length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No features available for {formData.messageType} type</p>
                    <p className="text-sm mt-2">Features are only available for Events and Meetings</p>
                  </div>
                ) : (
                  getVisibleAccordions("features").map((accordion) => (
                    <div key={accordion.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleAccordion("features", accordion.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{accordion.icon}</span>
                          <span className="font-medium">{accordion.label}</span>
                        </div>
                        {isAccordionOpen("features", accordion.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      {isAccordionOpen("features", accordion.id) && (
                        <div className="px-4 pb-4">
                          {accordion.id === "sponsorship" && (
                            <SponsorshipSection
                              formData={formData}
                              setFormData={setFormData}
                              isEditing={isEditing}
                              validationErrors={validationErrors}
                            />
                          )}
                          {accordion.id === "rsvp" && (
                <RSVPComponent
                  engagementId={selectedEngagement?.id || "new-engagement"}
                  messageType={formData.messageType as "Event" | "Meeting"}
                  isEditing={isEditing}
                  currentUser={{ id: "current-user", name: "Current User", email: "user@example.com" }}
                  engagementData={formData}
                  onUpdateEngagement={(updates) => setFormData({ ...formData, ...updates })}
                />
            )}
                          {accordion.id === "volunteering" && (
                <VolunteerComponent
                  engagementId={selectedEngagement?.id || "new-engagement"}
                  messageType={formData.messageType as "Event" | "Meeting"}
                  isEditing={isEditing}
                  currentUser={{ id: "current-user", name: "Current User", email: "user@example.com" }}
                  engagementData={formData}
                  onUpdateEngagement={(updates) => setFormData({ ...formData, ...updates })}
                />
            )}
                          {accordion.id === "slots" && (
                <SlotManagementComponent
                  engagementId={selectedEngagement?.id || "new-engagement"}
                  messageType={formData.messageType as "Event" | "Meeting"}
                  isEditing={isEditing}
                  currentUser={{ id: "current-user", name: "Current User", email: "user@example.com" }}
                  engagementData={formData}
                  onUpdateEngagement={(updates) => setFormData({ ...formData, ...updates })}
                />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-4">
                {/* Temple Features Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleAccordion("advanced", "temple")}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🕉️</span>
                      <span className="font-medium">Temple Features</span>
                    </div>
                    {isAccordionOpen("advanced", "temple") ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {isAccordionOpen("advanced", "temple") && (
                    <div className="px-4 pb-4">
                      <TempleFeatures
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        validationErrors={validationErrors}
                      />
                    </div>
                  )}
                </div>

                {/* Delivery Confirmation Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleAccordion("advanced", "delivery-confirmation")}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📨</span>
                      <span className="font-medium">Delivery Confirmation</span>
                    </div>
                    {isAccordionOpen("advanced", "delivery-confirmation") ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {isAccordionOpen("advanced", "delivery-confirmation") && (
                    <div className="px-4 pb-4">
                      <DeliveryConfirmation
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        validationErrors={validationErrors}
                      />
                    </div>
                  )}
                </div>

                {/* Donation Integration Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleAccordion("advanced", "donation-integration")}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💰</span>
                      <span className="font-medium">Donation Integration</span>
                    </div>
                    {isAccordionOpen("advanced", "donation-integration") ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {isAccordionOpen("advanced", "donation-integration") && (
                    <div className="px-4 pb-4">
                      <DonationIntegration
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        validationErrors={validationErrors}
                      />
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-2">
              {drawerMode === "view" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDuplicateDialog(true)}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
              {isEditing && (
                <>
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={isScheduleEnabled ? handleSchedule : handleSend}
                    className="bg-green-500 hover:bg-green-600"
                    disabled={isScheduleEnabled ? (!scheduledDate || !scheduledTime) : false}
                  >
                    {isScheduleEnabled ? (
                      <Clock className="h-4 w-4 mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isScheduleEnabled ? "Schedule" : "Send Now"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Engagement
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this engagement? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Confirmation Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-red-500" />
              Duplicate Engagement
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will create a copy of the engagement with the same content and settings.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDuplicate} className="bg-blue-500 hover:bg-blue-600">
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EngagementDrawer
