import { create } from "zustand"

export interface SupportTicket {
  id: string
  title: string
  description: string
  category: "Technical" | "General" | "Account" | "Billing" | "Feature Request" | "Bug Report"
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Pending"
  assignedTo?: string
  createdBy: string
  createdDate: string
  updatedDate: string
  resolvedDate?: string
  attachments?: string[]
  comments: TicketComment[]
  tags: string[]
  estimatedResolution?: string
  actualResolution?: string
}

export interface TicketComment {
  id: string
  content: string
  author: string
  authorRole: string
  timestamp: string
  isInternal: boolean
}

export interface AdvancedFilters {
  selectedCategories: string[]
  selectedPriorities: string[]
  selectedStatuses: string[]
  selectedAssignees: string[]
  createdDateFrom: string
  createdDateTo: string
  updatedDateFrom: string
  updatedDateTo: string
  hasAttachments: boolean | null
  hasComments: boolean | null
  tagsContains: string
  titleContains: string
  descriptionContains: string
}

interface SupportTicketState {
  tickets: SupportTicket[]
  searchTerm: string
  statusFilter: string
  priorityFilter: string
  categoryFilter: string
  viewMode: "table" | "card"
  isLoading: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedTicket: SupportTicket | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setPriorityFilter: (priority: string) => void
  setCategoryFilter: (category: string) => void
  setViewMode: (mode: "table" | "card") => void
  setTickets: (tickets: SupportTicket[]) => void
  addTicket: (ticket: SupportTicket) => void
  updateTicket: (id: string, updates: Partial<SupportTicket>) => void
  deleteTicket: (id: string) => void
  duplicateTicket: (id: string) => void
  assignTicket: (id: string, assignee: string) => void
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void
  addComment: (ticketId: string, comment: TicketComment) => void
  setLoading: (loading: boolean) => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  openDrawer: (mode: "create" | "view" | "edit", ticket?: SupportTicket) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedFilters) => void
  clearAdvancedFilters: () => void

  filteredTickets: () => SupportTicket[]
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    title: "Login issues with mobile app",
    description: "Users are experiencing login failures on the mobile application. The app crashes when trying to authenticate with Google OAuth.",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    assignedTo: "Rajesh Kumar",
    createdBy: "Priya Sharma",
    createdDate: "2024-01-15",
    updatedDate: "2024-01-16",
    attachments: ["screenshot1.png", "error_log.txt"],
    comments: [
      {
        id: "1",
        content: "Initial investigation shows OAuth configuration issue",
        author: "Rajesh Kumar",
        authorRole: "Developer",
        timestamp: "2024-01-15T10:30:00Z",
        isInternal: true,
      },
      {
        id: "2",
        content: "Thank you for reporting this. We're working on a fix.",
        author: "Rajesh Kumar",
        authorRole: "Developer",
        timestamp: "2024-01-15T14:20:00Z",
        isInternal: false,
      },
    ],
    tags: ["mobile", "oauth", "authentication"],
    estimatedResolution: "2024-01-20",
  },
  {
    id: "TKT-002",
    title: "Request for donation tracking feature",
    description: "It would be helpful to have a feature that allows devotees to track their donation history and receive receipts via email.",
    category: "Feature Request",
    priority: "Medium",
    status: "Open",
    assignedTo: "Sunita Devi",
    createdBy: "Amit Patel",
    createdDate: "2024-01-14",
    updatedDate: "2024-01-14",
    comments: [
      {
        id: "3",
        content: "This is a great suggestion! We'll add this to our roadmap.",
        author: "Sunita Devi",
        authorRole: "Product Manager",
        timestamp: "2024-01-14T16:45:00Z",
        isInternal: false,
      },
    ],
    tags: ["donations", "tracking", "receipts"],
  },
  {
    id: "TKT-003",
    title: "Account password reset not working",
    description: "When users try to reset their password, they don't receive the reset email. This is affecting multiple users.",
    category: "Account",
    priority: "Critical",
    status: "Resolved",
    assignedTo: "Rajesh Kumar",
    createdBy: "Priya Sharma",
    createdDate: "2024-01-12",
    updatedDate: "2024-01-13",
    resolvedDate: "2024-01-13",
    comments: [
      {
        id: "4",
        content: "Fixed email service configuration. Password reset emails should now work properly.",
        author: "Rajesh Kumar",
        authorRole: "Developer",
        timestamp: "2024-01-13T09:15:00Z",
        isInternal: false,
      },
    ],
    tags: ["password", "email", "authentication"],
    actualResolution: "Fixed email service configuration issue",
  },
  {
    id: "TKT-004",
    title: "Billing discrepancy in monthly report",
    description: "The monthly donation report shows incorrect totals. Some donations are being double-counted.",
    category: "Billing",
    priority: "High",
    status: "Pending",
    assignedTo: "Sunita Devi",
    createdBy: "Amit Patel",
    createdDate: "2024-01-11",
    updatedDate: "2024-01-11",
    comments: [
      {
        id: "5",
        content: "Investigating the database query that generates the monthly reports.",
        author: "Sunita Devi",
        authorRole: "Product Manager",
        timestamp: "2024-01-11T11:30:00Z",
        isInternal: true,
      },
    ],
    tags: ["billing", "reports", "donations"],
  },
  {
    id: "TKT-005",
    title: "Event calendar not syncing with Google Calendar",
    description: "The temple event calendar is not properly syncing with Google Calendar integration. Events are not appearing in users' personal calendars.",
    category: "Technical",
    priority: "Medium",
    status: "Open",
    createdBy: "Priya Sharma",
    createdDate: "2024-01-10",
    updatedDate: "2024-01-10",
    comments: [],
    tags: ["calendar", "google", "sync"],
  },
]

const defaultAdvancedFilters: AdvancedFilters = {
  selectedCategories: [],
  selectedPriorities: [],
  selectedStatuses: [],
  selectedAssignees: [],
  createdDateFrom: "",
  createdDateTo: "",
  updatedDateFrom: "",
  updatedDateTo: "",
  hasAttachments: null,
  hasComments: null,
  tagsContains: "",
  titleContains: "",
  descriptionContains: "",
}

export const useSupportTicketStore = create<SupportTicketState>((set, get) => ({
  tickets: mockTickets,
  searchTerm: "",
  statusFilter: "All Status",
  priorityFilter: "All Priority",
  categoryFilter: "All Categories",
  viewMode: "table",
  isLoading: false,

  sortField: "createdDate",
  sortDirection: "desc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedTicket: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setTickets: (tickets) => set({ tickets }),
  setLoading: (loading) => set({ isLoading: loading }),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [...state.tickets, ticket],
    })),

  updateTicket: (id, updates) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates, updatedDate: new Date().toISOString().split("T")[0] } : ticket
      ),
    })),

  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((ticket) => ticket.id !== id),
    })),

  duplicateTicket: (id) =>
    set((state) => {
      const ticketToDuplicate = state.tickets.find((ticket) => ticket.id === id)
      if (ticketToDuplicate) {
        const duplicatedTicket = {
          ...ticketToDuplicate,
          id: `TKT-${Date.now()}`,
          title: `${ticketToDuplicate.title} (Copy)`,
          status: "Open" as const,
          createdDate: new Date().toISOString().split("T")[0],
          updatedDate: new Date().toISOString().split("T")[0],
          comments: [],
          resolvedDate: undefined,
          actualResolution: undefined,
        }
        return { tickets: [...state.tickets, duplicatedTicket] }
      }
      return state
    }),

  assignTicket: (id, assignee) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, assignedTo: assignee, updatedDate: new Date().toISOString().split("T")[0] } : ticket
      ),
    })),

  updateTicketStatus: (id, status) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id === id) {
          const updates: Partial<SupportTicket> = {
            status,
            updatedDate: new Date().toISOString().split("T")[0],
          }
          if (status === "Resolved" || status === "Closed") {
            updates.resolvedDate = new Date().toISOString().split("T")[0]
          }
          return { ...ticket, ...updates }
        }
        return ticket
      }),
    })),

  addComment: (ticketId, comment) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, comments: [...ticket.comments, comment], updatedDate: new Date().toISOString().split("T")[0] }
          : ticket
      ),
    })),

  openDrawer: (mode, ticket) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedTicket: ticket || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedTicket: null,
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

  filteredTickets: () => {
    const { tickets, searchTerm, statusFilter, priorityFilter, categoryFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All Status" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "All Priority" || ticket.priority === priorityFilter
      const matchesCategory = categoryFilter === "All Categories" || ticket.category === categoryFilter

      const matchesAdvancedCategories =
        advancedFilters.selectedCategories.length === 0 || advancedFilters.selectedCategories.includes(ticket.category)

      const matchesAdvancedPriorities =
        advancedFilters.selectedPriorities.length === 0 || advancedFilters.selectedPriorities.includes(ticket.priority)

      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(ticket.status)

      const matchesAdvancedAssignees =
        advancedFilters.selectedAssignees.length === 0 ||
        (ticket.assignedTo && advancedFilters.selectedAssignees.includes(ticket.assignedTo))

      const matchesCreatedDateFrom =
        !advancedFilters.createdDateFrom || (ticket.createdDate && ticket.createdDate >= advancedFilters.createdDateFrom)

      const matchesCreatedDateTo =
        !advancedFilters.createdDateTo || (ticket.createdDate && ticket.createdDate <= advancedFilters.createdDateTo)

      const matchesUpdatedDateFrom =
        !advancedFilters.updatedDateFrom || (ticket.updatedDate && ticket.updatedDate >= advancedFilters.updatedDateFrom)

      const matchesUpdatedDateTo =
        !advancedFilters.updatedDateTo || (ticket.updatedDate && ticket.updatedDate <= advancedFilters.updatedDateTo)

      const matchesHasAttachments =
        advancedFilters.hasAttachments === null ||
        (advancedFilters.hasAttachments ? !!ticket.attachments?.length : !ticket.attachments?.length)

      const matchesHasComments =
        advancedFilters.hasComments === null ||
        (advancedFilters.hasComments ? !!ticket.comments.length : !ticket.comments.length)

      const matchesTagsContains =
        !advancedFilters.tagsContains ||
        ticket.tags.some((tag) => tag.toLowerCase().includes(advancedFilters.tagsContains.toLowerCase()))

      const matchesTitleContains =
        !advancedFilters.titleContains ||
        ticket.title.toLowerCase().includes(advancedFilters.titleContains.toLowerCase())

      const matchesDescriptionContains =
        !advancedFilters.descriptionContains ||
        ticket.description.toLowerCase().includes(advancedFilters.descriptionContains.toLowerCase())

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesAdvancedCategories &&
        matchesAdvancedPriorities &&
        matchesAdvancedStatuses &&
        matchesAdvancedAssignees &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo &&
        matchesUpdatedDateFrom &&
        matchesUpdatedDateTo &&
        matchesHasAttachments &&
        matchesHasComments &&
        matchesTagsContains &&
        matchesTitleContains &&
        matchesDescriptionContains
      )
    })

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
          const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        case "category":
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case "createdDate":
          aValue = new Date(a.createdDate).getTime()
          bValue = new Date(b.createdDate).getTime()
          break
        case "updatedDate":
          aValue = new Date(a.updatedDate).getTime()
          bValue = new Date(b.updatedDate).getTime()
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
