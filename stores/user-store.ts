import { create } from "zustand"

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Inactive" | "Pending"
  joinDate: string
  avatar?: string
  phone: string // Made mandatory
  alternateMobile?: string // Added new field
  dateOfBirth?: string // Added new field
  gender?: string // Added new field
  address?: string
  city?: string // Added new field
  state?: string // Added new field
  zipcode?: string // Added new field
  country?: string // Added new field
  department?: string
  organization?: string // Added new field
  nukiCode?: string
}

export interface AdvancedFilters {
  selectedRoles: string[]
  selectedStatuses: string[]
  selectedDepartments: string[]
  selectedOrganizations: string[] // Added organization filter
  selectedGenders: string[] // Added gender filter
  selectedCountries: string[] // Added country filter
  joinDateFrom: string
  joinDateTo: string
  hasPhone: boolean | null
  hasAlternateMobile: boolean | null // Added alternate mobile filter
  hasAddress: boolean | null
  hasNukiCode: boolean | null
  phoneContains: string
  alternateMobileContains: string // Added alternate mobile search
  addressContains: string
  nukiCodeContains: string
  cityContains: string // Added city search
  organizationContains: string // Added organization search
}

interface UserState {
  users: User[]
  searchTerm: string
  statusFilter: string
  roleFilter: string
  viewMode: "table" | "card"
  isLoading: boolean
  showSensitiveFields: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedUser: User | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setRoleFilter: (role: string) => void
  setViewMode: (mode: "table" | "card") => void
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  duplicateUser: (id: string) => void
  promoteUser: (id: string, newRole: string) => void
  demoteUser: (id: string, newRole: string) => void
  toggleUserStatus: (id: string) => void
  setLoading: (loading: boolean) => void
  toggleSensitiveFields: () => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  openDrawer: (mode: "create" | "view" | "edit", user?: User) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedFilters) => void
  clearAdvancedFilters: () => void

  filteredUsers: () => User[]
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@temple.org",
    role: "Priest",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "/sai-baba-peaceful-face-with-orange-turban.png",
    phone: "+91 98765 43210",
    alternateMobile: "+91 87654 32109", // Added alternate mobile
    dateOfBirth: "1985-03-15", // Added date of birth
    gender: "Male", // Added gender
    address: "123 Temple Street, Mumbai",
    city: "Mumbai", // Added city
    state: "Netherlands", // Added state
    zipcode: "400001", // Added zipcode
    country: "India", // Added country
    department: "Religious Affairs",
    organization: "Shree Ram Temple Trust", // Added organization
    nukiCode: "NK001-PRIEST",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@temple.org",
    role: "Volunteer",
    status: "Active",
    joinDate: "2023-02-20",
    phone: "+91 87654 32109",
    alternateMobile: "+91 76543 21098",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    address: "456 Devotee Lane, Delhi",
    city: "Delhi",
    state: "Delhi",
    zipcode: "110001",
    country: "India",
    department: "Community Service",
    organization: "Shree Ram Temple Trust",
    nukiCode: "NK002-VOL",
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@temple.org",
    role: "Trustee",
    status: "Inactive",
    joinDate: "2022-12-10",
    phone: "+91 76543 21098",
    dateOfBirth: "1975-11-08",
    gender: "Male",
    address: "789 Sacred Road, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    zipcode: "380001",
    country: "India",
    department: "Administration",
    organization: "Shree Ram Temple Trust",
    nukiCode: "NK003-TRUST",
  },
  {
    id: "4",
    name: "Sunita Devi",
    email: "sunita@temple.org",
    role: "Admin",
    status: "Active",
    joinDate: "2023-03-05",
    phone: "+91 65432 10987",
    alternateMobile: "+91 54321 09876",
    dateOfBirth: "1982-05-12",
    gender: "Female",
    address: "321 Divine Avenue, Pune",
    city: "Pune",
    state: "Netherlands",
    zipcode: "411001",
    country: "India",
    department: "Management",
    organization: "Shree Ram Temple Trust",
    nukiCode: "NK004-ADMIN",
  },
]

const defaultAdvancedFilters: AdvancedFilters = {
  selectedRoles: [],
  selectedStatuses: [],
  selectedDepartments: [],
  selectedOrganizations: [], // Added organization filter
  selectedGenders: [], // Added gender filter
  selectedCountries: [], // Added country filter
  joinDateFrom: "",
  joinDateTo: "",
  hasPhone: null,
  hasAlternateMobile: null, // Added alternate mobile filter
  hasAddress: null,
  hasNukiCode: null,
  phoneContains: "",
  alternateMobileContains: "", // Added alternate mobile search
  addressContains: "",
  nukiCodeContains: "",
  cityContains: "", // Added city search
  organizationContains: "", // Added organization search
}

export const useUserStore = create<UserState>((set, get) => ({
  users: mockUsers,
  searchTerm: "",
  statusFilter: "All Status",
  roleFilter: "All Roles",
  viewMode: "table",
  isLoading: false,
  showSensitiveFields: false,

  sortField: "name",
  sortDirection: "asc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedUser: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setRoleFilter: (role) => set({ roleFilter: role }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSensitiveFields: () => set((state) => ({ showSensitiveFields: !state.showSensitiveFields })),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  duplicateUser: (id) =>
    set((state) => {
      const userToDuplicate = state.users.find((user) => user.id === id)
      if (userToDuplicate) {
        const duplicatedUser = {
          ...userToDuplicate,
          id: Date.now().toString(),
          name: `${userToDuplicate.name} (Copy)`,
          email: `copy_${userToDuplicate.email}`,
          nukiCode: userToDuplicate.nukiCode ? `${userToDuplicate.nukiCode}-COPY` : undefined,
        }
        return { users: [...state.users, duplicatedUser] }
      }
      return state
    }),

  promoteUser: (id, newRole) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, role: newRole } : user)),
    })),

  demoteUser: (id, newRole) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, role: newRole } : user)),
    })),

  toggleUserStatus: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Inactive" : ("Active" as "Active" | "Inactive" | "Pending") }
          : user,
      ),
    })),

  openDrawer: (mode, user) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedUser: user || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedUser: null,
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

  filteredUsers: () => {
    const { users, searchTerm, statusFilter, roleFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All Status" || user.status === statusFilter
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter

      const matchesAdvancedRoles =
        advancedFilters.selectedRoles.length === 0 || advancedFilters.selectedRoles.includes(user.role)

      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(user.status)

      const matchesAdvancedDepartments =
        advancedFilters.selectedDepartments.length === 0 ||
        advancedFilters.selectedDepartments.includes(user.department || "")

      const matchesAdvancedOrganizations =
        advancedFilters.selectedOrganizations.length === 0 ||
        advancedFilters.selectedOrganizations.includes(user.organization || "")

      const matchesAdvancedGenders =
        advancedFilters.selectedGenders.length === 0 || advancedFilters.selectedGenders.includes(user.gender || "")

      const matchesAdvancedCountries =
        advancedFilters.selectedCountries.length === 0 || advancedFilters.selectedCountries.includes(user.country || "")

      const matchesJoinDateFrom =
        !advancedFilters.joinDateFrom || (user.joinDate && user.joinDate >= advancedFilters.joinDateFrom)

      const matchesJoinDateTo =
        !advancedFilters.joinDateTo || (user.joinDate && user.joinDate <= advancedFilters.joinDateTo)

      const matchesHasPhone =
        advancedFilters.hasPhone === null || (advancedFilters.hasPhone ? !!user.phone : !user.phone)

      const matchesHasAlternateMobile =
        advancedFilters.hasAlternateMobile === null ||
        (advancedFilters.hasAlternateMobile ? !!user.alternateMobile : !user.alternateMobile)

      const matchesHasAddress =
        advancedFilters.hasAddress === null || (advancedFilters.hasAddress ? !!user.address : !user.address)

      const matchesHasNukiCode =
        advancedFilters.hasNukiCode === null || (advancedFilters.hasNukiCode ? !!user.nukiCode : !user.nukiCode)

      const matchesPhoneContains =
        !advancedFilters.phoneContains ||
        (user.phone && user.phone.toLowerCase().includes(advancedFilters.phoneContains.toLowerCase()))

      const matchesAlternateMobileContains =
        !advancedFilters.alternateMobileContains ||
        (user.alternateMobile &&
          user.alternateMobile.toLowerCase().includes(advancedFilters.alternateMobileContains.toLowerCase()))

      const matchesAddressContains =
        !advancedFilters.addressContains ||
        (user.address && user.address.toLowerCase().includes(advancedFilters.addressContains.toLowerCase()))

      const matchesNukiCodeContains =
        !advancedFilters.nukiCodeContains ||
        (user.nukiCode && user.nukiCode.toLowerCase().includes(advancedFilters.nukiCodeContains.toLowerCase()))

      const matchesCityContains =
        !advancedFilters.cityContains ||
        (user.city && user.city.toLowerCase().includes(advancedFilters.cityContains.toLowerCase()))

      const matchesOrganizationContains =
        !advancedFilters.organizationContains ||
        (user.organization &&
          user.organization.toLowerCase().includes(advancedFilters.organizationContains.toLowerCase()))

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesAdvancedRoles &&
        matchesAdvancedStatuses &&
        matchesAdvancedDepartments &&
        matchesAdvancedOrganizations &&
        matchesAdvancedGenders &&
        matchesAdvancedCountries &&
        matchesJoinDateFrom &&
        matchesJoinDateTo &&
        matchesHasPhone &&
        matchesHasAlternateMobile &&
        matchesHasAddress &&
        matchesHasNukiCode &&
        matchesPhoneContains &&
        matchesAlternateMobileContains &&
        matchesAddressContains &&
        matchesNukiCodeContains &&
        matchesCityContains &&
        matchesOrganizationContains
      )
    })

    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "role":
          aValue = a.role.toLowerCase()
          bValue = b.role.toLowerCase()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case "joinDate":
          aValue = new Date(a.joinDate).getTime()
          bValue = new Date(b.joinDate).getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  },
}))
