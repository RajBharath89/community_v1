import { create } from "zustand"

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isActive: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  color: string
  icon: string
  priority: number
  category: "admin" | "staff" | "volunteer" | "member" | "custom"
  restrictions?: {
    maxUsers?: number
    allowedActions?: string[]
    forbiddenActions?: string[]
    timeRestrictions?: {
      startTime?: string
      endTime?: string
      days?: string[]
    }
  }
  metadata?: {
    department?: string
    location?: string
    requirements?: string[]
    trainingRequired?: boolean
  }
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
  isSystem: boolean
}

export interface RoleStats {
  totalRoles: number
  activeRoles: number
  inactiveRoles: number
  systemRoles: number
  customRoles: number
  totalUsers: number
  averageUsersPerRole: number
}

export interface RoleFilters {
  status: string[]
  category: string[]
  permissions: string[]
  createdBy: string[]
  dateRange: {
    start: string
    end: string
  }
  userCountRange: {
    min: number
    max: number
  }
  isSystem: boolean | null
  hasRestrictions: boolean | null
  searchText: string
}

interface RolesStore {
  roles: Role[]
  permissions: Permission[]
  searchQuery: string
  statusFilter: string
  categoryFilter: string
  sortField: keyof Role
  sortDirection: "asc" | "desc"
  viewMode: "table" | "card"
  isLoading: boolean
  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit"
  selectedRole: Role | null
  advancedFilters: RoleFilters
  advancedFilterOpen: boolean
  filteredRoles: Role[]
  stats: RoleStats
  
  // Actions
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setCategoryFilter: (category: string) => void
  setViewMode: (mode: "table" | "card") => void
  toggleSort: (field: keyof Role) => void
  openDrawer: (mode: "create" | "view" | "edit", role?: Role) => void
  closeDrawer: () => void
  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt" | "userCount">) => void
  updateRole: (id: string, updates: Partial<Role>) => void
  deleteRole: (id: string) => void
  duplicateRole: (id: string) => void
  toggleRoleStatus: (id: string) => void
  exportRoles: () => void
  importRoles: (file: File) => Promise<void>
  setAdvancedFilters: (filters: Partial<RoleFilters>) => void
  resetAdvancedFilters: () => void
  setAdvancedFilterOpen: (open: boolean) => void
  getRolesByCategory: (category: string) => Role[]
  getRolesByPermission: (permission: string) => Role[]
  getStats: () => RoleStats
  refreshStats: () => void
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["*"],
    userCount: 1,
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-12-15",
    createdBy: "System",
    color: "bg-red-500",
    icon: "👑",
    priority: 1,
    category: "admin",
    restrictions: {
      maxUsers: 2,
      allowedActions: ["*"],
      timeRestrictions: {
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      }
    },
    metadata: {
      department: "IT",
      requirements: ["Technical expertise", "Security clearance"],
      trainingRequired: true
    }
  },
  {
    id: "2",
    name: "Temple Admin",
    description: "Administrative access to temple operations",
    permissions: ["users.read", "users.write", "events.read", "events.write", "donations.read", "donations.write"],
    userCount: 2,
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-12-15",
    createdBy: "System",
    color: "bg-blue-500",
    icon: "🏛️",
    priority: 2,
    category: "admin",
    restrictions: {
      maxUsers: 5,
      allowedActions: ["users.manage", "events.manage", "donations.manage"],
      timeRestrictions: {
        startTime: "06:00",
        endTime: "22:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      }
    },
    metadata: {
      department: "Administration",
      requirements: ["Temple management experience"],
      trainingRequired: true
    }
  },
  {
    id: "3",
    name: "Priest",
    description: "Spiritual leader with access to religious ceremonies and rituals",
    permissions: ["ceremonies.read", "ceremonies.write", "prayers.read", "prayers.write", "events.read"],
    userCount: 3,
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-12-15",
    createdBy: "System",
    color: "bg-purple-500",
    icon: "🕉️",
    priority: 3,
    category: "staff",
    restrictions: {
      maxUsers: 10,
      allowedActions: ["ceremonies.conduct", "prayers.lead", "events.spiritual"],
      timeRestrictions: {
        startTime: "05:00",
        endTime: "23:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      }
    },
    metadata: {
      department: "Spiritual",
      requirements: ["Religious education", "Ceremony experience"],
      trainingRequired: true
    }
  },
  {
    id: "4",
    name: "Volunteer Coordinator",
    description: "Manages volunteer activities and coordination",
    permissions: ["volunteers.read", "volunteers.write", "events.read", "events.write"],
    userCount: 2,
    isActive: true,
    isSystem: false,
    createdAt: "2024-02-15",
    updatedAt: "2024-12-15",
    createdBy: "Temple Admin",
    color: "bg-green-500",
    icon: "🤝",
    priority: 4,
    category: "volunteer",
    restrictions: {
      maxUsers: 3,
      allowedActions: ["volunteers.manage", "events.coordinate"],
      timeRestrictions: {
        startTime: "08:00",
        endTime: "20:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      }
    },
    metadata: {
      department: "Volunteer Services",
      requirements: ["Leadership skills", "Event management"],
      trainingRequired: false
    }
  },
  {
    id: "5",
    name: "Event Manager",
    description: "Manages temple events and celebrations",
    permissions: ["events.read", "events.write", "bookings.read", "bookings.write"],
    userCount: 1,
    isActive: true,
    isSystem: false,
    createdAt: "2024-03-10",
    updatedAt: "2024-12-15",
    createdBy: "Temple Admin",
    color: "bg-orange-500",
    icon: "🎉",
    priority: 5,
    category: "staff",
    restrictions: {
      maxUsers: 2,
      allowedActions: ["events.manage", "bookings.manage"],
      timeRestrictions: {
        startTime: "09:00",
        endTime: "18:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      }
    },
    metadata: {
      department: "Events",
      requirements: ["Event planning experience"],
      trainingRequired: false
    }
  },
  {
    id: "6",
    name: "Devotee",
    description: "Regular temple member with basic access",
    permissions: ["events.read", "donations.read", "profile.read", "profile.write"],
    userCount: 150,
    isActive: true,
    isSystem: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-12-15",
    createdBy: "System",
    color: "bg-pink-500",
    icon: "🙏",
    priority: 6,
    category: "member",
    restrictions: {
      maxUsers: 1000,
      allowedActions: ["events.view", "donations.make", "profile.update"],
      timeRestrictions: {
        startTime: "06:00",
        endTime: "22:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      }
    },
    metadata: {
      department: "General",
      requirements: ["Temple membership"],
      trainingRequired: false
    }
  }
]

const mockPermissions: Permission[] = [
  { id: "1", name: "Full Access", description: "Complete system access", category: "System", resource: "*", action: "*", isSystem: true },
  { id: "2", name: "User Management", description: "Manage user accounts", category: "Users", resource: "users", action: "manage", isSystem: true },
  { id: "3", name: "Event Management", description: "Manage temple events", category: "Events", resource: "events", action: "manage", isSystem: true },
  { id: "4", name: "Donation Management", description: "Manage donations", category: "Donations", resource: "donations", action: "manage", isSystem: true },
  { id: "5", name: "Volunteer Management", description: "Manage volunteers", category: "Volunteers", resource: "volunteers", action: "manage", isSystem: true },
  { id: "6", name: "Ceremony Management", description: "Manage ceremonies", category: "Ceremonies", resource: "ceremonies", action: "manage", isSystem: true },
  { id: "7", name: "Prayer Management", description: "Manage prayers", category: "Prayers", resource: "prayers", action: "manage", isSystem: true },
  { id: "8", name: "Booking Management", description: "Manage bookings", category: "Bookings", resource: "bookings", action: "manage", isSystem: true },
  { id: "9", name: "Profile Management", description: "Manage own profile", category: "Profile", resource: "profile", action: "manage", isSystem: true },
  { id: "10", name: "Read Only Access", description: "View-only access", category: "General", resource: "*", action: "read", isSystem: true }
]

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: mockRoles,
  permissions: mockPermissions,
  searchQuery: "",
  statusFilter: "all",
  categoryFilter: "all",
  sortField: "name",
  sortDirection: "asc",
  viewMode: "table",
  isLoading: false,
  isDrawerOpen: false,
  drawerMode: "create",
  selectedRole: null,
  advancedFilters: {
    status: [],
    category: [],
    permissions: [],
    createdBy: [],
    dateRange: { start: "", end: "" },
    userCountRange: { min: 0, max: 1000 },
    isSystem: null,
    hasRestrictions: null,
    searchText: ""
  },
  advancedFilterOpen: false,

  get filteredRoles() {
    const state = get()
    let filtered = [...state.roles]

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query) ||
          role.permissions.some(p => p.toLowerCase().includes(query))
      )
    }

    // Apply status filter
    if (state.statusFilter !== "all") {
      filtered = filtered.filter((role) => 
        state.statusFilter === "active" ? role.isActive : !role.isActive
      )
    }

    // Apply category filter
    if (state.categoryFilter !== "all") {
      filtered = filtered.filter((role) => role.category === state.categoryFilter)
    }

    // Apply advanced filters
    const { advancedFilters } = state
    if (advancedFilters.status.length > 0) {
      filtered = filtered.filter((role) => 
        advancedFilters.status.includes(role.isActive ? "active" : "inactive")
      )
    }

    if (advancedFilters.category.length > 0) {
      filtered = filtered.filter((role) => 
        advancedFilters.category.includes(role.category)
      )
    }

    if (advancedFilters.permissions.length > 0) {
      filtered = filtered.filter((role) => 
        advancedFilters.permissions.some(permission => 
          role.permissions.includes(permission)
        )
      )
    }

    if (advancedFilters.dateRange.start && advancedFilters.dateRange.end) {
      filtered = filtered.filter((role) => {
        const roleDate = new Date(role.createdAt)
        const startDate = new Date(advancedFilters.dateRange.start)
        const endDate = new Date(advancedFilters.dateRange.end)
        return roleDate >= startDate && roleDate <= endDate
      })
    }

    if (advancedFilters.userCountRange.min !== undefined && advancedFilters.userCountRange.max !== undefined) {
      filtered = filtered.filter((role) => 
        role.userCount >= advancedFilters.userCountRange.min && 
        role.userCount <= advancedFilters.userCountRange.max
      )
    }

    if (advancedFilters.isSystem !== null) {
      filtered = filtered.filter((role) => role.isSystem === advancedFilters.isSystem)
    }

    if (advancedFilters.hasRestrictions !== null) {
      filtered = filtered.filter((role) => 
        advancedFilters.hasRestrictions ? !!role.restrictions : !role.restrictions
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
    const roles = get().roles
    const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0)
    
    return {
      totalRoles: roles.length,
      activeRoles: roles.filter(r => r.isActive).length,
      inactiveRoles: roles.filter(r => !r.isActive).length,
      systemRoles: roles.filter(r => r.isSystem).length,
      customRoles: roles.filter(r => !r.isSystem).length,
      totalUsers,
      averageUsersPerRole: roles.length > 0 ? Math.round(totalUsers / roles.length) : 0
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
  setCategoryFilter: (category: string) => set({ categoryFilter: category }),
  setViewMode: (mode: "table" | "card") => set({ viewMode: mode }),

  toggleSort: (field: keyof Role) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    })),

  openDrawer: (mode: "create" | "view" | "edit", role?: Role) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedRole: role || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      selectedRole: null,
    }),

  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt" | "userCount">) =>
    set((state) => ({
      roles: [
        ...state.roles,
        {
          ...role,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          userCount: 0,
        },
      ],
    })),

  updateRole: (id: string, updates: Partial<Role>) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id
          ? { ...role, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
          : role,
      ),
    })),

  deleteRole: (id: string) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    })),

  duplicateRole: (id: string) =>
    set((state) => {
      const role = state.roles.find((r) => r.id === id)
      if (!role) return state

      const duplicated = {
        ...role,
        id: Date.now().toString(),
        name: `${role.name} (Copy)`,
        userCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        isSystem: false,
      }

      return {
        roles: [...state.roles, duplicated],
      }
    }),

  toggleRoleStatus: (id: string) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, isActive: !role.isActive } : role,
      ),
    })),

  exportRoles: () => {
    const roles = get().filteredRoles
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Description,Category,Status,User Count,Permissions,Created Date,Is System\n" +
      roles
        .map(
          (r) =>
            `"${r.name}","${r.description}","${r.category}","${r.isActive ? "Active" : "Inactive"}","${r.userCount}","${r.permissions.join(", ")}","${r.createdAt}","${r.isSystem ? "Yes" : "No"}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "roles.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  importRoles: async (file: File) => {
    // Implementation for importing roles from CSV/Excel
    console.log("Import functionality to be implemented", file)
  },

  setAdvancedFilters: (filters: Partial<RoleFilters>) =>
    set((state) => ({
      advancedFilters: { ...state.advancedFilters, ...filters },
    })),

  resetAdvancedFilters: () =>
    set({
      advancedFilters: {
        status: [],
        category: [],
        permissions: [],
        createdBy: [],
        dateRange: { start: "", end: "" },
        userCountRange: { min: 0, max: 1000 },
        isSystem: null,
        hasRestrictions: null,
        searchText: ""
      },
    }),

  setAdvancedFilterOpen: (open: boolean) => set({ advancedFilterOpen: open }),

  getRolesByCategory: (category: string) => {
    return get().roles.filter(r => r.category === category)
  },

  getRolesByPermission: (permission: string) => {
    return get().roles.filter(r => r.permissions.includes(permission))
  },

  getStats: () => {
    return get().stats
  },

  refreshStats: () => {
    // This would trigger a recalculation of stats
    set({})
  }
}))
