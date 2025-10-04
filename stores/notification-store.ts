import { create } from "zustand"

export interface Notification {
  id: number
  title: string
  message: string
  time: string
  timestamp: Date
  unread: boolean
  type: "member" | "donation" | "event" | "volunteer" | "system" | "library"
  priority: "high" | "medium" | "low"
}

export interface AdvancedNotificationFilters {
  selectedTypes: string[]
  selectedPriorities: string[]
  selectedStatuses: string[]
  dateRange: {
    start: string
    end: string
  }
  titleContains: string
  messageContains: string
}

interface NotificationState {
  notifications: Notification[]
  searchTerm: string
  statusFilter: string
  typeFilter: string
  viewMode: "table" | "card"
  isLoading: boolean
  showSensitiveFields: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "edit" | "view" | null
  selectedNotification: Notification | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedNotificationFilters

  selectedNotifications: number[]

  // Actions
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTypeFilter: (type: string) => void
  setViewMode: (mode: "table" | "card") => void
  setNotifications: (notifications: Notification[]) => void
  setLoading: (loading: boolean) => void
  toggleSensitiveFields: () => void
  simulateLoading: () => void

  addNotification: (notification: Notification) => void
  updateNotification: (id: number, updates: Partial<Notification>) => void
  deleteNotification: (id: number) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteSelected: () => void

  openDrawer: (mode: "view", notification?: Notification) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: Partial<AdvancedNotificationFilters>) => void
  resetAdvancedFilters: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void

  filteredNotifications: () => Notification[]
  toggleNotificationSelection: (id: number) => void
  selectAllNotifications: () => void
  clearSelection: () => void
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Member Registration",
    message: "Krishna Das has registered as a new devotee",
    time: "2 minutes ago",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    unread: true,
    type: "member",
    priority: "medium"
  },
  {
    id: 2,
    title: "Donation Received",
    message: "₹5,000 donation received from Amit Patel",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    unread: true,
    type: "donation",
    priority: "high"
  },
  {
    id: 3,
    title: "Event Reminder",
    message: "Aarti ceremony starts in 30 minutes",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: false,
    type: "event",
    priority: "high"
  },
  {
    id: 4,
    title: "Volunteer Request",
    message: "New volunteer application from Priya Sharma",
    time: "1 day ago",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: false,
    type: "volunteer",
    priority: "medium"
  },
  {
    id: 5,
    title: "System Maintenance",
    message: "Scheduled maintenance completed successfully",
    time: "2 days ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: false,
    type: "system",
    priority: "low"
  },
  {
    id: 6,
    title: "Library Book Return",
    message: "Sacred Texts of Hinduism returned by Rajesh Kumar",
    time: "3 days ago",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unread: false,
    type: "library",
    priority: "low"
  }
]

const defaultAdvancedFilters: AdvancedNotificationFilters = {
  selectedTypes: [],
  selectedPriorities: [],
  selectedStatuses: [],
  dateRange: {
    start: "",
    end: ""
  },
  titleContains: "",
  messageContains: ""
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  searchTerm: "",
  statusFilter: "All Status",
  typeFilter: "All Types",
  viewMode: "table",
  isLoading: false,
  showSensitiveFields: false,

  sortField: "timestamp",
  sortDirection: "desc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedNotification: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  selectedNotifications: [],

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setNotifications: (notifications) => set({ notifications }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSensitiveFields: () => set((state) => ({ showSensitiveFields: !state.showSensitiveFields })),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  updateNotification: (id, updates) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, ...updates } : notification
      ),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, unread: false })),
    })),

  deleteSelected: () =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => !state.selectedNotifications.includes(notification.id)),
      selectedNotifications: []
    })),

  openDrawer: (mode, notification) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedNotification: notification || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedNotification: null,
    }),

  openAdvancedFilter: () => set({ isAdvancedFilterOpen: true }),
  closeAdvancedFilter: () => set({ isAdvancedFilterOpen: false }),
  setAdvancedFilters: (filters) =>
    set((state) => ({
      advancedFilters: { ...state.advancedFilters, ...filters },
    })),
  resetAdvancedFilters: () => set({ advancedFilters: defaultAdvancedFilters }),

  setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),

  filteredNotifications: () => {
    const { notifications, searchTerm, statusFilter, typeFilter, advancedFilters, sortField, sortDirection } = get()
    
    let filtered = notifications.filter((notification) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "All Status" ||
        (statusFilter === "Unread" && notification.unread) ||
        (statusFilter === "Read" && !notification.unread)

      // Type filter
      const matchesType = typeFilter === "All Types" || notification.type === typeFilter

      // Advanced filters
      const matchesAdvancedTypes = advancedFilters.selectedTypes.length === 0 || 
        advancedFilters.selectedTypes.includes(notification.type)
      
      const matchesAdvancedPriorities = advancedFilters.selectedPriorities.length === 0 || 
        advancedFilters.selectedPriorities.includes(notification.priority)
      
      const matchesAdvancedStatuses = advancedFilters.selectedStatuses.length === 0 || 
        advancedFilters.selectedStatuses.includes(notification.unread ? "unread" : "read")

      const matchesTitle = advancedFilters.titleContains === "" ||
        notification.title.toLowerCase().includes(advancedFilters.titleContains.toLowerCase())

      const matchesMessage = advancedFilters.messageContains === "" ||
        notification.message.toLowerCase().includes(advancedFilters.messageContains.toLowerCase())

      const matchesDateRange = advancedFilters.dateRange.start === "" || advancedFilters.dateRange.end === "" ||
        (notification.timestamp >= new Date(advancedFilters.dateRange.start) &&
         notification.timestamp <= new Date(advancedFilters.dateRange.end))

      return matchesSearch && matchesStatus && matchesType && matchesAdvancedTypes && 
             matchesAdvancedPriorities && matchesAdvancedStatuses && matchesTitle && 
             matchesMessage && matchesDateRange
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case "timestamp":
        default:
          aValue = a.timestamp.getTime()
          bValue = b.timestamp.getTime()
          break
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  },

  toggleNotificationSelection: (id) =>
    set((state) => ({
      selectedNotifications: state.selectedNotifications.includes(id)
        ? state.selectedNotifications.filter((notificationId) => notificationId !== id)
        : [...state.selectedNotifications, id]
    })),

  selectAllNotifications: () => {
    const { filteredNotifications } = get()
    set({ selectedNotifications: filteredNotifications().map(n => n.id) })
  },

  clearSelection: () => set({ selectedNotifications: [] })
}))
