import { create } from "zustand"

export interface Donor {
  id: string
  name: string
  email: string
  phone?: string
  street?: string
  zipcode?: string
  city?: string
  country?: string
  message?: string
}

export interface DonationRequest {
  id: string
  type: "online" | "offline" | "material"
  donor: Donor
  amount?: number
  currency?: string
  frequency: "one-time" | "weekly" | "monthly" | "quarterly" | "yearly"
  paymentMethod?: "stripe" | "paypal" | "razorpay" | "bank-transfer" | "cheque" | "cash"
  status: "pending" | "reviewed" | "approved" | "rejected" | "received" | "distributed"
  date: string
  receiptFile?: string
  adminNotes?: string
  notificationTemplate?: string
  isRecurring?: boolean
  recurringId?: string
  nextPaymentDate?: string
  // Material donation fields
  materialType?: string
  materialDescription?: string
  materialQuantity?: number
  materialCondition?: "new" | "used" | "good" | "fair"
  dropOffDate?: string
  dropOffTime?: string
}

export interface DonationTemplate {
  id: string
  name: string
  type: "acknowledgment" | "rejection" | "clarification" | "recurring-confirmation" | "recurring-cancellation"
  subject: string
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AdvancedFilters {
  selectedTypes: string[]
  selectedStatuses: string[]
  selectedFrequencies: string[]
  selectedPaymentMethods: string[]
  amountFrom: number | null
  amountTo: number | null
  dateFrom: string
  dateTo: string
  donorNameContains: string
  donorEmailContains: string
  hasReceipt: boolean | null
  isRecurring: boolean | null
}

interface DonationState {
  donations: DonationRequest[]
  templates: DonationTemplate[]
  searchTerm: string
  statusFilter: string
  typeFilter: string
  viewMode: "table" | "card"
  isLoading: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedDonation: DonationRequest | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTypeFilter: (type: string) => void
  setViewMode: (mode: "table" | "card") => void
  setDonations: (donations: DonationRequest[]) => void
  addDonation: (donation: DonationRequest) => void
  updateDonation: (id: string, updates: Partial<DonationRequest>) => void
  deleteDonation: (id: string) => void
  setLoading: (loading: boolean) => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  openDrawer: (mode: "create" | "view" | "edit", donation?: DonationRequest) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedFilters) => void
  clearAdvancedFilters: () => void

  filteredDonations: () => DonationRequest[]
  
  // Template management
  addTemplate: (template: DonationTemplate) => void
  updateTemplate: (id: string, updates: Partial<DonationTemplate>) => void
  deleteTemplate: (id: string) => void
}

const mockDonations: DonationRequest[] = [
  {
    id: "1",
    type: "online",
    donor: {
      id: "d1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      street: "123 Temple Street",
      zipcode: "400001",
      city: "Mumbai",
      country: "India",
      message: "For temple maintenance and development"
    },
    amount: 5000,
    currency: "INR",
    frequency: "monthly",
    paymentMethod: "stripe",
    status: "approved",
    date: "2024-01-15",
    isRecurring: true,
    recurringId: "rec_001",
    nextPaymentDate: "2024-02-15"
  },
  {
    id: "2",
    type: "offline",
    donor: {
      id: "d2",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      street: "456 Devotee Lane",
      zipcode: "110001",
      city: "Delhi",
      country: "India",
      message: "For community service activities"
    },
    amount: 10000,
    currency: "INR",
    frequency: "one-time",
    paymentMethod: "bank-transfer",
    status: "pending",
    date: "2024-01-20",
    receiptFile: "/receipts/receipt_001.pdf"
  },
  {
    id: "3",
    type: "online",
    donor: {
      id: "d3",
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 21098",
      street: "789 Sacred Road",
      zipcode: "380001",
      city: "Ahmedabad",
      country: "India"
    },
    amount: 2500,
    currency: "INR",
    frequency: "weekly",
    paymentMethod: "razorpay",
    status: "reviewed",
    date: "2024-01-18",
    isRecurring: true,
    recurringId: "rec_002",
    nextPaymentDate: "2024-01-25"
  },
  {
    id: "4",
    type: "offline",
    donor: {
      id: "d4",
      name: "Sunita Devi",
      email: "sunita@example.com",
      phone: "+91 65432 10987",
      street: "321 Divine Avenue",
      zipcode: "411001",
      city: "Pune",
      country: "India",
      message: "For educational programs"
    },
    amount: 15000,
    currency: "INR",
    frequency: "one-time",
    paymentMethod: "cheque",
    status: "approved",
    date: "2024-01-22",
    receiptFile: "/receipts/receipt_002.pdf"
  },
  {
    id: "5",
    type: "material",
    donor: {
      id: "d5",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 12345",
      street: "456 Devotee Lane",
      zipcode: "400001",
      city: "Mumbai",
      country: "India",
      message: "For temple worship and community service"
    },
    frequency: "one-time",
    status: "pending",
    date: "2024-01-25",
    materialType: "worship",
    materialDescription: "Fresh flowers, incense sticks, and camphor for daily worship",
    materialQuantity: 50,
    materialCondition: "new",
    dropOffDate: "2024-01-26",
    dropOffTime: "10:00"
  },
  {
    id: "6",
    type: "material",
    donor: {
      id: "d6",
      name: "Amit Singh",
      email: "amit@example.com",
      phone: "+91 87654 32109",
      street: "789 Sacred Road",
      zipcode: "110001",
      city: "Delhi",
      country: "India",
      message: "For community kitchen and prasad distribution"
    },
    frequency: "one-time",
    status: "received",
    date: "2024-01-20",
    materialType: "food",
    materialDescription: "Rice, dal, vegetables, and cooking oil for community kitchen",
    materialQuantity: 100,
    materialCondition: "new"
  }
]

const mockTemplates: DonationTemplate[] = [
  {
    id: "t1",
    name: "Donation Acknowledgment",
    type: "acknowledgment",
    subject: "Thank you for your generous donation",
    content: "Dear {{donorName}},\n\nThank you for your generous donation of {{amount}} {{currency}} to our temple. Your contribution helps us continue our spiritual and community services.\n\nWith gratitude,\nTemple Management",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "t2",
    name: "Receipt Rejection",
    type: "rejection",
    subject: "Donation receipt review - Additional information needed",
    content: "Dear {{donorName}},\n\nWe have reviewed your donation receipt and need additional information to process your donation. Please contact us for further details.\n\nThank you,\nTemple Management",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "t3",
    name: "Recurring Donation Confirmation",
    type: "recurring-confirmation",
    subject: "Recurring donation setup confirmed",
    content: "Dear {{donorName}},\n\nYour recurring donation of {{amount}} {{currency}} has been successfully set up. Your next payment is scheduled for {{nextPaymentDate}}.\n\nThank you for your ongoing support,\nTemple Management",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
]

const defaultAdvancedFilters: AdvancedFilters = {
  selectedTypes: [],
  selectedStatuses: [],
  selectedFrequencies: [],
  selectedPaymentMethods: [],
  amountFrom: null,
  amountTo: null,
  dateFrom: "",
  dateTo: "",
  donorNameContains: "",
  donorEmailContains: "",
  hasReceipt: null,
  isRecurring: null
}

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: mockDonations,
  templates: mockTemplates,
  searchTerm: "",
  statusFilter: "All Status",
  typeFilter: "All Types",
  viewMode: "table",
  isLoading: false,

  sortField: "date",
  sortDirection: "desc",

  isDrawerOpen: false,
  drawerMode: null,
  selectedDonation: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDonations: (donations) => set({ donations }),
  setLoading: (loading) => set({ isLoading: loading }),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addDonation: (donation) =>
    set((state) => ({
      donations: [...state.donations, donation],
    })),

  updateDonation: (id, updates) =>
    set((state) => ({
      donations: state.donations.map((donation) => (donation.id === id ? { ...donation, ...updates } : donation)),
    })),

  deleteDonation: (id) =>
    set((state) => ({
      donations: state.donations.filter((donation) => donation.id !== id),
    })),

  openDrawer: (mode, donation) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedDonation: donation || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedDonation: null,
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

  filteredDonations: () => {
    const { donations, searchTerm, statusFilter, typeFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = donations.filter((donation) => {
      const matchesSearch =
        donation.donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donor.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All Status" || donation.status === statusFilter
      const matchesType = typeFilter === "All Types" || donation.type === typeFilter

      const matchesAdvancedTypes =
        advancedFilters.selectedTypes.length === 0 || advancedFilters.selectedTypes.includes(donation.type)

      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(donation.status)

      const matchesAdvancedFrequencies =
        advancedFilters.selectedFrequencies.length === 0 || advancedFilters.selectedFrequencies.includes(donation.frequency)

      const matchesAdvancedPaymentMethods =
        advancedFilters.selectedPaymentMethods.length === 0 || 
        (donation.paymentMethod && advancedFilters.selectedPaymentMethods.includes(donation.paymentMethod))

      const matchesAmountFrom = !advancedFilters.amountFrom || donation.amount >= advancedFilters.amountFrom
      const matchesAmountTo = !advancedFilters.amountTo || donation.amount <= advancedFilters.amountTo

      const matchesDateFrom = !advancedFilters.dateFrom || donation.date >= advancedFilters.dateFrom
      const matchesDateTo = !advancedFilters.dateTo || donation.date <= advancedFilters.dateTo

      const matchesDonorNameContains =
        !advancedFilters.donorNameContains ||
        donation.donor.name.toLowerCase().includes(advancedFilters.donorNameContains.toLowerCase())

      const matchesDonorEmailContains =
        !advancedFilters.donorEmailContains ||
        donation.donor.email.toLowerCase().includes(advancedFilters.donorEmailContains.toLowerCase())

      const matchesHasReceipt =
        advancedFilters.hasReceipt === null || (advancedFilters.hasReceipt ? !!donation.receiptFile : !donation.receiptFile)

      const matchesIsRecurring =
        advancedFilters.isRecurring === null || (advancedFilters.isRecurring ? !!donation.isRecurring : !donation.isRecurring)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesAdvancedTypes &&
        matchesAdvancedStatuses &&
        matchesAdvancedFrequencies &&
        matchesAdvancedPaymentMethods &&
        matchesAmountFrom &&
        matchesAmountTo &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesDonorNameContains &&
        matchesDonorEmailContains &&
        matchesHasReceipt &&
        matchesIsRecurring
      )
    })

    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "donorName":
          aValue = a.donor.name.toLowerCase()
          bValue = b.donor.name.toLowerCase()
          break
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "date":
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  },

  // Template management
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template],
    })),

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((template) => (template.id === id ? { ...template, ...updates } : template)),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    })),
}))
