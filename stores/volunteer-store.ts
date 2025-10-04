import { create } from "zustand"

export interface VolunteerApplication {
  id: string
  engagementId: string
  engagementTitle: string
  engagementDate: string
  engagementTime: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  roleId: string
  roleTitle: string
  roleDescription: string
  status: "pending" | "approved" | "rejected"
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  message?: string
  adminNotes?: string
  experience?: string
  availability?: string
  skills?: string[]
  previousVolunteering?: boolean
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalConditions?: string
  dietaryRestrictions?: string
  transportation?: "own" | "public" | "need-ride"
  tshirtSize?: string
  languages?: string[]
  motivation?: string
  references?: Array<{
    name: string
    phone: string
    relationship: string
  }>
}

export interface VolunteerRole {
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
  skills?: string[]
  ageRestriction?: {
    min?: number
    max?: number
  }
  physicalRequirements?: string[]
  trainingRequired?: boolean
  trainingDetails?: string
}

export interface VolunteerStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalRoles: number
  totalSpots: number
  filledSpots: number
  availableSpots: number
  upcomingEvents: number
  activeVolunteers: number
}

export interface VolunteerFilters {
  status: string[]
  engagementType: string[]
  roleType: string[]
  dateRange: {
    start: string
    end: string
  }
  searchText: string
  hasExperience: boolean | null
  hasReferences: boolean | null
  transportation: string[]
  skills: string[]
}

interface VolunteerStore {
  applications: VolunteerApplication[]
  searchQuery: string
  statusFilter: string
  engagementFilter: string
  roleFilter: string
  sortField: keyof VolunteerApplication
  sortDirection: "asc" | "desc"
  viewMode: "table" | "card"
  isLoading: boolean
  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit"
  selectedApplication: VolunteerApplication | null
  advancedFilters: VolunteerFilters
  advancedFilterOpen: boolean
  filteredApplications: VolunteerApplication[]
  stats: VolunteerStats
  
  // Pagination state
  currentPage: number
  itemsPerPage: number
  
  // Actions
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setEngagementFilter: (engagement: string) => void
  setRoleFilter: (role: string) => void
  setViewMode: (mode: "table" | "card") => void
  toggleSort: (field: keyof VolunteerApplication) => void
  openDrawer: (mode: "create" | "view" | "edit", application?: VolunteerApplication) => void
  closeDrawer: () => void
  approveApplication: (applicationId: string, adminNotes?: string) => void
  rejectApplication: (applicationId: string, adminNotes?: string) => void
  bulkApprove: (applicationIds: string[]) => void
  bulkReject: (applicationIds: string[]) => void
  updateApplication: (id: string, updates: Partial<VolunteerApplication>) => void
  deleteApplication: (id: string) => void
  exportApplications: () => void
  importApplications: (file: File) => Promise<void>
  setAdvancedFilters: (filters: Partial<VolunteerFilters>) => void
  resetAdvancedFilters: () => void
  setAdvancedFilterOpen: (open: boolean) => void
  getApplicationsByEngagement: (engagementId: string) => VolunteerApplication[]
  getApplicationsByUser: (userId: string) => VolunteerApplication[]
  getApplicationsByRole: (roleId: string) => VolunteerApplication[]
  getStats: () => VolunteerStats
  refreshStats: () => void
  
  // Pagination actions
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  getPaginatedApplications: () => VolunteerApplication[]
  getTotalItems: () => number
}

const mockApplications: VolunteerApplication[] = [
  {
    id: "1",
    engagementId: "1",
    engagementTitle: "Morning Puja",
    engagementDate: "2024-12-20",
    engagementTime: "06:00",
    userId: "user1",
    userName: "Priya Sharma",
    userEmail: "priya.sharma@email.com",
    userPhone: "+91 98765 43210",
    roleId: "role-1",
    roleTitle: "Event Coordinator",
    roleDescription: "Help coordinate the event activities",
    status: "pending",
    requestedAt: "2024-12-15T10:30:00Z",
    experience: "I have been volunteering at temple events for 2 years",
    availability: "Available for morning shifts",
    skills: ["Organization", "Communication", "Leadership"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Raj Sharma",
      phone: "+91 98765 43211",
      relationship: "Father"
    },
    transportation: "own",
    tshirtSize: "M",
    languages: ["Hindi", "English", "Gujarati"],
    motivation: "I want to serve the community and help organize spiritual events",
    references: [
      {
        name: "Suresh Patel",
        phone: "+91 98765 43212",
        relationship: "Temple Trustee"
      }
    ]
  },
  {
    id: "2",
    engagementId: "1",
    engagementTitle: "Morning Puja",
    engagementDate: "2024-12-20",
    engagementTime: "06:00",
    userId: "user2",
    userName: "Amit Kumar",
    userEmail: "amit.kumar@email.com",
    userPhone: "+91 98765 43213",
    roleId: "role-2",
    roleTitle: "Registration Assistant",
    roleDescription: "Help with check-in and registration",
    status: "approved",
    requestedAt: "2024-12-14T14:20:00Z",
    reviewedAt: "2024-12-16T09:15:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Excellent communication skills and previous experience",
    experience: "3 years of customer service experience",
    availability: "Available for full day",
    skills: ["Customer Service", "Registration", "Data Entry"],
    previousVolunteering: false,
    emergencyContact: {
      name: "Sunita Kumar",
      phone: "+91 98765 43214",
      relationship: "Wife"
    },
    transportation: "public",
    tshirtSize: "L",
    languages: ["Hindi", "English"],
    motivation: "Want to contribute to temple activities and learn more about our culture"
  },
  {
    id: "3",
    engagementId: "2",
    engagementTitle: "Weekly Bhajan Session",
    engagementDate: "2024-12-20",
    engagementTime: "18:00",
    userId: "user3",
    userName: "Kavita Singh",
    userEmail: "kavita.singh@email.com",
    userPhone: "+91 98765 43215",
    roleId: "role-1",
    roleTitle: "Event Coordinator",
    roleDescription: "Help coordinate the event activities",
    status: "rejected",
    requestedAt: "2024-12-13T16:45:00Z",
    reviewedAt: "2024-12-15T11:30:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Role already filled, but we'll keep your application for future events",
    experience: "5 years of event management",
    availability: "Evening shifts preferred",
    skills: ["Event Management", "Team Leadership", "Problem Solving"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Vikram Singh",
      phone: "+91 98765 43216",
      relationship: "Husband"
    },
    transportation: "own",
    tshirtSize: "S",
    languages: ["Hindi", "English", "Punjabi"],
    motivation: "Passionate about organizing spiritual gatherings and community service"
  },
  {
    id: "4",
    engagementId: "3",
    engagementTitle: "Temple Committee Meeting",
    engagementDate: "2024-12-20",
    engagementTime: "19:00",
    userId: "user4",
    userName: "Rajesh Patel",
    userEmail: "rajesh.patel@email.com",
    userPhone: "+91 98765 43217",
    roleId: "role-2",
    roleTitle: "Registration Assistant",
    roleDescription: "Help with check-in and registration",
    status: "pending",
    requestedAt: "2024-12-16T08:15:00Z",
    experience: "2 years of administrative work",
    availability: "Available for evening meetings",
    skills: ["Administration", "Record Keeping", "Communication"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Meera Patel",
      phone: "+91 98765 43218",
      relationship: "Sister"
    },
    transportation: "own",
    tshirtSize: "XL",
    languages: ["Hindi", "English", "Gujarati"],
    motivation: "Want to be more involved in temple administration and decision making"
  },
  // Additional mock data for pagination testing
  {
    id: "5",
    engagementId: "1",
    engagementTitle: "Morning Puja",
    engagementDate: "2024-12-21",
    engagementTime: "06:00",
    userId: "user5",
    userName: "Suresh Gupta",
    userEmail: "suresh.gupta@email.com",
    userPhone: "+91 98765 43219",
    roleId: "role-3",
    roleTitle: "Cleanup Assistant",
    roleDescription: "Help with post-event cleanup",
    status: "approved",
    requestedAt: "2024-12-17T09:00:00Z",
    reviewedAt: "2024-12-18T10:00:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Reliable and punctual",
    experience: "1 year of community service",
    availability: "Available for morning shifts",
    skills: ["Cleaning", "Organization"],
    previousVolunteering: false,
    emergencyContact: {
      name: "Rekha Gupta",
      phone: "+91 98765 43220",
      relationship: "Wife"
    },
    transportation: "public",
    tshirtSize: "M",
    languages: ["Hindi", "English"],
    motivation: "Want to contribute to temple maintenance"
  },
  {
    id: "6",
    engagementId: "2",
    engagementTitle: "Weekly Bhajan Session",
    engagementDate: "2024-12-21",
    engagementTime: "18:00",
    userId: "user6",
    userName: "Meera Joshi",
    userEmail: "meera.joshi@email.com",
    userPhone: "+91 98765 43221",
    roleId: "role-4",
    roleTitle: "Music Coordinator",
    roleDescription: "Help coordinate musical arrangements",
    status: "pending",
    requestedAt: "2024-12-18T14:30:00Z",
    experience: "3 years of classical music training",
    availability: "Available for evening sessions",
    skills: ["Music", "Coordination", "Classical Singing"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Vikram Joshi",
      phone: "+91 98765 43222",
      relationship: "Husband"
    },
    transportation: "own",
    tshirtSize: "S",
    languages: ["Hindi", "English", "Sanskrit"],
    motivation: "Passionate about devotional music and bhajans"
  },
  {
    id: "7",
    engagementId: "4",
    engagementTitle: "Community Service Day",
    engagementDate: "2024-12-22",
    engagementTime: "09:00",
    userId: "user7",
    userName: "Arjun Reddy",
    userEmail: "arjun.reddy@email.com",
    userPhone: "+91 98765 43223",
    roleId: "role-5",
    roleTitle: "Food Distribution Helper",
    roleDescription: "Help distribute food to community members",
    status: "approved",
    requestedAt: "2024-12-19T11:00:00Z",
    reviewedAt: "2024-12-20T12:00:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Great with people and organized",
    experience: "2 years of community outreach",
    availability: "Available for full day",
    skills: ["Community Service", "Food Handling", "Communication"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Lakshmi Reddy",
      phone: "+91 98765 43224",
      relationship: "Mother"
    },
    transportation: "own",
    tshirtSize: "L",
    languages: ["Hindi", "English", "Telugu"],
    motivation: "Want to serve the community through food distribution"
  },
  {
    id: "8",
    engagementId: "1",
    engagementTitle: "Morning Puja",
    engagementDate: "2024-12-22",
    engagementTime: "06:00",
    userId: "user8",
    userName: "Deepak Verma",
    userEmail: "deepak.verma@email.com",
    userPhone: "+91 98765 43225",
    roleId: "role-6",
    roleTitle: "Security Assistant",
    roleDescription: "Help with crowd management and security",
    status: "rejected",
    requestedAt: "2024-12-20T08:00:00Z",
    reviewedAt: "2024-12-21T09:00:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Position filled, but will consider for future events",
    experience: "4 years of security work",
    availability: "Available for early morning shifts",
    skills: ["Security", "Crowd Management", "First Aid"],
    previousVolunteering: false,
    emergencyContact: {
      name: "Sunita Verma",
      phone: "+91 98765 43226",
      relationship: "Sister"
    },
    transportation: "own",
    tshirtSize: "XL",
    languages: ["Hindi", "English"],
    motivation: "Want to ensure safety and security at temple events"
  },
  {
    id: "9",
    engagementId: "3",
    engagementTitle: "Temple Committee Meeting",
    engagementDate: "2024-12-23",
    engagementTime: "19:00",
    userId: "user9",
    userName: "Anita Desai",
    userEmail: "anita.desai@email.com",
    userPhone: "+91 98765 43227",
    roleId: "role-7",
    roleTitle: "Documentation Assistant",
    roleDescription: "Help with meeting minutes and documentation",
    status: "pending",
    requestedAt: "2024-12-21T15:00:00Z",
    experience: "5 years of administrative and documentation work",
    availability: "Available for evening meetings",
    skills: ["Documentation", "Note Taking", "Administration"],
    previousVolunteering: true,
    emergencyContact: {
      name: "Ravi Desai",
      phone: "+91 98765 43228",
      relationship: "Husband"
    },
    transportation: "public",
    tshirtSize: "M",
    languages: ["Hindi", "English", "Gujarati"],
    motivation: "Want to contribute to temple administration through proper documentation"
  },
  {
    id: "10",
    engagementId: "2",
    engagementTitle: "Weekly Bhajan Session",
    engagementDate: "2024-12-23",
    engagementTime: "18:00",
    userId: "user10",
    userName: "Rohit Agarwal",
    userEmail: "rohit.agarwal@email.com",
    userPhone: "+91 98765 43229",
    roleId: "role-8",
    roleTitle: "Sound Technician",
    roleDescription: "Help with sound system setup and management",
    status: "approved",
    requestedAt: "2024-12-22T10:00:00Z",
    reviewedAt: "2024-12-23T11:00:00Z",
    reviewedBy: "Admin User",
    adminNotes: "Technical expertise in sound systems",
    experience: "6 years of audio engineering",
    availability: "Available for evening sessions",
    skills: ["Audio Engineering", "Sound Systems", "Technical Support"],
    previousVolunteering: false,
    emergencyContact: {
      name: "Priya Agarwal",
      phone: "+91 98765 43230",
      relationship: "Wife"
    },
    transportation: "own",
    tshirtSize: "L",
    languages: ["Hindi", "English"],
    motivation: "Want to use my technical skills to enhance the spiritual experience"
  }
]

export const useVolunteerStore = create<VolunteerStore>((set, get) => ({
  applications: mockApplications,
  searchQuery: "",
  statusFilter: "all",
  engagementFilter: "all",
  roleFilter: "all",
  sortField: "requestedAt",
  sortDirection: "desc",
  viewMode: "table",
  isLoading: false,
  isDrawerOpen: false,
  drawerMode: "create",
  selectedApplication: null,
  advancedFilters: {
    status: [],
    engagementType: [],
    roleType: [],
    dateRange: { start: "", end: "" },
    searchText: "",
    hasExperience: null,
    hasReferences: null,
    transportation: [],
    skills: []
  },
  advancedFilterOpen: false,
  
  // Pagination state
  currentPage: 1,
  itemsPerPage: 10,

  get filteredApplications() {
    const state = get()
    let filtered = [...state.applications]

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (application) =>
          application.userName.toLowerCase().includes(query) ||
          application.userEmail.toLowerCase().includes(query) ||
          application.engagementTitle.toLowerCase().includes(query) ||
          application.roleTitle.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (state.statusFilter !== "all") {
      filtered = filtered.filter((application) => application.status === state.statusFilter)
    }

    // Apply engagement filter
    if (state.engagementFilter !== "all") {
      filtered = filtered.filter((application) => application.engagementId === state.engagementFilter)
    }

    // Apply role filter
    if (state.roleFilter !== "all") {
      filtered = filtered.filter((application) => application.roleId === state.roleFilter)
    }

    // Apply advanced filters
    const { advancedFilters } = state
    if (advancedFilters.status.length > 0) {
      filtered = filtered.filter((application) => advancedFilters.status.includes(application.status))
    }

    if (advancedFilters.engagementType.length > 0) {
      filtered = filtered.filter((application) => 
        advancedFilters.engagementType.includes(application.engagementId)
      )
    }

    if (advancedFilters.roleType.length > 0) {
      filtered = filtered.filter((application) => 
        advancedFilters.roleType.includes(application.roleId)
      )
    }

    if (advancedFilters.dateRange.start && advancedFilters.dateRange.end) {
      filtered = filtered.filter((application) => {
        const appDate = new Date(application.engagementDate)
        const startDate = new Date(advancedFilters.dateRange.start)
        const endDate = new Date(advancedFilters.dateRange.end)
        return appDate >= startDate && appDate <= endDate
      })
    }

    if (advancedFilters.hasExperience !== null) {
      filtered = filtered.filter((application) => 
        advancedFilters.hasExperience ? !!application.experience : !application.experience
      )
    }

    if (advancedFilters.hasReferences !== null) {
      filtered = filtered.filter((application) => 
        advancedFilters.hasReferences ? !!application.references?.length : !application.references?.length
      )
    }

    if (advancedFilters.transportation.length > 0) {
      filtered = filtered.filter((application) => 
        advancedFilters.transportation.includes(application.transportation || "")
      )
    }

    if (advancedFilters.skills.length > 0) {
      filtered = filtered.filter((application) => 
        application.skills?.some(skill => advancedFilters.skills.includes(skill))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[state.sortField]
      const bValue = b[state.sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return state.sortDirection === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue
        return state.sortDirection === "asc" ? comparison : -comparison
      }

      return 0
    })

    return filtered
  },

  get stats() {
    const applications = get().applications
    const now = new Date()
    
    return {
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === "pending").length,
      approvedApplications: applications.filter(a => a.status === "approved").length,
      rejectedApplications: applications.filter(a => a.status === "rejected").length,
      totalRoles: new Set(applications.map(a => a.roleId)).size,
      totalSpots: applications.reduce((sum, a) => {
        // This would need to be calculated from engagement data
        return sum + 1
      }, 0),
      filledSpots: applications.filter(a => a.status === "approved").length,
      availableSpots: 0, // This would need to be calculated from engagement data
      upcomingEvents: applications.filter(a => new Date(a.engagementDate) > now).length,
      activeVolunteers: applications.filter(a => a.status === "approved").length
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
  setEngagementFilter: (engagement: string) => set({ engagementFilter: engagement }),
  setRoleFilter: (role: string) => set({ roleFilter: role }),
  setViewMode: (mode: "table" | "card") => set({ viewMode: mode }),

  toggleSort: (field: keyof VolunteerApplication) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    })),

  openDrawer: (mode: "create" | "view" | "edit", application?: VolunteerApplication) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedApplication: application || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      selectedApplication: null,
    }),

  approveApplication: (applicationId: string, adminNotes?: string) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: "approved" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User", // This should come from auth context
              adminNotes,
            }
          : application,
      ),
    })),

  rejectApplication: (applicationId: string, adminNotes?: string) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: "rejected" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User", // This should come from auth context
              adminNotes,
            }
          : application,
      ),
    })),

  bulkApprove: (applicationIds: string[]) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        applicationIds.includes(application.id)
          ? {
              ...application,
              status: "approved" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User",
            }
          : application,
      ),
    })),

  bulkReject: (applicationIds: string[]) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        applicationIds.includes(application.id)
          ? {
              ...application,
              status: "rejected" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User",
            }
          : application,
      ),
    })),

  updateApplication: (id: string, updates: Partial<VolunteerApplication>) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id ? { ...application, ...updates } : application,
      ),
    })),

  deleteApplication: (id: string) =>
    set((state) => ({
      applications: state.applications.filter((application) => application.id !== id),
    })),

  exportApplications: () => {
    const applications = get().filteredApplications
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Volunteer Name,Email,Phone,Engagement,Role,Status,Requested Date,Experience,Skills,Transportation\n" +
      applications
        .map(
          (a) =>
            `"${a.userName}","${a.userEmail}","${a.userPhone || ""}","${a.engagementTitle}","${a.roleTitle}","${a.status}","${a.requestedAt}","${a.experience || ""}","${a.skills?.join(", ") || ""}","${a.transportation || ""}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "volunteer-applications.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  importApplications: async (file: File) => {
    // Implementation for importing applications from CSV/Excel
    console.log("Import functionality to be implemented", file)
  },

  setAdvancedFilters: (filters: Partial<VolunteerFilters>) =>
    set((state) => ({
      advancedFilters: { ...state.advancedFilters, ...filters },
    })),

  resetAdvancedFilters: () =>
    set({
      advancedFilters: {
        status: [],
        engagementType: [],
        roleType: [],
        dateRange: { start: "", end: "" },
        searchText: "",
        hasExperience: null,
        hasReferences: null,
        transportation: [],
        skills: []
      },
    }),

  setAdvancedFilterOpen: (open: boolean) => set({ advancedFilterOpen: open }),

  getApplicationsByEngagement: (engagementId: string) => {
    return get().applications.filter(a => a.engagementId === engagementId)
  },

  getApplicationsByUser: (userId: string) => {
    return get().applications.filter(a => a.userId === userId)
  },

  getApplicationsByRole: (roleId: string) => {
    return get().applications.filter(a => a.roleId === roleId)
  },

  getStats: () => {
    return get().stats
  },

  refreshStats: () => {
    // This would trigger a recalculation of stats
    set({})
  },

  // Pagination actions
  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  setItemsPerPage: (itemsPerPage: number) => set({ 
    itemsPerPage, 
    currentPage: 1 // Reset to first page when changing items per page
  }),
  
  goToNextPage: () => {
    const state = get()
    const totalItems = state.filteredApplications.length
    const totalPages = Math.ceil(totalItems / state.itemsPerPage)
    if (state.currentPage < totalPages) {
      set({ currentPage: state.currentPage + 1 })
    }
  },
  
  goToPreviousPage: () => {
    const state = get()
    if (state.currentPage > 1) {
      set({ currentPage: state.currentPage - 1 })
    }
  },
  
  goToFirstPage: () => set({ currentPage: 1 }),
  
  goToLastPage: () => {
    const state = get()
    const totalItems = state.filteredApplications.length
    const totalPages = Math.ceil(totalItems / state.itemsPerPage)
    set({ currentPage: totalPages })
  },
  
  getPaginatedApplications: () => {
    const state = get()
    const filtered = state.filteredApplications
    const startIndex = (state.currentPage - 1) * state.itemsPerPage
    const endIndex = startIndex + state.itemsPerPage
    return filtered.slice(startIndex, endIndex)
  },

  getTotalItems: () => {
    const state = get()
    return state.filteredApplications.length
  }
}))
