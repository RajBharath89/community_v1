import { create } from "zustand"

export interface Group {
  id: string
  name: string
  description?: string
  status: "Active" | "Inactive"
  createdDate: string
  memberCount: number
  groupType: "role-based" | "user-based" | "mixed"
  roleMembers: string[] // Array of role names
  userMembers: string[] // Array of user IDs
  createdBy: string
  lastModified: string
}

export interface AdvancedGroupFilters {
  selectedStatuses: string[]
  selectedGroupTypes: string[]
  selectedCreators: string[]
  createdDateFrom: string
  createdDateTo: string
  memberCountMin: number | null
  memberCountMax: number | null
  hasDescription: boolean | null
  nameContains: string
  descriptionContains: string
  createdByContains: string
}

interface GroupState {
  groups: Group[]
  searchTerm: string
  statusFilter: string
  groupTypeFilter: string
  viewMode: "table" | "card"
  isLoading: boolean
  showSensitiveFields: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedGroup: Group | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedGroupFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setGroupTypeFilter: (type: string) => void
  setViewMode: (mode: "table" | "card") => void
  setGroups: (groups: Group[]) => void
  addGroup: (group: Group) => void
  updateGroup: (id: string, updates: Partial<Group>) => void
  deleteGroup: (id: string) => void
  duplicateGroup: (id: string) => void
  toggleGroupStatus: (id: string) => void
  setLoading: (loading: boolean) => void
  toggleSensitiveFields: () => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  openDrawer: (mode: "create" | "view" | "edit", group?: Group) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedGroupFilters) => void
  clearAdvancedFilters: () => void

  filteredGroups: () => Group[]
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Temple Priests",
    description: "All ordained priests serving at the temple",
    status: "Active",
    createdDate: "2023-01-15",
    memberCount: 8,
    groupType: "role-based",
    roleMembers: ["Priest"],
    userMembers: [],
    createdBy: "Admin",
    lastModified: "2023-01-15",
  },
  {
    id: "2",
    name: "Event Volunteers",
    description: "Volunteers who help organize and manage temple events",
    status: "Active",
    createdDate: "2023-02-20",
    memberCount: 25,
    groupType: "role-based",
    roleMembers: ["Volunteer"],
    userMembers: [],
    createdBy: "Admin",
    lastModified: "2023-02-20",
  },
  {
    id: "3",
    name: "Board Members",
    description: "Trustees and administrators managing temple operations",
    status: "Active",
    createdDate: "2022-12-10",
    memberCount: 12,
    groupType: "mixed",
    roleMembers: ["Trustee", "Admin"],
    userMembers: [],
    createdBy: "Admin",
    lastModified: "2023-03-15",
  },
  {
    id: "4",
    name: "Festival Committee",
    description: "Special group for organizing major festivals",
    status: "Inactive",
    createdDate: "2023-03-05",
    memberCount: 15,
    groupType: "user-based",
    roleMembers: [],
    userMembers: ["1", "2", "4"], // Specific user IDs
    createdBy: "Sunita Devi",
    lastModified: "2023-03-05",
  },
]

const defaultAdvancedFilters: AdvancedGroupFilters = {
  selectedStatuses: [],
  selectedGroupTypes: [],
  selectedCreators: [],
  createdDateFrom: "",
  createdDateTo: "",
  memberCountMin: null,
  memberCountMax: null,
  hasDescription: null,
  nameContains: "",
  descriptionContains: "",
  createdByContains: "",
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: mockGroups,
  searchTerm: "",
  statusFilter: "All Status",
  groupTypeFilter: "All Types",
  viewMode: "table",
  isLoading: false,
  showSensitiveFields: false,

  sortField: "name",
  sortDirection: "asc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedGroup: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setGroupTypeFilter: (type) => set({ groupTypeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setGroups: (groups) => set({ groups }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSensitiveFields: () => set((state) => ({ showSensitiveFields: !state.showSensitiveFields })),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
    })),

  updateGroup: (id, updates) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...updates, lastModified: new Date().toISOString().split("T")[0] } : group,
      ),
    })),

  deleteGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    })),

  duplicateGroup: (id) =>
    set((state) => {
      const groupToDuplicate = state.groups.find((group) => group.id === id)
      if (groupToDuplicate) {
        const duplicatedGroup = {
          ...groupToDuplicate,
          id: Date.now().toString(),
          name: `${groupToDuplicate.name} (Copy)`,
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
        }
        return { groups: [...state.groups, duplicatedGroup] }
      }
      return state
    }),

  toggleGroupStatus: (id) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id
          ? {
              ...group,
              status: group.status === "Active" ? "Inactive" : "Active",
              lastModified: new Date().toISOString().split("T")[0],
            }
          : group,
      ),
    })),

  openDrawer: (mode, group) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedGroup: group || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedGroup: null,
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

  filteredGroups: () => {
    const { groups, searchTerm, statusFilter, groupTypeFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "All Status" || group.status === statusFilter
      const matchesGroupType = groupTypeFilter === "All Types" || group.groupType === groupTypeFilter

      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(group.status)

      const matchesAdvancedGroupTypes =
        advancedFilters.selectedGroupTypes.length === 0 || advancedFilters.selectedGroupTypes.includes(group.groupType)

      const matchesAdvancedCreators =
        advancedFilters.selectedCreators.length === 0 || advancedFilters.selectedCreators.includes(group.createdBy)

      const matchesCreatedDateFrom =
        !advancedFilters.createdDateFrom || group.createdDate >= advancedFilters.createdDateFrom

      const matchesCreatedDateTo = !advancedFilters.createdDateTo || group.createdDate <= advancedFilters.createdDateTo

      const matchesMemberCountMin =
        advancedFilters.memberCountMin === null || group.memberCount >= advancedFilters.memberCountMin

      const matchesMemberCountMax =
        advancedFilters.memberCountMax === null || group.memberCount <= advancedFilters.memberCountMax

      const matchesHasDescription =
        advancedFilters.hasDescription === null ||
        (advancedFilters.hasDescription ? !!group.description : !group.description)

      const matchesNameContains =
        !advancedFilters.nameContains || group.name.toLowerCase().includes(advancedFilters.nameContains.toLowerCase())

      const matchesDescriptionContains =
        !advancedFilters.descriptionContains ||
        (group.description &&
          group.description.toLowerCase().includes(advancedFilters.descriptionContains.toLowerCase()))

      const matchesCreatedByContains =
        !advancedFilters.createdByContains ||
        group.createdBy.toLowerCase().includes(advancedFilters.createdByContains.toLowerCase())

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGroupType &&
        matchesAdvancedStatuses &&
        matchesAdvancedGroupTypes &&
        matchesAdvancedCreators &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo &&
        matchesMemberCountMin &&
        matchesMemberCountMax &&
        matchesHasDescription &&
        matchesNameContains &&
        matchesDescriptionContains &&
        matchesCreatedByContains
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
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case "groupType":
          aValue = a.groupType.toLowerCase()
          bValue = b.groupType.toLowerCase()
          break
        case "memberCount":
          aValue = a.memberCount
          bValue = b.memberCount
          break
        case "createdDate":
          aValue = new Date(a.createdDate).getTime()
          bValue = new Date(b.createdDate).getTime()
          break
        case "createdBy":
          aValue = a.createdBy.toLowerCase()
          bValue = b.createdBy.toLowerCase()
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
