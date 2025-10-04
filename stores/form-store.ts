import { create } from "zustand"

export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file"
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  conditional?: {
    dependsOn: string // Field ID
    showWhen: string // Value to show this field
  }
}

export interface FormSettings {
  allowMultipleSubmissions: boolean
  requireAuthentication: boolean
  showProgressBar: boolean
  customTheme?: {
    primaryColor: string
    backgroundColor: string
  }
  notifications: {
    sendToAdmin: boolean
    adminEmail?: string
    sendConfirmationToUser: boolean
    confirmationMessage?: string
  }
  expiry?: {
    enabled: boolean
    expiryDate?: string
    expiryTime?: string
  }
}

export interface Form {
  id: string
  name: string
  description?: string
  status: "Draft" | "Published" | "Archived" | "Expired"
  formType: "Survey" | "Registration" | "Feedback" | "Application" | "RSVP" | "Volunteer"

  // Form structure
  fields: FormField[]
  settings: FormSettings

  // Target audience (reuse from engagement system)
  targetAudience: "all" | "groups" | "users" | "mixed"
  targetGroups: string[] // Array of group IDs
  targetUsers: string[] // Array of user IDs

  // Distribution
  formUrl?: string
  isTemplate: boolean

  // Tracking
  submissionCount: number
  viewCount: number
  completionRate: number // Percentage

  // Meta
  createdDate: string
  lastModified: string
  createdBy: string
  publishedDate?: string
}

export interface AdvancedFormFilters {
  selectedStatuses: string[]
  selectedFormTypes: string[]
  selectedCreators: string[]
  selectedTargetAudiences: string[]

  createdDateFrom: string
  createdDateTo: string
  publishedDateFrom: string
  publishedDateTo: string

  submissionCountMin: number | null
  submissionCountMax: number | null
  completionRateMin: number | null // Percentage
  completionRateMax: number | null
  fieldCountMin: number | null
  fieldCountMax: number | null

  hasDescription: boolean | null
  hasExpiry: boolean | null
  isTemplate: boolean | null
  requiresAuth: boolean | null

  nameContains: string
  descriptionContains: string
  createdByContains: string
}

interface FormState {
  forms: Form[]
  searchTerm: string
  statusFilter: string
  formTypeFilter: string
  viewMode: "table" | "card"
  isLoading: boolean
  showSensitiveFields: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  // Pagination state
  currentPage: number
  itemsPerPage: number

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedForm: Form | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedFormFilters

  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setFormTypeFilter: (type: string) => void
  setViewMode: (mode: "table" | "card") => void
  setForms: (forms: Form[]) => void
  addForm: (form: Form) => void
  updateForm: (id: string, updates: Partial<Form>) => void
  deleteForm: (id: string) => void
  duplicateForm: (id: string) => void
  publishForm: (id: string) => void
  archiveForm: (id: string) => void
  createTemplate: (id: string) => void
  setLoading: (loading: boolean) => void
  toggleSensitiveFields: () => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  // Pagination methods
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void

  openDrawer: (mode: "create" | "view" | "edit", form?: Form) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedFormFilters) => void
  clearAdvancedFilters: () => void

  filteredForms: () => Form[]
  paginatedForms: () => Form[]
  getPaginationInfo: () => { totalItems: number; totalPages: number; startIndex: number; endIndex: number }
}

const mockForms: Form[] = [
  {
    id: "1",
    name: "Festival Volunteer Registration",
    description: "Sign up to volunteer for our upcoming Diwali festival celebration",
    status: "Published",
    formType: "Volunteer",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        required: true,
      },
      {
        id: "availability",
        type: "checkbox",
        label: "Available Time Slots",
        required: true,
        options: ["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-10PM)"],
      },
      {
        id: "experience",
        type: "textarea",
        label: "Previous Volunteer Experience",
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: false,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "admin@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Thank you for volunteering! We'll contact you soon.",
      },
      expiry: {
        enabled: true,
        expiryDate: "2024-10-20",
        expiryTime: "23:59",
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    formUrl: "https://temple.org/forms/volunteer-registration",
    isTemplate: false,
    submissionCount: 47,
    viewCount: 156,
    completionRate: 78.5,
    createdDate: "2024-10-01",
    lastModified: "2024-10-15",
    createdBy: "Admin",
    publishedDate: "2024-10-02",
  },
  {
    id: "2",
    name: "Event Feedback Survey",
    description: "Help us improve future events with your valuable feedback",
    status: "Published",
    formType: "Feedback",
    fields: [
      {
        id: "event_rating",
        type: "radio",
        label: "Overall Event Rating",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "favorite_part",
        type: "textarea",
        label: "What was your favorite part of the event?",
        required: false,
      },
      {
        id: "improvements",
        type: "textarea",
        label: "Suggestions for improvement",
        required: false,
      },
      {
        id: "recommend",
        type: "radio",
        label: "Would you recommend this event to others?",
        required: true,
        options: ["Yes", "No", "Maybe"],
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
      showProgressBar: false,
      notifications: {
        sendToAdmin: true,
        adminEmail: "feedback@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Thank you for your feedback!",
      },
      expiry: {
        enabled: false,
      },
    },
    targetAudience: "groups",
    targetGroups: ["1", "2"], // Temple Priests, Event Volunteers
    targetUsers: [],
    formUrl: "https://temple.org/forms/event-feedback",
    isTemplate: false,
    submissionCount: 23,
    viewCount: 89,
    completionRate: 65.2,
    createdDate: "2024-09-15",
    lastModified: "2024-09-20",
    createdBy: "Priya Sharma",
    publishedDate: "2024-09-16",
  },
  {
    id: "3",
    name: "Temple Membership Application",
    description: "Apply for temple membership and join our community",
    status: "Draft",
    formType: "Application",
    fields: [
      {
        id: "personal_info",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "contact_email",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "membership_type",
        type: "select",
        label: "Membership Type",
        required: true,
        options: ["Individual", "Family", "Student", "Senior"],
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "membership@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Your membership application has been received.",
      },
      expiry: {
        enabled: false,
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    isTemplate: false,
    submissionCount: 0,
    viewCount: 12,
    completionRate: 0,
    createdDate: "2024-10-10",
    lastModified: "2024-10-12",
    createdBy: "Sunita Devi",
  },
  {
    id: "4",
    name: "Generic Survey Template",
    description: "A reusable template for creating surveys",
    status: "Published",
    formType: "Survey",
    fields: [
      {
        id: "question1",
        type: "text",
        label: "Question 1",
        required: true,
      },
      {
        id: "question2",
        type: "textarea",
        label: "Question 2",
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: false,
      showProgressBar: false,
      notifications: {
        sendToAdmin: false,
        sendConfirmationToUser: false,
      },
      expiry: {
        enabled: false,
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    isTemplate: true,
    submissionCount: 0,
    viewCount: 5,
    completionRate: 0,
    createdDate: "2024-09-01",
    lastModified: "2024-09-01",
    createdBy: "Admin",
    publishedDate: "2024-09-01",
  },
  {
    id: "5",
    name: "Community Service Hours Tracking",
    description: "Track volunteer hours for community service requirements",
    status: "Published",
    formType: "Registration",
    fields: [
      {
        id: "volunteer_name",
        type: "text",
        label: "Volunteer Name",
        required: true,
      },
      {
        id: "service_date",
        type: "date",
        label: "Service Date",
        required: true,
      },
      {
        id: "hours_worked",
        type: "number",
        label: "Hours Worked",
        required: true,
        validation: { min: 0.5, max: 24 }
      },
    ],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: true,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "volunteer@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Your service hours have been recorded.",
      },
      expiry: {
        enabled: false,
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    formUrl: "https://temple.org/forms/service-hours",
    isTemplate: false,
    submissionCount: 89,
    viewCount: 234,
    completionRate: 82.1,
    createdDate: "2024-08-15",
    lastModified: "2024-10-05",
    createdBy: "Priya Sharma",
    publishedDate: "2024-08-16",
  },
  {
    id: "6",
    name: "Event RSVP Form",
    description: "RSVP for upcoming temple events and celebrations",
    status: "Published",
    formType: "RSVP",
    fields: [
      {
        id: "attendee_name",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "guests",
        type: "number",
        label: "Number of Guests",
        required: false,
        validation: { min: 0, max: 10 }
      },
      {
        id: "dietary_restrictions",
        type: "textarea",
        label: "Dietary Restrictions",
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: false,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "events@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Thank you for your RSVP! We look forward to seeing you.",
      },
      expiry: {
        enabled: true,
        expiryDate: "2024-11-15",
        expiryTime: "18:00",
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    formUrl: "https://temple.org/forms/event-rsvp",
    isTemplate: false,
    submissionCount: 156,
    viewCount: 445,
    completionRate: 71.2,
    createdDate: "2024-10-01",
    lastModified: "2024-10-10",
    createdBy: "Sunita Devi",
    publishedDate: "2024-10-02",
  },
  {
    id: "7",
    name: "Temple Donation Form",
    description: "Make donations to support temple activities and maintenance",
    status: "Published",
    formType: "Application",
    fields: [
      {
        id: "donor_name",
        type: "text",
        label: "Donor Name",
        required: true,
      },
      {
        id: "donation_amount",
        type: "number",
        label: "Donation Amount",
        required: true,
        validation: { min: 1 }
      },
      {
        id: "donation_type",
        type: "select",
        label: "Donation Type",
        required: true,
        options: ["General Fund", "Building Maintenance", "Event Sponsorship", "Educational Programs"]
      },
      {
        id: "anonymous",
        type: "checkbox",
        label: "Make this donation anonymous",
        required: false,
      },
    ],
    settings: {
      allowMultipleSubmissions: true,
      requireAuthentication: false,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "donations@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Thank you for your generous donation!",
      },
      expiry: {
        enabled: false,
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    formUrl: "https://temple.org/forms/donations",
    isTemplate: false,
    submissionCount: 67,
    viewCount: 189,
    completionRate: 88.9,
    createdDate: "2024-09-20",
    lastModified: "2024-10-08",
    createdBy: "Admin",
    publishedDate: "2024-09-21",
  },
  {
    id: "8",
    name: "Educational Program Registration",
    description: "Register for temple educational programs and classes",
    status: "Draft",
    formType: "Registration",
    fields: [
      {
        id: "student_name",
        type: "text",
        label: "Student Name",
        required: true,
      },
      {
        id: "parent_name",
        type: "text",
        label: "Parent/Guardian Name",
        required: true,
      },
      {
        id: "program_interest",
        type: "select",
        label: "Program of Interest",
        required: true,
        options: ["Sanskrit Classes", "Bhagavad Gita Study", "Yoga Classes", "Music Lessons"]
      },
      {
        id: "age_group",
        type: "select",
        label: "Age Group",
        required: true,
        options: ["5-8 years", "9-12 years", "13-17 years", "18+ years"]
      },
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireAuthentication: true,
      showProgressBar: true,
      notifications: {
        sendToAdmin: true,
        adminEmail: "education@temple.org",
        sendConfirmationToUser: true,
        confirmationMessage: "Your registration has been received. We'll contact you soon.",
      },
      expiry: {
        enabled: true,
        expiryDate: "2024-12-01",
        expiryTime: "23:59",
      },
    },
    targetAudience: "all",
    targetGroups: [],
    targetUsers: [],
    isTemplate: false,
    submissionCount: 0,
    viewCount: 23,
    completionRate: 0,
    createdDate: "2024-10-12",
    lastModified: "2024-10-14",
    createdBy: "Priya Sharma",
  },
]

const defaultAdvancedFilters: AdvancedFormFilters = {
  selectedStatuses: [],
  selectedFormTypes: [],
  selectedCreators: [],
  selectedTargetAudiences: [],

  createdDateFrom: "",
  createdDateTo: "",
  publishedDateFrom: "",
  publishedDateTo: "",

  submissionCountMin: null,
  submissionCountMax: null,
  completionRateMin: null,
  completionRateMax: null,
  fieldCountMin: null,
  fieldCountMax: null,

  hasDescription: null,
  hasExpiry: null,
  isTemplate: null,
  requiresAuth: null,

  nameContains: "",
  descriptionContains: "",
  createdByContains: "",
}

export const useFormStore = create<FormState>((set, get) => ({
  forms: mockForms,
  searchTerm: "",
  statusFilter: "All Status",
  formTypeFilter: "All Types",
  viewMode: "table",
  isLoading: false,
  showSensitiveFields: false,

  sortField: "createdDate",
  sortDirection: "desc",

  // Pagination state
  currentPage: 1,
  itemsPerPage: 10,

  isDrawerOpen: false,
  drawerMode: null,
  selectedForm: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setFormTypeFilter: (type) => set({ formTypeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setForms: (forms) => set({ forms }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSensitiveFields: () => set((state) => ({ showSensitiveFields: !state.showSensitiveFields })),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addForm: (form) =>
    set((state) => ({
      forms: [...state.forms, { ...form, id: Date.now().toString() }],
    })),

  updateForm: (id, updates) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id ? { ...form, ...updates, lastModified: new Date().toISOString().split("T")[0] } : form,
      ),
    })),

  deleteForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== id),
    })),

  duplicateForm: (id) =>
    set((state) => {
      const formToDuplicate = state.forms.find((form) => form.id === id)
      if (formToDuplicate) {
        const duplicatedForm = {
          ...formToDuplicate,
          id: Date.now().toString(),
          name: `${formToDuplicate.name} (Copy)`,
          status: "Draft" as const,
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          publishedDate: undefined,
          submissionCount: 0,
          viewCount: 0,
          completionRate: 0,
          isTemplate: false,
        }
        return { forms: [...state.forms, duplicatedForm] }
      }
      return state
    }),

  publishForm: (id) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id
          ? {
              ...form,
              status: "Published" as const,
              publishedDate: new Date().toISOString().split("T")[0],
              lastModified: new Date().toISOString().split("T")[0],
              formUrl: `https://temple.org/forms/${form.name.toLowerCase().replace(/\s+/g, "-")}`,
            }
          : form,
      ),
    })),

  archiveForm: (id) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id
          ? {
              ...form,
              status: "Archived" as const,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : form,
      ),
    })),

  createTemplate: (id) =>
    set((state) => {
      const formToTemplate = state.forms.find((form) => form.id === id)
      if (formToTemplate) {
        const templateForm = {
          ...formToTemplate,
          id: Date.now().toString(),
          name: `${formToTemplate.name} Template`,
          status: "Published" as const,
          isTemplate: true,
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          submissionCount: 0,
          viewCount: 0,
          completionRate: 0,
        }
        return { forms: [...state.forms, templateForm] }
      }
      return state
    }),

  openDrawer: (mode, form) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedForm: form || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedForm: null,
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

  // Pagination methods
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
  goToFirstPage: () => set({ currentPage: 1 }),
  goToLastPage: () => {
    const { filteredForms, itemsPerPage } = get()
    const totalPages = Math.ceil(filteredForms().length / itemsPerPage)
    set({ currentPage: totalPages })
  },
  goToNextPage: () => {
    const { filteredForms, currentPage, itemsPerPage } = get()
    const totalPages = Math.ceil(filteredForms().length / itemsPerPage)
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 })
    }
  },
  goToPreviousPage: () => {
    const { currentPage } = get()
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 })
    }
  },

  filteredForms: () => {
    const { forms, searchTerm, statusFilter, formTypeFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = forms.filter((form) => {
      const matchesSearch =
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "All Status" || form.status === statusFilter
      const matchesFormType = formTypeFilter === "All Types" || form.formType === formTypeFilter

      // Advanced filters
      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(form.status)

      const matchesAdvancedFormTypes =
        advancedFilters.selectedFormTypes.length === 0 || advancedFilters.selectedFormTypes.includes(form.formType)

      const matchesAdvancedCreators =
        advancedFilters.selectedCreators.length === 0 || advancedFilters.selectedCreators.includes(form.createdBy)

      const matchesAdvancedTargetAudiences =
        advancedFilters.selectedTargetAudiences.length === 0 ||
        advancedFilters.selectedTargetAudiences.includes(form.targetAudience)

      // Date filters
      const matchesCreatedDateFrom =
        !advancedFilters.createdDateFrom || form.createdDate >= advancedFilters.createdDateFrom

      const matchesCreatedDateTo = !advancedFilters.createdDateTo || form.createdDate <= advancedFilters.createdDateTo

      const matchesPublishedDateFrom =
        !advancedFilters.publishedDateFrom ||
        (form.publishedDate && form.publishedDate >= advancedFilters.publishedDateFrom)

      const matchesPublishedDateTo =
        !advancedFilters.publishedDateTo ||
        (form.publishedDate && form.publishedDate <= advancedFilters.publishedDateTo)

      // Numeric filters
      const matchesSubmissionCountMin =
        advancedFilters.submissionCountMin === null || form.submissionCount >= advancedFilters.submissionCountMin

      const matchesSubmissionCountMax =
        advancedFilters.submissionCountMax === null || form.submissionCount <= advancedFilters.submissionCountMax

      const matchesCompletionRateMin =
        advancedFilters.completionRateMin === null || form.completionRate >= advancedFilters.completionRateMin

      const matchesCompletionRateMax =
        advancedFilters.completionRateMax === null || form.completionRate <= advancedFilters.completionRateMax

      const matchesFieldCountMin =
        advancedFilters.fieldCountMin === null || form.fields.length >= advancedFilters.fieldCountMin

      const matchesFieldCountMax =
        advancedFilters.fieldCountMax === null || form.fields.length <= advancedFilters.fieldCountMax

      // Boolean filters
      const matchesHasDescription =
        advancedFilters.hasDescription === null ||
        (advancedFilters.hasDescription ? !!form.description : !form.description)

      const matchesHasExpiry =
        advancedFilters.hasExpiry === null ||
        (advancedFilters.hasExpiry ? form.settings.expiry?.enabled : !form.settings.expiry?.enabled)

      const matchesIsTemplate =
        advancedFilters.isTemplate === null || (advancedFilters.isTemplate ? form.isTemplate : !form.isTemplate)

      const matchesRequiresAuth =
        advancedFilters.requiresAuth === null ||
        (advancedFilters.requiresAuth ? form.settings.requireAuthentication : !form.settings.requireAuthentication)

      // Text search filters
      const matchesNameContains =
        !advancedFilters.nameContains || form.name.toLowerCase().includes(advancedFilters.nameContains.toLowerCase())

      const matchesDescriptionContains =
        !advancedFilters.descriptionContains ||
        (form.description && form.description.toLowerCase().includes(advancedFilters.descriptionContains.toLowerCase()))

      const matchesCreatedByContains =
        !advancedFilters.createdByContains ||
        form.createdBy.toLowerCase().includes(advancedFilters.createdByContains.toLowerCase())

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFormType &&
        matchesAdvancedStatuses &&
        matchesAdvancedFormTypes &&
        matchesAdvancedCreators &&
        matchesAdvancedTargetAudiences &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo &&
        matchesPublishedDateFrom &&
        matchesPublishedDateTo &&
        matchesSubmissionCountMin &&
        matchesSubmissionCountMax &&
        matchesCompletionRateMin &&
        matchesCompletionRateMax &&
        matchesFieldCountMin &&
        matchesFieldCountMax &&
        matchesHasDescription &&
        matchesHasExpiry &&
        matchesIsTemplate &&
        matchesRequiresAuth &&
        matchesNameContains &&
        matchesDescriptionContains &&
        matchesCreatedByContains
      )
    })

    // Sorting
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
        case "formType":
          aValue = a.formType.toLowerCase()
          bValue = b.formType.toLowerCase()
          break
        case "createdDate":
          aValue = new Date(a.createdDate).getTime()
          bValue = new Date(b.createdDate).getTime()
          break
        case "publishedDate":
          aValue = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
          bValue = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
          break
        case "submissionCount":
          aValue = a.submissionCount
          bValue = b.submissionCount
          break
        case "completionRate":
          aValue = a.completionRate
          bValue = b.completionRate
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

  paginatedForms: () => {
    const { filteredForms, currentPage, itemsPerPage } = get()
    const filtered = filteredForms()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  },

  getPaginationInfo: () => {
    const { filteredForms, currentPage, itemsPerPage } = get()
    const totalItems = filteredForms().length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems)
    
    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex
    }
  },
}))
