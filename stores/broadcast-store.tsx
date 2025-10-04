import { create } from "zustand"

export interface Broadcast {
  id: string
  title: string
  subject: string
  content: string // Rich text/HTML content
  status: "Draft" | "Scheduled" | "Sent" | "Failed"
  priority: "Low" | "Normal" | "High" | "Urgent"
  messageType: "Announcement" | "Newsletter" | "Alert"

  // Scheduling
  createdDate: string
  scheduledDate?: string
  scheduledTime?: string
  sentDate?: string

  // Recipients
  targetAudience: "all" | "groups" | "users" | "mixed"
  targetGroups: string[] // Array of group IDs
  targetUsers: string[] // Array of user IDs

  // Delivery
  deliveryChannels: ("in-app" | "email" | "sms")[]

  // Attachments
  attachments: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }[]

  // Form attachments
  attachedForms?: string[]

  // Tracking
  totalRecipients: number
  deliveredCount: number
  readCount: number
  clickCount: number

  // Meta
  createdBy: string
  lastModified: string
}

export interface AdvancedBroadcastFilters {
  selectedStatuses: string[]
  selectedPriorities: string[]
  selectedMessageTypes: string[]
  selectedDeliveryChannels: string[]
  selectedCreators: string[]
  selectedTargetAudiences: string[]

  createdDateFrom: string
  createdDateTo: string
  scheduledDateFrom: string
  scheduledDateTo: string
  sentDateFrom: string
  sentDateTo: string

  recipientCountMin: number | null
  recipientCountMax: number | null
  deliveryRateMin: number | null // Percentage
  deliveryRateMax: number | null
  readRateMin: number | null // Percentage
  readRateMax: number | null

  hasScheduledDate: boolean | null
  hasAttachments: boolean | null

  titleContains: string
  subjectContains: string
  contentContains: string
  createdByContains: string
}

interface BroadcastState {
  broadcasts: Broadcast[]
  searchTerm: string
  statusFilter: string
  priorityFilter: string
  messageTypeFilter: string
  viewMode: "table" | "card"
  isLoading: boolean
  showSensitiveFields: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedBroadcast: Broadcast | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedBroadcastFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setPriorityFilter: (priority: string) => void
  setMessageTypeFilter: (type: string) => void
  setViewMode: (mode: "table" | "card") => void
  setBroadcasts: (broadcasts: Broadcast[]) => void
  addBroadcast: (broadcast: Broadcast) => void
  updateBroadcast: (id: string, updates: Partial<Broadcast>) => void
  deleteBroadcast: (id: string) => void
  duplicateBroadcast: (id: string) => void
  sendBroadcast: (id: string) => void
  scheduleBroadcast: (id: string, scheduledDate: string, scheduledTime?: string) => void
  setLoading: (loading: boolean) => void
  toggleSensitiveFields: () => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  openDrawer: (mode: "create" | "view" | "edit", broadcast?: Broadcast) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedBroadcastFilters) => void
  clearAdvancedFilters: () => void

  filteredBroadcasts: () => Broadcast[]
}

const mockBroadcasts: Broadcast[] = [
  {
    id: "1",
    title: "Temple Festival Announcement",
    subject: "Join us for the Grand Diwali Celebration",
    content:
      "<p>Dear devotees,</p><p>We are excited to announce our <strong>Grand Diwali Celebration</strong> on October 24th, 2024. Join us for prayers, cultural programs, and community feast.</p><p>Timings: 6:00 AM - 10:00 PM</p>",
    status: "Sent",
    priority: "High",
    messageType: "Announcement",
    createdDate: "2024-10-15",
    scheduledDate: "2024-10-16",
    scheduledTime: "09:00",
    sentDate: "2024-10-16",
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    deliveryChannels: ["in-app", "email", "sms"],
    attachments: [
      {
        id: "att1",
        name: "festival-schedule.pdf",
        type: "application/pdf",
        size: 245760,
        url: "/attachments/festival-schedule.pdf",
      },
    ],
    attachedForms: ["1"],
    totalRecipients: 1250,
    deliveredCount: 1235,
    readCount: 987,
    clickCount: 234,
    createdBy: "Admin",
    lastModified: "2024-10-16",
  },
  {
    id: "2",
    title: "Weekly Newsletter",
    subject: "Temple Updates - Week of October 14th",
    content:
      "<p>This week's highlights:</p><ul><li>New volunteer orientation on Saturday</li><li>Yoga classes resume Monday</li><li>Donation drive for local charity</li></ul>",
    status: "Scheduled",
    priority: "Normal",
    messageType: "Newsletter",
    createdDate: "2024-10-14",
    scheduledDate: "2024-10-21",
    scheduledTime: "10:00",
    targetAudience: "groups",
    targetGroups: ["1", "2"], // Temple Priests, Event Volunteers
    targetUsers: [],
    deliveryChannels: ["email"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 33,
    deliveredCount: 0,
    readCount: 0,
    clickCount: 0,
    createdBy: "Priya Sharma",
    lastModified: "2024-10-14",
  },
  {
    id: "3",
    title: "Emergency Maintenance Notice",
    subject: "URGENT: Temple Closure Tomorrow",
    content:
      "<p><strong>URGENT NOTICE:</strong></p><p>Due to emergency electrical maintenance, the temple will be <strong>closed tomorrow (October 17th)</strong> from 8:00 AM to 6:00 PM.</p><p>We apologize for the inconvenience.</p>",
    status: "Sent",
    priority: "Urgent",
    messageType: "Alert",
    createdDate: "2024-10-16",
    sentDate: "2024-10-16",
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    deliveryChannels: ["in-app", "email", "sms"],
    attachments: [],
    attachedForms: [],
    totalRecipients: 1250,
    deliveredCount: 1248,
    readCount: 1156,
    clickCount: 45,
    createdBy: "Admin",
    lastModified: "2024-10-16",
  },
  {
    id: "4",
    title: "Volunteer Appreciation",
    subject: "Thank You to Our Amazing Volunteers",
    content:
      "<p>Dear Volunteers,</p><p>We want to express our heartfelt gratitude for your dedication and service to our temple community. Your efforts make a real difference!</p><p>Join us for a special appreciation dinner on October 25th.</p>",
    status: "Draft",
    priority: "Normal",
    messageType: "Announcement",
    createdDate: "2024-10-15",
    targetAudience: "groups",
    targetGroups: ["2"], // Event Volunteers
    targetUsers: [],
    deliveryChannels: ["in-app", "email"],
    attachments: [],
    attachedForms: ["2", "3"],
    totalRecipients: 25,
    deliveredCount: 0,
    readCount: 0,
    clickCount: 0,
    createdBy: "Sunita Devi",
    lastModified: "2024-10-15",
  },
]

const defaultAdvancedFilters: AdvancedBroadcastFilters = {
  selectedStatuses: [],
  selectedPriorities: [],
  selectedMessageTypes: [],
  selectedDeliveryChannels: [],
  selectedCreators: [],
  selectedTargetAudiences: [],

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

  hasScheduledDate: null,
  hasAttachments: null,

  titleContains: "",
  subjectContains: "",
  contentContains: "",
  createdByContains: "",
}

export const useBroadcastStore = create<BroadcastState>((set, get) => ({
  broadcasts: mockBroadcasts,
  searchTerm: "",
  statusFilter: "All Status",
  priorityFilter: "All Priorities",
  messageTypeFilter: "All Types",
  viewMode: "table",
  isLoading: false,
  showSensitiveFields: false,

  sortField: "createdDate",
  sortDirection: "desc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedBroadcast: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setMessageTypeFilter: (type) => set({ messageTypeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setBroadcasts: (broadcasts) => set({ broadcasts }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSensitiveFields: () => set((state) => ({ showSensitiveFields: !state.showSensitiveFields })),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addBroadcast: (broadcast) =>
    set((state) => ({
      broadcasts: [...state.broadcasts, { ...broadcast, id: Date.now().toString() }],
    })),

  updateBroadcast: (id, updates) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((broadcast) =>
        broadcast.id === id
          ? { ...broadcast, ...updates, lastModified: new Date().toISOString().split("T")[0] }
          : broadcast,
      ),
    })),

  deleteBroadcast: (id) =>
    set((state) => ({
      broadcasts: state.broadcasts.filter((broadcast) => broadcast.id !== id),
    })),

  duplicateBroadcast: (id) =>
    set((state) => {
      const broadcastToDuplicate = state.broadcasts.find((broadcast) => broadcast.id === id)
      if (broadcastToDuplicate) {
        const duplicatedBroadcast = {
          ...broadcastToDuplicate,
          id: Date.now().toString(),
          title: `${broadcastToDuplicate.title} (Copy)`,
          subject: `${broadcastToDuplicate.subject} (Copy)`,
          status: "Draft" as const,
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          scheduledDate: undefined,
          scheduledTime: undefined,
          sentDate: undefined,
          deliveredCount: 0,
          readCount: 0,
          clickCount: 0,
        }
        return { broadcasts: [...state.broadcasts, duplicatedBroadcast] }
      }
      return state
    }),

  sendBroadcast: (id) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((broadcast) =>
        broadcast.id === id
          ? {
              ...broadcast,
              status: "Sent" as const,
              sentDate: new Date().toISOString().split("T")[0],
              lastModified: new Date().toISOString().split("T")[0],
              deliveredCount:
                Math.floor(Math.random() * broadcast.totalRecipients * 0.9) +
                Math.floor(broadcast.totalRecipients * 0.1),
              readCount:
                Math.floor(Math.random() * broadcast.deliveredCount * 0.7) + Math.floor(broadcast.deliveredCount * 0.1),
              clickCount: Math.floor(Math.random() * broadcast.readCount * 0.3),
            }
          : broadcast,
      ),
    })),

  scheduleBroadcast: (id, scheduledDate, scheduledTime) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((broadcast) =>
        broadcast.id === id
          ? {
              ...broadcast,
              status: "Scheduled" as const,
              scheduledDate,
              scheduledTime,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : broadcast,
      ),
    })),

  openDrawer: (mode, broadcast) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedBroadcast: broadcast || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedBroadcast: null,
    }),

  openAdvancedFilter: () => set({ isAdvancedFilterOpen: true }),
  closeAdvancedFilter: () => set({ isAdvancedFilterOpen: false }),
  setAdvancedFilters: (filters) => set({ advancedFilters: filters }),
  clearAdvancedFilters: () => set({ advancedFilters: defaultAdvancedFilters }),

  setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),
  toggleSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    })),

  filteredBroadcasts: () => {
    const {
      broadcasts,
      searchTerm,
      statusFilter,
      priorityFilter,
      messageTypeFilter,
      advancedFilters,
      sortField,
      sortDirection,
    } = get()

    const filtered = broadcasts.filter((broadcast) => {
      const matchesSearch =
        broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broadcast.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broadcast.content.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All Status" || broadcast.status === statusFilter
      const matchesPriority = priorityFilter === "All Priorities" || broadcast.priority === priorityFilter
      const matchesMessageType = messageTypeFilter === "All Types" || broadcast.messageType === messageTypeFilter

      // Advanced filters
      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(broadcast.status)

      const matchesAdvancedPriorities =
        advancedFilters.selectedPriorities.length === 0 ||
        advancedFilters.selectedPriorities.includes(broadcast.priority)

      const matchesAdvancedMessageTypes =
        advancedFilters.selectedMessageTypes.length === 0 ||
        advancedFilters.selectedMessageTypes.includes(broadcast.messageType)

      const matchesAdvancedDeliveryChannels =
        advancedFilters.selectedDeliveryChannels.length === 0 ||
        advancedFilters.selectedDeliveryChannels.some((channel) => broadcast.deliveryChannels.includes(channel as any))

      const matchesAdvancedCreators =
        advancedFilters.selectedCreators.length === 0 || advancedFilters.selectedCreators.includes(broadcast.createdBy)

      const matchesAdvancedTargetAudiences =
        advancedFilters.selectedTargetAudiences.length === 0 ||
        advancedFilters.selectedTargetAudiences.includes(broadcast.targetAudience)

      // Date filters
      const matchesCreatedDateFrom =
        !advancedFilters.createdDateFrom || broadcast.createdDate >= advancedFilters.createdDateFrom

      const matchesCreatedDateTo =
        !advancedFilters.createdDateTo || broadcast.createdDate <= advancedFilters.createdDateTo

      const matchesScheduledDateFrom =
        !advancedFilters.scheduledDateFrom ||
        (broadcast.scheduledDate && broadcast.scheduledDate >= advancedFilters.scheduledDateFrom)

      const matchesScheduledDateTo =
        !advancedFilters.scheduledDateTo ||
        (broadcast.scheduledDate && broadcast.scheduledDate <= advancedFilters.scheduledDateTo)

      const matchesSentDateFrom =
        !advancedFilters.sentDateFrom || (broadcast.sentDate && broadcast.sentDate >= advancedFilters.sentDateFrom)

      const matchesSentDateTo =
        !advancedFilters.sentDateTo || (broadcast.sentDate && broadcast.sentDate <= advancedFilters.sentDateTo)

      // Numeric filters
      const matchesRecipientCountMin =
        advancedFilters.recipientCountMin === null || broadcast.totalRecipients >= advancedFilters.recipientCountMin

      const matchesRecipientCountMax =
        advancedFilters.recipientCountMax === null || broadcast.totalRecipients <= advancedFilters.recipientCountMax

      const deliveryRate =
        broadcast.totalRecipients > 0 ? (broadcast.deliveredCount / broadcast.totalRecipients) * 100 : 0
      const matchesDeliveryRateMin =
        advancedFilters.deliveryRateMin === null || deliveryRate >= advancedFilters.deliveryRateMin

      const matchesDeliveryRateMax =
        advancedFilters.deliveryRateMax === null || deliveryRate <= advancedFilters.deliveryRateMax

      const readRate = broadcast.deliveredCount > 0 ? (broadcast.readCount / broadcast.deliveredCount) * 100 : 0
      const matchesReadRateMin = advancedFilters.readRateMin === null || readRate >= advancedFilters.readRateMin

      const matchesReadRateMax = advancedFilters.readRateMax === null || readRate <= advancedFilters.readRateMax

      // Boolean filters
      const matchesHasScheduledDate =
        advancedFilters.hasScheduledDate === null ||
        (advancedFilters.hasScheduledDate ? !!broadcast.scheduledDate : !broadcast.scheduledDate)

      const matchesHasAttachments =
        advancedFilters.hasAttachments === null ||
        (advancedFilters.hasAttachments ? broadcast.attachments.length > 0 : broadcast.attachments.length === 0)

      // Text search filters
      const matchesTitleContains =
        !advancedFilters.titleContains ||
        broadcast.title.toLowerCase().includes(advancedFilters.titleContains.toLowerCase())

      const matchesSubjectContains =
        !advancedFilters.subjectContains ||
        broadcast.subject.toLowerCase().includes(advancedFilters.subjectContains.toLowerCase())

      const matchesContentContains =
        !advancedFilters.contentContains ||
        broadcast.content.toLowerCase().includes(advancedFilters.contentContains.toLowerCase())

      const matchesCreatedByContains =
        !advancedFilters.createdByContains ||
        broadcast.createdBy.toLowerCase().includes(advancedFilters.createdByContains.toLowerCase())

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesMessageType &&
        matchesAdvancedStatuses &&
        matchesAdvancedPriorities &&
        matchesAdvancedMessageTypes &&
        matchesAdvancedDeliveryChannels &&
        matchesAdvancedCreators &&
        matchesAdvancedTargetAudiences &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo &&
        matchesScheduledDateFrom &&
        matchesScheduledDateTo &&
        matchesSentDateFrom &&
        matchesSentDateTo &&
        matchesRecipientCountMin &&
        matchesRecipientCountMax &&
        matchesDeliveryRateMin &&
        matchesDeliveryRateMax &&
        matchesReadRateMin &&
        matchesReadRateMax &&
        matchesHasScheduledDate &&
        matchesHasAttachments &&
        matchesTitleContains &&
        matchesSubjectContains &&
        matchesContentContains &&
        matchesCreatedByContains
      )
    })

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case "priority":
          const priorityOrder = { Low: 1, Normal: 2, High: 3, Urgent: 4 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        case "messageType":
          aValue = a.messageType.toLowerCase()
          bValue = b.messageType.toLowerCase()
          break
        case "createdDate":
          aValue = new Date(a.createdDate).getTime()
          bValue = new Date(b.createdDate).getTime()
          break
        case "scheduledDate":
          aValue = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0
          bValue = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0
          break
        case "sentDate":
          aValue = a.sentDate ? new Date(a.sentDate).getTime() : 0
          bValue = b.sentDate ? new Date(b.sentDate).getTime() : 0
          break
        case "totalRecipients":
          aValue = a.totalRecipients
          bValue = b.totalRecipients
          break
        case "deliveryRate":
          aValue = a.totalRecipients > 0 ? (a.deliveredCount / a.totalRecipients) * 100 : 0
          bValue = b.totalRecipients > 0 ? (b.deliveredCount / b.totalRecipients) * 100 : 0
          break
        case "readRate":
          aValue = a.deliveredCount > 0 ? (a.readCount / a.deliveredCount) * 100 : 0
          bValue = b.deliveredCount > 0 ? (b.readCount / b.deliveredCount) * 100 : 0
          break
        case "createdBy":
          aValue = a.createdBy.toLowerCase()
          bValue = b.createdBy.toLowerCase()
          break
        default:
          aValue = new Date(a.createdDate).getTime()
          bValue = new Date(b.createdDate).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  },
}))
