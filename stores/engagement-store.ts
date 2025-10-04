import { create } from "zustand"

export interface Engagement {
  id: string
  title: string
  subject: string
  content: string
  mediaAttachments?: Array<{
    id: string
    name: string
    type: "image" | "video" | "pdf" | "excel" | "powerpoint" | "word" | "zip"
    size: number
    url: string
    thumbnail?: string
  }>
  links?: Array<{
    id: string
    url: string
    label: string
    description?: string
  }>
  engagementDate?: string
  engagementTime?: string
  status: "Draft" | "Scheduled" | "Sent" | "Failed" | "Sending"
  priority: "Low" | "Normal" | "High" | "Urgent"
  messageType: "Announcement" | "Event" | "Meeting"
  createdDate: string
  targetAudience: "all" | "groups" | "users" | "mixed"
  targetGroups: string[]
  targetUsers: string[]
  deliveryChannels: ("in-app" | "email" | "sms")[]
  attachments: Array<{
    id: string
    name: string
    type: string
    size: number
    url: string
  }>
  attachedForms: string[]
  totalRecipients: number
  deliveredCount: number
  readCount: number
  clickCount: number
  createdBy: string
  lastModified: string
  scheduledDate?: string
  sentDate?: string
  rsvpEnabled?: boolean
  rsvpDeadline?: string
  rsvpDeadlineEnabled?: boolean
  rsvpCapacity?: number
  rsvpResponses?: Array<{
    userId: string
    userName: string
    userEmail: string
    status: "attending" | "not-attending" | "maybe"
    respondedAt: string
    notes?: string
  }>
  rsvpStats?: {
    attending: number
    notAttending: number
    maybe: number
    pending: number
  }
  volunteershipEnabled?: boolean
  volunteerRoles?: Array<{
    id: string
    title: string
    description: string
    requirements?: string
    timeCommitment: string
    spotsAvailable: number
    spotsFilledCount: number
    applicationForm?: string
    formDeadline?: string
    formDeadlineEnabled?: boolean
    autoApproval?: boolean
  }>
  volunteerRequests?: Array<{
    id: string
    userId: string
    userName: string
    userEmail: string
    roleId: string
    status: "pending" | "approved" | "rejected"
    requestedAt: string
    reviewedAt?: string
    reviewedBy?: string
    message?: string
    adminNotes?: string
  }>
  volunteerStats?: {
    totalRoles: number
    totalSpots: number
    filledSpots: number
    pendingRequests: number
  }
  slotManagement?: {
    enabled: boolean
    totalSlots: number
    slotDuration: number
    startTime: string
    endTime: string
    bookingDeadline?: string
    allowWaitlist: boolean
    slotExceptions?: SlotException[]
  }
  slotBookings?: Array<{
    id: string
    userId: string
    userName: string
    userEmail: string
    slotNumber: number
    startTime: string
    endTime: string
    status: "confirmed" | "waitlisted" | "cancelled"
    bookedAt: string
    waitlistPosition?: number
    notes?: string
  }>
  slotStats?: {
    totalSlots: number
    bookedSlots: number
    availableSlots: number
    waitlistCount: number
  }
  // Temple-specific features
  pujaSponsorship?: {
    enabled: boolean
    numberOfSponsors?: number
  }
  foodSponsorship?: {
    enabled: boolean
    details?: string
    numberOfSponsors?: number
  }
  templePrasad?: boolean
  devoteeOfferings?: string[]
  seatingArrangements?: string[]
  musicChanting?: string
  dressCode?: {
    traditionalRequired?: boolean
    colorTheme?: string
  }
  photographyAllowed?: boolean
  // Location and venue details
  location?: string
  parkingDetails?: string
  // Online event options
  isOnlineEvent?: boolean
  onlineLinks?: Array<{
    id: string
    platform: string
    url: string
    meetingId?: string
    password?: string
  }>
  // New features
  deliveryConfirmation?: {
    enabled: boolean
    method: "email" | "in-app" | "both"
    deadline: string
    reminderEnabled: boolean
    reminderInterval: string
    customMessage?: string
    autoEscalation: boolean
    escalationRecipients?: string[]
    confirmedCount?: number
  }
  venueCapacity?: {
    enabled: boolean
    venueType: "temple-hall" | "community-center" | "outdoor-grounds" | "classroom" | "kitchen" | "custom"
    customVenueName?: string
    customVenueAddress?: string
    maxCapacity: number
    currentRegistrations: number
    waitlistEnabled: boolean
    waitlistCapacity: number
    overflowVenue?: string
    capacityWarnings: boolean
    registrationDeadline?: string
    venueNotes?: string
    waitlistCount?: number
  }
  parkingInfo?: {
    enabled: boolean
    parkingType: "on-site" | "street" | "public-lot" | "none"
    customParkingName?: string
    customParkingAddress?: string
    totalSpots: number
    reservedSpots: number
    handicapSpots: number
    shuttleService: boolean
    shuttleType: "temple-shuttle" | "public-transit" | "carpool" | "none"
    customShuttleName?: string
    parkingInstructions?: string
    shuttleSchedule?: string
    pickupLocations?: string[]
  }
  donationIntegration?: {
    enabled: boolean
    donationType: "general" | "event-specific" | "project" | "seva" | "annadanam" | "construction" | "education" | "medical"
    customProjectName?: string
    customProjectDescription?: string
    paymentMethods: string[]
    goalType: "none" | "fixed" | "unlimited"
    goalAmount: number
    suggestedAmounts: number[]
    customMessage?: string
    taxDeductible: boolean
    receiptEnabled: boolean
    anonymousOption: boolean
    currentAmount?: number
    donorCount?: number
  }
  calendarSync?: {
    enabled: boolean
    providers: string[]
    syncType: "one-way" | "two-way" | "manual"
    autoSync: boolean
    includeDescription: boolean
    includeLocation: boolean
    includeAttendees: boolean
    reminders: string[]
    customCalendarName?: string
    timezone: string
    lastSyncTime?: string
    syncStatus?: "not-synced" | "syncing" | "synced" | "failed"
  }
  weatherIntegration?: {
    enabled: boolean
    eventType: "outdoor" | "indoor" | "hybrid" | "weather-dependent"
    weatherDependent: boolean
    checkWeather: boolean
    weatherAlerts: string[]
    backupPlan?: string
    weatherCheckDays: number
    autoNotify: boolean
    location?: string
    temperatureUnit: "celsius" | "fahrenheit"
    forecast?: {
      condition: string
      temperature: number
      humidity?: number
      windSpeed?: number
      description?: string
    }
  }
  // Recurrence settings
  recurrence?: {
    pattern: "none" | "daily" | "weekly" | "bi-weekly" | "monthly" | "yearly" | "custom"
    selectedDays?: string[]
    interval?: number
    endDate?: string
  }
}

export interface RSVPResponse {
  userId: string
  userName: string
  userEmail: string
  status: "attending" | "not-attending" | "maybe"
  respondedAt: string
  notes?: string
}

export interface VolunteerRole {
  id: string
  title: string
  description: string
  requirements?: string
  timeCommitment: string
  spotsAvailable: number
  spotsFilledCount: number
}

export interface VolunteerRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  roleId: string
  status: "pending" | "approved" | "rejected"
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  message?: string
  adminNotes?: string
}

export interface SlotException {
  id: string
  type: "break" | "buffer" | "overflow" | "reserved" | "maintenance" | "special"
  slotNumbers: number[]
  startTime?: string
  endTime?: string
  title: string
  description?: string
  isRecurring: boolean
  recurringPattern?: "daily" | "weekly" | "monthly"
  recurringDays?: string[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
}

export interface SlotBooking {
  id: string
  userId: string
  userName: string
  userEmail: string
  slotNumber: number
  startTime: string
  endTime: string
  status: "confirmed" | "waitlisted" | "cancelled"
  bookedAt: string
  waitlistPosition?: number
  notes?: string
}

export interface AdvancedEngagementFilters {
  status: string[]
  priority: string[]
  messageType: string[]
  deliveryChannels: string[]
  createdBy: string[]
  dateRange: {
    start: string
    end: string
  }
  deliveryRateRange: {
    min: number
    max: number
  }
  readRateRange: {
    min: number
    max: number
  }
  recipientCountRange: {
    min: number
    max: number
  }
  hasAttachments: boolean | null
  hasRSVP: boolean | null
  hasVolunteering: boolean | null
  hasSlotManagement: boolean | null
  searchText: string
}

type EngagementSortableField =
  | "title"
  | "status"
  | "priority"
  | "messageType"
  | "totalRecipients"
  | "createdDate"
  | "deliveryRate"
  | "readRate"

interface EngagementStore {
  engagements: Engagement[]
  searchQuery: string
  statusFilter: string
  priorityFilter: string
  messageTypeFilter: string
  sortField: EngagementSortableField
  sortDirection: "asc" | "desc"
  viewMode: "table" | "card"
  isLoading: boolean
  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit"
  selectedEngagement: Engagement | null
  advancedFilters: AdvancedEngagementFilters
  advancedFilterOpen: boolean
  filteredEngagements: Engagement[]
  // Pagination state & helpers
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (count: number) => void
  resetPagination: () => void
  getPaginatedEngagements: () => {
    items: Engagement[]
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  updateRSVP: (engagementId: string, userId: string, response: Omit<RSVPResponse, "userId">) => void
  getRSVPStats: (engagementId: string) => { attending: number; notAttending: number; maybe: number; pending: number }
  exportRSVPList: (engagementId: string) => RSVPResponse[]
  submitVolunteerRequest: (
    engagementId: string,
    userId: string,
    request: Omit<VolunteerRequest, "id" | "userId" | "requestedAt" | "status">,
  ) => void
  reviewVolunteerRequest: (
    engagementId: string,
    requestId: string,
    status: "approved" | "rejected",
    reviewedBy: string,
    adminNotes?: string,
  ) => void
  getVolunteerStats: (engagementId: string) => {
    totalRoles: number
    totalSpots: number
    filledSpots: number
    pendingRequests: number
  }
  exportVolunteerList: (engagementId: string) => VolunteerRequest[]
  bookSlot: (
    engagementId: string,
    userId: string,
    booking: Omit<SlotBooking, "id" | "userId" | "bookedAt" | "status" | "waitlistPosition">,
  ) => { success: boolean; waitlisted: boolean; position?: number }
  cancelSlotBooking: (engagementId: string, bookingId: string) => void
  getSlotStats: (engagementId: string) => {
    totalSlots: number
    bookedSlots: number
    availableSlots: number
    waitlistCount: number
  }
  getAvailableSlots: (
    engagementId: string,
  ) => Array<{ slotNumber: number; startTime: string; endTime: string; available: boolean }>
  exportSlotBookings: (engagementId: string) => SlotBooking[]
  processWaitlist: (engagementId: string) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setPriorityFilter: (priority: string) => void
  setMessageTypeFilter: (messageType: string) => void
  setViewMode: (mode: "table" | "card") => void
  toggleSort: (field: EngagementSortableField) => void
  openDrawer: (mode: "create" | "view" | "edit", engagement?: Engagement) => void
  closeDrawer: () => void
  addEngagement: (engagement: Omit<Engagement, "id" | "createdDate" | "lastModified">) => void
  updateEngagement: (id: string, updates: Partial<Engagement>) => void
  deleteEngagement: (id: string) => void
  duplicateEngagement: (id: string) => void
  sendEngagement: (id: string) => void
  scheduleEngagement: (id: string, scheduledDate: string) => void
  setAdvancedFilters: (filters: Partial<AdvancedEngagementFilters>) => void
  resetAdvancedFilters: () => void
  setAdvancedFilterOpen: (open: boolean) => void
  exportEngagements: () => void
  importEngagements: (file: File) => Promise<void>
  checkScheduleConflicts: (date: string, time: string, duration?: number, excludeId?: string) => Array<{
    engagement: Engagement
    conflictType: "exact" | "overlap" | "adjacent"
    severity: "high" | "medium" | "low"
    message: string
  }>
  checkRecurrenceConflicts: (date: string, time: string, recurrence: Engagement['recurrence'], excludeId?: string) => Array<{
    engagement: Engagement
    conflictType: "recurrence" | "overlap" | "adjacent"
    severity: "high" | "medium" | "low"
    message: string
    affectedDates: string[]
  }>
  getConflictSummary: (conflicts: ReturnType<EngagementStore['checkScheduleConflicts']>) => {
    hasConflicts: boolean
    severity: "none" | "high" | "medium" | "low"
    summary: string
    counts?: {
      total: number
      high: number
      medium: number
      low: number
    }
  }
}

const mockEngagements: Engagement[] = [
  {
    id: "1",
    title: "Morning Puja",
    subject: "Daily morning puja ceremony",
    content: "Join us for the daily morning puja ceremony...",
    engagementDate: "2024-12-20",
    engagementTime: "06:00",
    status: "Scheduled",
    priority: "High",
    messageType: "Event",
    createdDate: "2024-01-15",
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    deliveryChannels: ["in-app", "email"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 1250,
    deliveredCount: 1200,
    readCount: 980,
    clickCount: 45,
    createdBy: "Admin User",
    lastModified: "2024-01-15",
    sentDate: "2024-01-15",
    rsvpEnabled: true,
    rsvpCapacity: 500,
    rsvpStats: { attending: 320, notAttending: 45, maybe: 80, pending: 805 },
    recurrence: {
      pattern: "daily",
      endDate: "2024-12-31"
    }
  },
  {
    id: "2",
    title: "Weekly Bhajan Session",
    subject: "Weekly devotional singing",
    content: "Join us for weekly bhajan session...",
    engagementDate: "2024-12-20",
    engagementTime: "18:00",
    status: "Scheduled",
    priority: "Normal",
    messageType: "Event",
    createdDate: "2024-01-20",
    targetAudience: "groups",
    targetGroups: ["members", "volunteers"],
    targetUsers: [],
    deliveryChannels: ["email"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 850,
    deliveredCount: 0,
    readCount: 0,
    clickCount: 0,
    createdBy: "Content Manager",
    lastModified: "2024-01-20",
    recurrence: {
      pattern: "weekly",
      selectedDays: ["thursday"]
    }
  },
  {
    id: "3",
    title: "Temple Committee Meeting",
    subject: "Monthly temple committee meeting",
    content: "Monthly meeting to discuss temple activities...",
    engagementDate: "2024-12-20",
    engagementTime: "19:00",
    status: "Scheduled",
    priority: "High",
    messageType: "Meeting",
    createdDate: "2024-01-25",
    targetAudience: "groups",
    targetGroups: ["committee"],
    targetUsers: [],
    deliveryChannels: ["email"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 25,
    deliveredCount: 0,
    readCount: 0,
    clickCount: 0,
    createdBy: "Temple Manager",
    lastModified: "2024-01-25",
    recurrence: {
      pattern: "monthly"
    }
  },
  {
    id: "4",
    title: "Evening Aarti",
    subject: "Daily evening aarti ceremony",
    content: "Join us for the daily evening aarti...",
    engagementDate: "2024-12-20",
    engagementTime: "19:30",
    status: "Scheduled",
    priority: "Normal",
    messageType: "Event",
    createdDate: "2024-01-30",
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    deliveryChannels: ["in-app"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 800,
    deliveredCount: 0,
    readCount: 0,
    clickCount: 0,
    createdBy: "Admin User",
    lastModified: "2024-01-30",
    recurrence: {
      pattern: "daily"
    }
  }
]

export const useEngagementStore = create<EngagementStore>((set, get) => ({
  engagements: mockEngagements,
  searchQuery: "",
  statusFilter: "all",
  priorityFilter: "all",
  messageTypeFilter: "all",
  sortField: "createdDate",
  sortDirection: "desc",
  viewMode: "table",
  isLoading: false,
  isDrawerOpen: false,
  drawerMode: "create",
  selectedEngagement: null,
  // Pagination defaults
  currentPage: 1,
  itemsPerPage: 10,
  advancedFilters: {
    status: [],
    priority: [],
    messageType: [],
    deliveryChannels: [],
    createdBy: [],
    dateRange: { start: "", end: "" },
    deliveryRateRange: { min: 0, max: 100 },
    readRateRange: { min: 0, max: 100 },
    recipientCountRange: { min: 0, max: 10000 },
    hasAttachments: null,
    hasRSVP: null,
    hasVolunteering: null,
    hasSlotManagement: null,
    searchText: "",
  },
  advancedFilterOpen: false,

  get filteredEngagements() {
    const state = get()
    let filtered = [...state.engagements]

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (engagement) =>
          engagement.title.toLowerCase().includes(query) ||
          engagement.subject.toLowerCase().includes(query) ||
          engagement.content.toLowerCase().includes(query) ||
          engagement.createdBy.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (state.statusFilter !== "all") {
      filtered = filtered.filter((engagement) => engagement.status === state.statusFilter)
    }

    // Apply priority filter
    if (state.priorityFilter !== "all") {
      filtered = filtered.filter((engagement) => engagement.priority === state.priorityFilter)
    }

    // Apply message type filter
    if (state.messageTypeFilter !== "all") {
      filtered = filtered.filter((engagement) => engagement.messageType === state.messageTypeFilter)
    }

    // Apply advanced filters
    const { advancedFilters } = state
    if (advancedFilters.status.length > 0) {
      filtered = filtered.filter((engagement) => advancedFilters.status.includes(engagement.status))
    }

    if (advancedFilters.priority.length > 0) {
      filtered = filtered.filter((engagement) => advancedFilters.priority.includes(engagement.priority))
    }

    if (advancedFilters.messageType.length > 0) {
      filtered = filtered.filter((engagement) => advancedFilters.messageType.includes(engagement.messageType))
    }

    if (advancedFilters.deliveryChannels.length > 0) {
      filtered = filtered.filter((engagement) =>
        engagement.deliveryChannels.some((ch) => advancedFilters.deliveryChannels.includes(ch)),
      )
    }

    if (advancedFilters.createdBy.length > 0) {
      filtered = filtered.filter((engagement) => advancedFilters.createdBy.includes(engagement.createdBy))
    }

    if (advancedFilters.dateRange.start || advancedFilters.dateRange.end) {
      const start = advancedFilters.dateRange.start ? new Date(advancedFilters.dateRange.start) : null
      const end = advancedFilters.dateRange.end ? new Date(advancedFilters.dateRange.end) : null
      filtered = filtered.filter((engagement) => {
        const created = new Date(engagement.createdDate)
        if (start && created < start) return false
        if (end && created > end) return false
        return true
      })
    }

    // Numeric ranges
    if (
      advancedFilters.recipientCountRange.min !== undefined &&
      advancedFilters.recipientCountRange.max !== undefined
    ) {
      filtered = filtered.filter(
        (e) =>
          e.totalRecipients >= advancedFilters.recipientCountRange.min &&
          e.totalRecipients <= advancedFilters.recipientCountRange.max,
      )
    }

    if (
      advancedFilters.deliveryRateRange.min !== undefined &&
      advancedFilters.deliveryRateRange.max !== undefined
    ) {
      filtered = filtered.filter((e) => {
        const rate = e.totalRecipients ? (e.deliveredCount / e.totalRecipients) * 100 : 0
        return rate >= advancedFilters.deliveryRateRange.min && rate <= advancedFilters.deliveryRateRange.max
      })
    }

    if (advancedFilters.readRateRange.min !== undefined && advancedFilters.readRateRange.max !== undefined) {
      filtered = filtered.filter((e) => {
        const rate = e.deliveredCount ? (e.readCount / e.deliveredCount) * 100 : 0
        return rate >= advancedFilters.readRateRange.min && rate <= advancedFilters.readRateRange.max
      })
    }

    if (advancedFilters.hasAttachments !== null) {
      filtered = filtered.filter((e) =>
        advancedFilters.hasAttachments ? (e.attachments && e.attachments.length > 0) : !e.attachments?.length,
      )
    }

    if (advancedFilters.hasRSVP !== null) {
      filtered = filtered.filter((e) => (advancedFilters.hasRSVP ? !!e.rsvpEnabled : !e.rsvpEnabled))
    }

    if (advancedFilters.hasVolunteering !== null) {
      filtered = filtered.filter((e) =>
        advancedFilters.hasVolunteering ? !!e.volunteershipEnabled || !!e.volunteerRoles?.length : !e.volunteershipEnabled && !e.volunteerRoles?.length,
      )
    }

    if (advancedFilters.hasSlotManagement !== null) {
      filtered = filtered.filter((e) =>
        advancedFilters.hasSlotManagement ? !!e.slotManagement?.enabled : !e.slotManagement?.enabled,
      )
    }

    if (advancedFilters.searchText) {
      const q = advancedFilters.searchText.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.createdBy.toLowerCase().includes(q),
      )
    }

    // Apply sorting (supports virtual fields: deliveryRate, readRate)
    filtered.sort((a, b) => {
      let aComparable: string | number | undefined
      let bComparable: string | number | undefined

      if (state.sortField === "deliveryRate") {
        const aRate = a.totalRecipients ? (a.deliveredCount / a.totalRecipients) : 0
        const bRate = b.totalRecipients ? (b.deliveredCount / b.totalRecipients) : 0
        aComparable = aRate
        bComparable = bRate
      } else if (state.sortField === "readRate") {
        const aRate = a.deliveredCount ? (a.readCount / a.deliveredCount) : 0
        const bRate = b.deliveredCount ? (b.readCount / b.deliveredCount) : 0
        aComparable = aRate
        bComparable = bRate
      } else if (state.sortField === "totalRecipients") {
        aComparable = a.totalRecipients
        bComparable = b.totalRecipients
      } else if (state.sortField === "createdDate") {
        // Compare by date strings in ISO-like format (YYYY-MM-DD)
        aComparable = a.createdDate
        bComparable = b.createdDate
      } else if (state.sortField === "title") {
        aComparable = a.title
        bComparable = b.title
      } else if (state.sortField === "status") {
        aComparable = a.status
        bComparable = b.status
      } else if (state.sortField === "priority") {
        aComparable = a.priority
        bComparable = b.priority
      } else if (state.sortField === "messageType") {
        aComparable = a.messageType
        bComparable = b.messageType
      }

      if (typeof aComparable === "string" && typeof bComparable === "string") {
        const comparison = aComparable.localeCompare(bComparable)
        return state.sortDirection === "asc" ? comparison : -comparison
      }

      if (typeof aComparable === "number" && typeof bComparable === "number") {
        const comparison = aComparable - bComparable
        return state.sortDirection === "asc" ? comparison : -comparison
      }

      return 0
    })

    return filtered
  },

  // Pagination controls
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (count: number) => set({ itemsPerPage: count, currentPage: 1 }),
  resetPagination: () => set({ currentPage: 1 }),

  // Compute paginated list based on current filters
  getPaginatedEngagements: () => {
    const { currentPage, itemsPerPage } = get()
    const full = get().filteredEngagements
    const totalPages = Math.max(1, Math.ceil(full.length / itemsPerPage))
    const safePage = Math.min(Math.max(1, currentPage), totalPages)
    const start = (safePage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const items = full.slice(start, end)

    return {
      items,
      currentPage: safePage,
      totalPages,
      totalItems: full.length,
      itemsPerPage,
      startIndex: full.length === 0 ? 0 : start + 1,
      endIndex: Math.min(end, full.length),
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
  setPriorityFilter: (priority: string) => set({ priorityFilter: priority }),
  setMessageTypeFilter: (messageType: string) => set({ messageTypeFilter: messageType }),
  setViewMode: (mode: "table" | "card") => set({ viewMode: mode }),

  toggleSort: (field: EngagementSortableField) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    })),

  openDrawer: (mode: "create" | "view" | "edit", engagement?: Engagement) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedEngagement: engagement || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      selectedEngagement: null,
    }),

  addEngagement: (engagement: Omit<Engagement, "id" | "createdDate" | "lastModified">) =>
    set((state) => ({
      engagements: [
        ...state.engagements,
        {
          ...engagement,
          id: Date.now().toString(),
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
        },
      ],
    })),

  updateEngagement: (id: string, updates: Partial<Engagement>) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === id
          ? { ...engagement, ...updates, lastModified: new Date().toISOString().split("T")[0] }
          : engagement,
      ),
    })),

  deleteEngagement: (id: string) =>
    set((state) => ({
      engagements: state.engagements.filter((engagement) => engagement.id !== id),
    })),

  duplicateEngagement: (id: string) =>
    set((state) => {
      const engagement = state.engagements.find((e) => e.id === id)
      if (!engagement) return state

      const duplicated = {
        ...engagement,
        id: Date.now().toString(),
        title: `${engagement.title} (Copy)`,
        status: "Draft" as const,
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        sentDate: undefined,
        deliveredCount: 0,
        readCount: 0,
        clickCount: 0,
      }

      return {
        engagements: [...state.engagements, duplicated],
      }
    }),

  sendEngagement: (id: string) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === id
          ? {
              ...engagement,
              status: "Sent" as const,
              sentDate: new Date().toISOString().split("T")[0],
              lastModified: new Date().toISOString().split("T")[0],
            }
          : engagement,
      ),
    })),

  scheduleEngagement: (id: string, scheduledDate: string) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === id
          ? {
              ...engagement,
              status: "Scheduled" as const,
              scheduledDate,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : engagement,
      ),
    })),

  setAdvancedFilters: (filters: Partial<AdvancedEngagementFilters>) =>
    set((state) => ({
      advancedFilters: { ...state.advancedFilters, ...filters },
    })),

  resetAdvancedFilters: () =>
    set({
      advancedFilters: {
        status: [],
        priority: [],
        messageType: [],
        deliveryChannels: [],
        createdBy: [],
        dateRange: { start: "", end: "" },
        deliveryRateRange: { min: 0, max: 100 },
        readRateRange: { min: 0, max: 100 },
        recipientCountRange: { min: 0, max: 10000 },
        hasAttachments: null,
        hasRSVP: null,
        hasVolunteering: null,
        hasSlotManagement: null,
        searchText: "",
      },
    }),

  setAdvancedFilterOpen: (open: boolean) => set({ advancedFilterOpen: open }),

  exportEngagements: () => {
    const engagements = get().filteredEngagements
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Subject,Status,Priority,Type,Recipients,Delivery Rate,Read Rate,Created By,Created Date\n" +
      engagements
        .map(
          (e) =>
            `"${e.title}","${e.subject}","${e.status}","${e.priority}","${e.messageType}",${e.totalRecipients},"${Math.round((e.deliveredCount / e.totalRecipients) * 100)}%","${Math.round((e.readCount / e.deliveredCount) * 100)}%","${e.createdBy}","${e.createdDate}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "engagements.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  importEngagements: async (file: File) => {
    // Implementation for importing engagements from CSV/Excel
    console.log("Import functionality to be implemented", file)
  },

  updateRSVP: (engagementId: string, userId: string, response: Omit<RSVPResponse, "userId">) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId) {
          const existingResponses = engagement.rsvpResponses || []
          const existingResponseIndex = existingResponses.findIndex((r) => r.userId === userId)

          let updatedResponses: RSVPResponse[]
          if (existingResponseIndex >= 0) {
            // Update existing response
            updatedResponses = existingResponses.map((r, index) =>
              index === existingResponseIndex ? { ...r, ...response, userId } : r,
            )
          } else {
            // Add new response
            updatedResponses = [...existingResponses, { ...response, userId }]
          }

          // Calculate updated stats
          const stats = {
            attending: updatedResponses.filter((r) => r.status === "attending").length,
            notAttending: updatedResponses.filter((r) => r.status === "not-attending").length,
            maybe: updatedResponses.filter((r) => r.status === "maybe").length,
            pending: engagement.totalRecipients - updatedResponses.length,
          }

          return {
            ...engagement,
            rsvpResponses: updatedResponses,
            rsvpStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  getRSVPStats: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    if (!engagement || !engagement.rsvpResponses) {
      return { attending: 0, notAttending: 0, maybe: 0, pending: engagement?.totalRecipients || 0 }
    }

    const responses = engagement.rsvpResponses
    return {
      attending: responses.filter((r) => r.status === "attending").length,
      notAttending: responses.filter((r) => r.status === "not-attending").length,
      maybe: responses.filter((r) => r.status === "maybe").length,
      pending: engagement.totalRecipients - responses.length,
    }
  },

  exportRSVPList: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    return engagement?.rsvpResponses || []
  },

  submitVolunteerRequest: (
    engagementId: string,
    userId: string,
    request: Omit<VolunteerRequest, "id" | "userId" | "requestedAt" | "status">,
  ) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId) {
          const existingRequests = engagement.volunteerRequests || []
          const roles = engagement.volunteerRoles || []

          // Check if user already has a request for this role
          const existingRequest = existingRequests.find((r) => r.userId === userId && r.roleId === request.roleId)
          if (existingRequest) {
            return engagement // Don't allow duplicate requests
          }

          const newRequest: VolunteerRequest = {
            ...request,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            userId,
            status: "pending",
            requestedAt: new Date().toISOString(),
          }

          let updatedRequests = [...existingRequests, newRequest]

          // Check for auto-approval
          const role = roles.find((r) => r.id === request.roleId)
          if (role?.autoApproval) {
            // Get all pending requests for this role, sorted by request time (FIFO)
            const roleRequests = updatedRequests
              .filter((r) => r.roleId === request.roleId && r.status === "pending")
              .sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime())

            // Check if form deadline has passed (if form is required)
            const now = new Date()
            let deadlinePassed = true
            
            if (role.formDeadline) {
              // If a specific deadline is set, check if it has passed
              deadlinePassed = now > new Date(role.formDeadline)
            } else if (role.applicationForm) {
              // If no specific deadline but form is required, check engagement close date
              // No explicit close date/time present in model; keep open
              deadlinePassed = false
            } else {
              // No form required, so no deadline restriction
              deadlinePassed = false
            }

            // Auto-approve requests up to the available spots, only if deadline has NOT passed
            let approvedCount = 0
            updatedRequests = updatedRequests.map((req) => {
              if (req.roleId === request.roleId && req.status === "pending") {
                const requestIndex = roleRequests.findIndex((r) => r.id === req.id)
                // Only auto-approve if deadline has not passed AND spots are available
                if (!deadlinePassed && requestIndex < role.spotsAvailable && approvedCount < role.spotsAvailable) {
                  approvedCount++
                  return {
                    ...req,
                    status: "approved" as const,
                    reviewedAt: new Date().toISOString(),
                    reviewedBy: "Auto-Approval System",
                    adminNotes: "Automatically approved based on FIFO and form completion",
                  }
                }
              }
              return req
            })

            // Update role filled count
            const approvedRequests = updatedRequests.filter((r) => r.roleId === request.roleId && r.status === "approved")
            const updatedRoles = roles.map((r) => {
              if (r.id === request.roleId) {
                return { ...r, spotsFilledCount: approvedRequests.length }
              }
              return r
            })

            // Calculate updated volunteer stats
            const stats = {
              totalRoles: updatedRoles.length,
              totalSpots: updatedRoles.reduce((sum, role) => sum + role.spotsAvailable, 0),
              filledSpots: updatedRoles.reduce((sum, role) => sum + role.spotsFilledCount, 0),
              pendingRequests: updatedRequests.filter((r) => r.status === "pending").length,
            }

            return {
              ...engagement,
              volunteerRequests: updatedRequests,
              volunteerRoles: updatedRoles,
              volunteerStats: stats,
              lastModified: new Date().toISOString().split("T")[0],
            }
          }

          // Calculate updated volunteer stats for non-auto-approval
          const stats = {
            totalRoles: roles.length,
            totalSpots: roles.reduce((sum, role) => sum + role.spotsAvailable, 0),
            filledSpots: roles.reduce((sum, role) => sum + role.spotsFilledCount, 0),
            pendingRequests: updatedRequests.filter((r) => r.status === "pending").length,
          }

          return {
            ...engagement,
            volunteerRequests: updatedRequests,
            volunteerStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  reviewVolunteerRequest: (
    engagementId: string,
    requestId: string,
    status: "approved" | "rejected",
    reviewedBy: string,
    adminNotes?: string,
  ) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId) {
          const updatedRequests =
            engagement.volunteerRequests?.map((request) => {
              if (request.id === requestId) {
                return {
                  ...request,
                  status,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy,
                  adminNotes,
                }
              }
              return request
            }) || []

          // Update role filled count if approved
          let updatedRoles = engagement.volunteerRoles || []
          if (status === "approved") {
            const request = engagement.volunteerRequests?.find((r) => r.id === requestId)
            if (request) {
              updatedRoles = updatedRoles.map((role) => {
                if (role.id === request.roleId && role.spotsFilledCount < role.spotsAvailable) {
                  return { ...role, spotsFilledCount: role.spotsFilledCount + 1 }
                }
                return role
              })
            }
          }

          // Calculate updated volunteer stats
          const stats = {
            totalRoles: updatedRoles.length,
            totalSpots: updatedRoles.reduce((sum, role) => sum + role.spotsAvailable, 0),
            filledSpots: updatedRoles.reduce((sum, role) => sum + role.spotsFilledCount, 0),
            pendingRequests: updatedRequests.filter((r) => r.status === "pending").length,
          }

          return {
            ...engagement,
            volunteerRequests: updatedRequests,
            volunteerRoles: updatedRoles,
            volunteerStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  getVolunteerStats: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    if (!engagement || !engagement.volunteerRoles) {
      return { totalRoles: 0, totalSpots: 0, filledSpots: 0, pendingRequests: 0 }
    }

    const roles = engagement.volunteerRoles
    const requests = engagement.volunteerRequests || []

    return {
      totalRoles: roles.length,
      totalSpots: roles.reduce((sum, role) => sum + role.spotsAvailable, 0),
      filledSpots: roles.reduce((sum, role) => sum + role.spotsFilledCount, 0),
      pendingRequests: requests.filter((r) => r.status === "pending").length,
    }
  },

  exportVolunteerList: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    return engagement?.volunteerRequests || []
  },

  bookSlot: (
    engagementId: string,
    userId: string,
    booking: Omit<SlotBooking, "id" | "userId" | "bookedAt" | "status" | "waitlistPosition">,
  ) => {
    let result = { success: false, waitlisted: false, position: undefined as number | undefined }

    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId && engagement.slotManagement?.enabled) {
          const existingBookings = engagement.slotBookings || []

          // Check if user already has a booking
          const existingBooking = existingBookings.find((b) => b.userId === userId && b.status !== "cancelled")
          if (existingBooking) {
            result = { success: false, waitlisted: false, position: undefined }
            return engagement
          }

          // Check if booking deadline has passed
          if (
            engagement.slotManagement.bookingDeadline &&
            new Date() > new Date(engagement.slotManagement.bookingDeadline)
          ) {
            result = { success: false, waitlisted: false, position: undefined }
            return engagement
          }

          // Check if slot is available
          const slotTaken = existingBookings.some(
            (b) => b.slotNumber === booking.slotNumber && b.status === "confirmed",
          )

          const newBooking: SlotBooking = {
            ...booking,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            userId,
            bookedAt: new Date().toISOString(),
            status: slotTaken ? "waitlisted" : "confirmed",
          }

          // If slot is taken and waitlist is allowed, add to waitlist
          if (slotTaken && engagement.slotManagement.allowWaitlist) {
            const waitlistCount = existingBookings.filter((b) => b.status === "waitlisted").length
            newBooking.waitlistPosition = waitlistCount + 1
            result = { success: true, waitlisted: true, position: newBooking.waitlistPosition }
          } else if (slotTaken) {
            result = { success: false, waitlisted: false, position: undefined }
            return engagement
          } else {
            result = { success: true, waitlisted: false, position: undefined }
          }

          const updatedBookings = [...existingBookings, newBooking]

          // Calculate updated slot stats
          const confirmedBookings = updatedBookings.filter((b) => b.status === "confirmed")
          const waitlistedBookings = updatedBookings.filter((b) => b.status === "waitlisted")

          const stats = {
            totalSlots: engagement.slotManagement.totalSlots,
            bookedSlots: confirmedBookings.length,
            availableSlots: engagement.slotManagement.totalSlots - confirmedBookings.length,
            waitlistCount: waitlistedBookings.length,
          }

          return {
            ...engagement,
            slotBookings: updatedBookings,
            slotStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))

    return result
  },

  cancelSlotBooking: (engagementId: string, bookingId: string) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId) {
          const existingBookings = engagement.slotBookings || []
          const bookingToCancel = existingBookings.find((b) => b.id === bookingId)

          if (!bookingToCancel) return engagement

          // Mark booking as cancelled
          let updatedBookings = existingBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
          )

          // If cancelled booking was confirmed, promote first waitlisted booking for same slot
          if (bookingToCancel.status === "confirmed") {
            const waitlistedForSlot = updatedBookings
              .filter((b) => b.slotNumber === bookingToCancel.slotNumber && b.status === "waitlisted")
              .sort((a, b) => new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime()) // FIFO

            if (waitlistedForSlot.length > 0) {
              const nextInLine = waitlistedForSlot[0]
              updatedBookings = updatedBookings.map((booking) =>
                booking.id === nextInLine.id
                  ? { ...booking, status: "confirmed" as const, waitlistPosition: undefined }
                  : booking,
              )

              // Update waitlist positions for remaining waitlisted bookings
              const remainingWaitlisted = waitlistedForSlot.slice(1)
              remainingWaitlisted.forEach((booking, index) => {
                updatedBookings = updatedBookings.map((b) =>
                  b.id === booking.id ? { ...b, waitlistPosition: index + 1 } : b,
                )
              })
            }
          }

          // Calculate updated slot stats
          const confirmedBookings = updatedBookings.filter((b) => b.status === "confirmed")
          const waitlistedBookings = updatedBookings.filter((b) => b.status === "waitlisted")

          const stats = {
            totalSlots: engagement.slotManagement?.totalSlots || 0,
            bookedSlots: confirmedBookings.length,
            availableSlots: (engagement.slotManagement?.totalSlots || 0) - confirmedBookings.length,
            waitlistCount: waitlistedBookings.length,
          }

          return {
            ...engagement,
            slotBookings: updatedBookings,
            slotStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  getSlotStats: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    if (!engagement || !engagement.slotManagement?.enabled) {
      return { totalSlots: 0, bookedSlots: 0, availableSlots: 0, waitlistCount: 0 }
    }

    const bookings = engagement.slotBookings || []
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
    const waitlistedBookings = bookings.filter((b) => b.status === "waitlisted")

    return {
      totalSlots: engagement.slotManagement.totalSlots,
      bookedSlots: confirmedBookings.length,
      availableSlots: engagement.slotManagement.totalSlots - confirmedBookings.length,
      waitlistCount: waitlistedBookings.length,
    }
  },

  getAvailableSlots: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    if (!engagement || !engagement.slotManagement?.enabled) {
      return []
    }

    const bookings = engagement.slotBookings || []
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
    const slotExceptions = engagement.slotManagement.slotExceptions || []
    const activeExceptions = slotExceptions.filter((ex) => ex.isActive)
    const slots = []

    for (let i = 1; i <= engagement.slotManagement.totalSlots; i++) {
      const isBooked = confirmedBookings.some((b) => b.slotNumber === i)
      const hasException = activeExceptions.some((ex) => ex.slotNumbers.includes(i))
      
      const startTime = new Date(`${engagement.scheduledDate}T${engagement.slotManagement.startTime}`)
      startTime.setMinutes(startTime.getMinutes() + (i - 1) * engagement.slotManagement.slotDuration)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + engagement.slotManagement.slotDuration)

      // Find the exception for this slot
      const slotException = activeExceptions.find((ex) => ex.slotNumbers.includes(i))

      slots.push({
        slotNumber: i,
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        available: !isBooked && !hasException,
        isBooked,
        hasException,
        exception: slotException ? {
          type: slotException.type,
          title: slotException.title,
          description: slotException.description
        } : null
      })
    }

    return slots
  },

  exportSlotBookings: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    return engagement?.slotBookings || []
  },

  // Conflict checking functions
  checkScheduleConflicts: (date: string, time: string, duration: number = 60, excludeId?: string) => {
    const state = get()
    const conflicts: Array<{
      engagement: Engagement
      conflictType: "exact" | "overlap" | "adjacent"
      severity: "high" | "medium" | "low"
      message: string
    }> = []

    const proposedStart = new Date(`${date}T${time}`)
    const proposedEnd = new Date(proposedStart.getTime() + duration * 60000)

    // Only check Events and Meetings that have date and time
    const scheduledEngagements = state.engagements.filter(
      (e) => 
        e.id !== excludeId && 
        (e.messageType === "Event" || e.messageType === "Meeting") &&
        e.engagementDate && 
        e.engagementTime &&
        e.status !== "Draft"
    )

    scheduledEngagements.forEach((engagement) => {
      if (!engagement.engagementDate || !engagement.engagementTime) return

      const engagementStart = new Date(`${engagement.engagementDate}T${engagement.engagementTime}`)
      const engagementEnd = new Date(engagementStart.getTime() + 60 * 60000) // Default 1 hour

      // Check for exact time conflicts
      if (proposedStart.getTime() === engagementStart.getTime()) {
        conflicts.push({
          engagement,
          conflictType: "exact",
          severity: "high",
          message: `Exact time conflict with "${engagement.title}" at ${engagement.engagementTime}`
        })
        return
      }

      // Check for overlapping time conflicts
      if (
        (proposedStart < engagementEnd && proposedEnd > engagementStart) ||
        (engagementStart < proposedEnd && engagementEnd > proposedStart)
      ) {
        conflicts.push({
          engagement,
          conflictType: "overlap",
          severity: "high",
          message: `Time overlap with "${engagement.title}" (${engagement.engagementTime})`
        })
        return
      }

      // Check for adjacent conflicts (within 30 minutes)
      const timeDiff = Math.abs(proposedStart.getTime() - engagementStart.getTime())
      const thirtyMinutes = 30 * 60 * 1000

      if (timeDiff <= thirtyMinutes) {
        conflicts.push({
          engagement,
          conflictType: "adjacent",
          severity: "medium",
          message: `Adjacent scheduling with "${engagement.title}" (${engagement.engagementTime})`
        })
      }
    })

    return conflicts
  },

  checkRecurrenceConflicts: (date: string, time: string, recurrence: Engagement['recurrence'], excludeId?: string) => {
    const state = get()
    const conflicts: Array<{
      engagement: Engagement
      conflictType: "recurrence" | "overlap" | "adjacent"
      severity: "high" | "medium" | "low"
      message: string
      affectedDates: string[]
    }> = []

    if (!recurrence || recurrence.pattern === "none") {
      return conflicts
    }

    const baseDate = new Date(`${date}T${time}`)
    const endDate = recurrence.endDate ? new Date(recurrence.endDate) : new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year if no end date

    // Generate all recurrence dates
    const recurrenceDates: Date[] = []
    let currentDate = new Date(baseDate)

    while (currentDate <= endDate) {
      switch (recurrence.pattern) {
        case "daily":
          recurrenceDates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
          break

        case "weekly":
          if (recurrence.selectedDays?.includes(currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())) {
            recurrenceDates.push(new Date(currentDate))
          }
          currentDate.setDate(currentDate.getDate() + 1)
          break

        case "bi-weekly":
          if (recurrence.selectedDays?.includes(currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())) {
            recurrenceDates.push(new Date(currentDate))
          }
          currentDate.setDate(currentDate.getDate() + 1)
          break

        case "monthly":
          recurrenceDates.push(new Date(currentDate))
          currentDate.setMonth(currentDate.getMonth() + 1)
          break

        case "yearly":
          recurrenceDates.push(new Date(currentDate))
          currentDate.setFullYear(currentDate.getFullYear() + 1)
          break

        case "custom":
          if (recurrence.interval) {
            recurrenceDates.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + recurrence.interval)
          }
          break
      }
    }

    // Check each recurrence date for conflicts
    const scheduledEngagements = state.engagements.filter(
      (e) => 
        e.id !== excludeId && 
        (e.messageType === "Event" || e.messageType === "Meeting") &&
        e.engagementDate && 
        e.engagementTime &&
        e.status !== "Draft"
    )

    recurrenceDates.forEach((recurDate) => {
      const dateStr = recurDate.toISOString().split('T')[0]
      
      scheduledEngagements.forEach((engagement) => {
        if (!engagement.engagementDate || !engagement.engagementTime) return

        const engagementStart = new Date(`${engagement.engagementDate}T${engagement.engagementTime}`)
        const proposedStart = new Date(`${dateStr}T${time}`)

        // Check for conflicts on this specific date
        if (proposedStart.getTime() === engagementStart.getTime()) {
          const existingConflict = conflicts.find(c => c.engagement.id === engagement.id)
          if (existingConflict) {
            existingConflict.affectedDates.push(dateStr)
          } else {
            conflicts.push({
              engagement,
              conflictType: "recurrence",
              severity: "high",
              message: `Recurrence conflict with "${engagement.title}"`,
              affectedDates: [dateStr]
            })
          }
        }
      })
    })

    return conflicts
  },

  getConflictSummary: (conflicts: ReturnType<EngagementStore['checkScheduleConflicts']>) => {
    if (conflicts.length === 0) {
      return {
        hasConflicts: false,
        severity: "none" as const,
        summary: "No conflicts detected"
      }
    }

    const highConflicts = conflicts.filter(c => c.severity === "high")
    const mediumConflicts = conflicts.filter(c => c.severity === "medium")
    const lowConflicts = conflicts.filter(c => c.severity === "low")

    let severity: "high" | "medium" | "low" = "low"
    if (highConflicts.length > 0) severity = "high"
    else if (mediumConflicts.length > 0) severity = "medium"

    const summary = `${conflicts.length} conflict${conflicts.length > 1 ? 's' : ''} detected: ${highConflicts.length} high, ${mediumConflicts.length} medium, ${lowConflicts.length} low priority`

    return {
      hasConflicts: true,
      severity,
      summary,
      counts: {
        total: conflicts.length,
        high: highConflicts.length,
        medium: mediumConflicts.length,
        low: lowConflicts.length
      }
    }
  },

  processWaitlist: (engagementId: string) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId && engagement.slotManagement?.enabled) {
          const bookings = engagement.slotBookings || []
          let updatedBookings = [...bookings]

          // Process each slot to promote waitlisted bookings
          for (let slotNum = 1; slotNum <= engagement.slotManagement.totalSlots; slotNum++) {
            const slotBookings = bookings.filter((b) => b.slotNumber === slotNum)
            const confirmedCount = slotBookings.filter((b) => b.status === "confirmed").length
            const waitlisted = slotBookings
              .filter((b) => b.status === "waitlisted")
              .sort((a, b) => new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime()) // FIFO

            // If slot has space and waitlisted bookings exist, promote the first one
            if (confirmedCount === 0 && waitlisted.length > 0) {
              const nextInLine = waitlisted[0]
              updatedBookings = updatedBookings.map((booking) =>
                booking.id === nextInLine.id
                  ? { ...booking, status: "confirmed" as const, waitlistPosition: undefined }
                  : booking,
              )

              // Update waitlist positions
              waitlisted.slice(1).forEach((booking, index) => {
                updatedBookings = updatedBookings.map((b) =>
                  b.id === booking.id ? { ...b, waitlistPosition: index + 1 } : b,
                )
              })
            }
          }

          // Calculate updated stats
          const confirmedBookings = updatedBookings.filter((b) => b.status === "confirmed")
          const waitlistedBookings = updatedBookings.filter((b) => b.status === "waitlisted")

          const stats = {
            totalSlots: engagement.slotManagement.totalSlots,
            bookedSlots: confirmedBookings.length,
            availableSlots: engagement.slotManagement.totalSlots - confirmedBookings.length,
            waitlistCount: waitlistedBookings.length,
          }

          return {
            ...engagement,
            slotBookings: updatedBookings,
            slotStats: stats,
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  // Slot Exception Management
  addSlotException: (engagementId: string, exception: Omit<SlotException, "id" | "createdAt" | "updatedAt">) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId && engagement.slotManagement?.enabled) {
          const newException: SlotException = {
            ...exception,
            id: `exception-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
          }

          const updatedExceptions = [...(engagement.slotManagement.slotExceptions || []), newException]

          return {
            ...engagement,
            slotManagement: {
              ...engagement.slotManagement,
              slotExceptions: updatedExceptions,
            },
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  updateSlotException: (engagementId: string, exceptionId: string, updates: Partial<SlotException>) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId && engagement.slotManagement?.enabled) {
          const updatedExceptions = (engagement.slotManagement.slotExceptions || []).map((exception) =>
            exception.id === exceptionId
              ? { ...exception, ...updates, updatedAt: new Date().toISOString() }
              : exception,
          )

          return {
            ...engagement,
            slotManagement: {
              ...engagement.slotManagement,
              slotExceptions: updatedExceptions,
            },
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  deleteSlotException: (engagementId: string, exceptionId: string) => {
    set((state) => ({
      engagements: state.engagements.map((engagement) => {
        if (engagement.id === engagementId && engagement.slotManagement?.enabled) {
          const updatedExceptions = (engagement.slotManagement.slotExceptions || []).filter(
            (exception) => exception.id !== exceptionId,
          )

          return {
            ...engagement,
            slotManagement: {
              ...engagement.slotManagement,
              slotExceptions: updatedExceptions,
            },
            lastModified: new Date().toISOString().split("T")[0],
          }
        }
        return engagement
      }),
    }))
  },

  getSlotExceptions: (engagementId: string) => {
    const engagement = get().engagements.find((e) => e.id === engagementId)
    return engagement?.slotManagement?.slotExceptions || []
  },
}))
