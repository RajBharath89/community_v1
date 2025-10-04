import { create } from "zustand"

export interface LibraryItem {
  id: string
  title: string
  description: string
  type: "ebook" | "audiobook" | "image" | "video" | "document"
  category: string
  author?: string
  narrator?: string // For audiobooks
  duration?: string // For audiobooks/videos
  fileSize?: string
  language: string
  status: "Available" | "Borrowed" | "Maintenance" | "Archived"
  tags: string[]
  thumbnail?: string
  fileUrl?: string
  isbn?: string // For books
  publishDate?: string
  addedDate: string
  lastModified: string
  borrowedBy?: string
  borrowedDate?: string
  dueDate?: string
  rating?: number
  downloadCount: number
  viewCount: number
  isPublic: boolean
  isFeatured: boolean
  metadata?: {
    pages?: number // For ebooks
    format?: string // PDF, EPUB, MP3, etc.
    quality?: string // For videos/images
    resolution?: string // For videos/images
    bitrate?: string // For audio/video
  }
}

export interface AdvancedFilters {
  selectedTypes: string[]
  selectedCategories: string[]
  selectedStatuses: string[]
  selectedLanguages: string[]
  selectedAuthors: string[]
  selectedTags: string[]
  publishDateFrom: string
  publishDateTo: string
  addedDateFrom: string
  addedDateTo: string
  hasThumbnail: boolean | null
  isPublic: boolean | null
  isFeatured: boolean | null
  minRating: number
  maxRating: number
  minDownloadCount: number
  maxDownloadCount: number
  titleContains: string
  descriptionContains: string
  authorContains: string
  tagContains: string
}

interface LibraryState {
  items: LibraryItem[]
  searchTerm: string
  typeFilter: string
  categoryFilter: string
  statusFilter: string
  viewMode: "grid" | "list"
  isLoading: boolean

  sortField: string
  sortDirection: "asc" | "desc"

  // Pagination state
  currentPage: number
  itemsPerPage: number

  isDrawerOpen: boolean
  drawerMode: "create" | "view" | "edit" | null
  selectedItem: LibraryItem | null

  isAdvancedFilterOpen: boolean
  advancedFilters: AdvancedFilters

  isActionModalOpen: boolean
  actionModalItem: LibraryItem | null
  actionModalAction: "read" | "play" | "view" | null

  setSearchTerm: (term: string) => void
  setTypeFilter: (type: string) => void
  setCategoryFilter: (category: string) => void
  setStatusFilter: (status: string) => void
  setViewMode: (mode: "grid" | "list") => void
  setItems: (items: LibraryItem[]) => void
  addItem: (item: LibraryItem) => void
  updateItem: (id: string, updates: Partial<LibraryItem>) => void
  deleteItem: (id: string) => void
  duplicateItem: (id: string) => void
  borrowItem: (id: string, borrowerId: string, dueDate: string) => void
  returnItem: (id: string) => void
  setLoading: (loading: boolean) => void
  simulateLoading: () => void

  setSorting: (field: string, direction: "asc" | "desc") => void
  toggleSort: (field: string) => void

  // Pagination methods
  setCurrentPage: (page: number) => void
  setItemsPerPage: (count: number) => void
  resetPagination: () => void
  getPaginatedItems: () => {
    items: LibraryItem[]
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }

  openDrawer: (mode: "create" | "view" | "edit", item?: LibraryItem) => void
  closeDrawer: () => void

  openAdvancedFilter: () => void
  closeAdvancedFilter: () => void
  setAdvancedFilters: (filters: AdvancedFilters) => void
  clearAdvancedFilters: () => void

  openActionModal: (item: LibraryItem, action: "read" | "play" | "view") => void
  closeActionModal: () => void

  filteredItems: () => LibraryItem[]
}

const mockLibraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "Bhagavad Gita - Complete Commentary",
    description: "A comprehensive commentary on the Bhagavad Gita with insights from various spiritual masters.",
    type: "ebook",
    category: "Spiritual Texts",
    author: "Swami Vivekananda",
    language: "English",
    status: "Available",
    tags: ["spiritual", "hinduism", "philosophy", "commentary"],
    thumbnail: "/sai-baba-reading-sacred-texts-surrounded-by-books-.png",
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    isbn: "978-0-123456-78-9",
    publishDate: "2023-01-15",
    addedDate: "2023-02-01",
    lastModified: "2023-02-01",
    rating: 4.8,
    downloadCount: 1250,
    viewCount: 3200,
    isPublic: true,
    isFeatured: true,
    metadata: {
      pages: 450,
      format: "PDF",
    },
  },
  {
    id: "2",
    title: "Ramayana - Audio Narration",
    description: "Complete audio narration of the epic Ramayana in Hindi with traditional music.",
    type: "audiobook",
    category: "Epics",
    author: "Valmiki",
    narrator: "Dr. Rajesh Kumar",
    language: "Hindi",
    status: "Available",
    tags: ["epic", "ramayana", "audio", "hindi", "traditional"],
    thumbnail: "/sai-baba-peaceful-face-with-orange-turban.png",
    fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: "12:30:45",
    fileSize: "1.2 GB",
    addedDate: "2023-01-20",
    lastModified: "2023-01-20",
    rating: 4.9,
    downloadCount: 890,
    viewCount: 2100,
    isPublic: true,
    isFeatured: true,
    metadata: {
      format: "MP3",
      bitrate: "320 kbps",
    },
  },
  {
    id: "3",
    title: "Temple Architecture Through Ages",
    description: "A visual journey through the evolution of temple architecture in India.",
    type: "image",
    category: "Architecture",
    language: "English",
    status: "Available",
    tags: ["architecture", "temple", "history", "photography"],
    thumbnail: "/sai-baba-blessing-devotees-in-temple-setting-with-.png",
    fileUrl: "/sai-baba-blessing-devotees-in-temple-setting-with-.png",
    fileSize: "15.2 MB",
    addedDate: "2023-02-10",
    lastModified: "2023-02-10",
    rating: 4.6,
    downloadCount: 450,
    viewCount: 1200,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "PNG",
      quality: "High",
      resolution: "4K",
    },
  },
  {
    id: "4",
    title: "Daily Puja Rituals - Video Guide",
    description: "Step-by-step video guide for performing daily puja rituals at home.",
    type: "video",
    category: "Rituals",
    language: "Hindi",
    status: "Available",
    tags: ["puja", "rituals", "daily", "guide", "video"],
    thumbnail: "/sai-baba-teaching-and-speaking-to-gathered-devotee.png",
    fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "45:30",
    fileSize: "2.1 GB",
    addedDate: "2023-01-25",
    lastModified: "2023-01-25",
    rating: 4.7,
    downloadCount: 320,
    viewCount: 890,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "MP4",
      quality: "HD",
      resolution: "1080p",
    },
  },
  {
    id: "5",
    title: "Sanskrit Grammar Reference",
    description: "Comprehensive reference guide for Sanskrit grammar and pronunciation.",
    type: "document",
    category: "Language Learning",
    author: "Prof. Sanskrit Sharma",
    language: "Sanskrit",
    status: "Available",
    tags: ["sanskrit", "grammar", "language", "reference"],
    // thumbnail: "/placeholder.jpg", // No thumbnail to test placeholder images
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    fileSize: "8.5 MB",
    publishDate: "2022-11-10",
    addedDate: "2023-01-30",
    lastModified: "2023-01-30",
    rating: 4.5,
    downloadCount: 180,
    viewCount: 450,
    isPublic: false,
    isFeatured: false,
    metadata: {
      pages: 280,
      format: "PDF",
    },
  },
  {
    id: "6",
    title: "Mahabharata - Epic Audio",
    description: "The complete Mahabharata epic narrated in Sanskrit with English subtitles.",
    type: "audiobook",
    category: "Epics",
    author: "Vyasa",
    narrator: "Pandit Ravi Shankar",
    language: "Sanskrit",
    status: "Available",
    tags: ["epic", "mahabharata", "sanskrit", "classical"],
    thumbnail: "/sai-baba-with-devotees-showing-community-unity-and.png",
    fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: "24:15:30",
    fileSize: "2.8 GB",
    addedDate: "2023-03-01",
    lastModified: "2023-03-01",
    rating: 4.9,
    downloadCount: 1200,
    viewCount: 3500,
    isPublic: true,
    isFeatured: true,
    metadata: {
      format: "MP3",
      bitrate: "320 kbps",
    },
  },
  {
    id: "7",
    title: "Sacred Temple Images",
    description: "Collection of beautiful temple photographs from across India.",
    type: "image",
    category: "Architecture",
    language: "English",
    status: "Available",
    tags: ["temple", "sacred", "photography", "india"],
    thumbnail: "/sai-baba-receiving-offerings-and-donations-with-ha.png",
    fileUrl: "/sai-baba-receiving-offerings-and-donations-with-ha.png",
    fileSize: "12.8 MB",
    addedDate: "2023-03-05",
    lastModified: "2023-03-05",
    rating: 4.7,
    downloadCount: 680,
    viewCount: 1800,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "PNG",
      quality: "High",
      resolution: "4K",
    },
  },
  {
    id: "8",
    title: "Yoga Meditation Guide",
    description: "Complete guide to yoga and meditation practices for spiritual growth.",
    type: "ebook",
    category: "Spiritual Texts",
    author: "Swami Sivananda",
    language: "English",
    status: "Available",
    tags: ["yoga", "meditation", "spiritual", "practice"],
    thumbnail: "/sai-baba-serene-face-with-orange-turban-and-peacef.png",
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    isbn: "978-0-987654-32-1",
    publishDate: "2023-02-20",
    addedDate: "2023-03-10",
    lastModified: "2023-03-10",
    rating: 4.6,
    downloadCount: 950,
    viewCount: 2400,
    isPublic: true,
    isFeatured: true,
    metadata: {
      pages: 320,
      format: "PDF",
    },
  },
  {
    id: "9",
    title: "Temple Ceremony Video",
    description: "Live recording of a traditional temple ceremony with rituals and prayers.",
    type: "video",
    category: "Rituals",
    language: "Hindi",
    status: "Available",
    tags: ["ceremony", "temple", "rituals", "traditional"],
    thumbnail: "/sai-baba-teaching-and-speaking-to-gathered-devotee.png",
    fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "1:25:15",
    fileSize: "3.2 GB",
    addedDate: "2023-03-15",
    lastModified: "2023-03-15",
    rating: 4.8,
    downloadCount: 420,
    viewCount: 1100,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "MP4",
      quality: "HD",
      resolution: "1080p",
    },
  },
  {
    id: "10",
    title: "Vedic Chants Reference",
    description: "Complete reference guide for Vedic chants and mantras with pronunciation.",
    type: "document",
    category: "Language Learning",
    author: "Dr. Vedic Scholar",
    language: "Sanskrit",
    status: "Available",
    tags: ["vedic", "chants", "mantras", "pronunciation"],
    // thumbnail: "/placeholder.jpg", // No thumbnail to test placeholder images
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    fileSize: "5.2 MB",
    publishDate: "2023-01-05",
    addedDate: "2023-03-20",
    lastModified: "2023-03-20",
    rating: 4.4,
    downloadCount: 320,
    viewCount: 780,
    isPublic: false,
    isFeatured: false,
    metadata: {
      pages: 180,
      format: "PDF",
    },
  },
  {
    id: "11",
    title: "Spiritual Meditation Music",
    description: "Collection of peaceful meditation music for spiritual practice and relaxation.",
    type: "audiobook",
    category: "Music",
    language: "Sanskrit",
    status: "Available",
    tags: ["meditation", "music", "spiritual", "peaceful"],
    thumbnail: "/sai-baba-serene-face-with-orange-turban-and-peacef.png",
    fileUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: "2:15:30",
    fileSize: "1.8 GB",
    addedDate: "2023-04-01",
    lastModified: "2023-04-01",
    rating: 4.7,
    downloadCount: 650,
    viewCount: 1500,
    isPublic: true,
    isFeatured: true,
    metadata: {
      format: "MP3",
      bitrate: "320 kbps",
    },
  },
  {
    id: "12",
    title: "Temple Art Gallery",
    description: "Beautiful collection of traditional temple art and paintings from across India.",
    type: "image",
    category: "Art",
    language: "English",
    status: "Available",
    tags: ["art", "temple", "paintings", "traditional"],
    thumbnail: "/sai-baba-receiving-offerings-and-donations-with-ha.png",
    fileUrl: "/sai-baba-receiving-offerings-and-donations-with-ha.png",
    fileSize: "18.5 MB",
    addedDate: "2023-04-05",
    lastModified: "2023-04-05",
    rating: 4.8,
    downloadCount: 420,
    viewCount: 980,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "PNG",
      quality: "High",
      resolution: "4K",
    },
  },
  {
    id: "13",
    title: "Philosophy of Vedanta",
    description: "Deep exploration of Vedantic philosophy and its practical applications in daily life.",
    type: "ebook",
    category: "Philosophy",
    author: "Swami Chinmayananda",
    language: "English",
    status: "Available",
    tags: ["vedanta", "philosophy", "spiritual", "wisdom"],
    thumbnail: "/sai-baba-reading-sacred-texts-surrounded-by-books-.png",
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    isbn: "978-0-543210-98-7",
    publishDate: "2023-02-15",
    addedDate: "2023-04-10",
    lastModified: "2023-04-10",
    rating: 4.9,
    downloadCount: 780,
    viewCount: 2100,
    isPublic: true,
    isFeatured: true,
    metadata: {
      pages: 380,
      format: "PDF",
    },
  },
  {
    id: "14",
    title: "Historical Temple Documentary",
    description: "Comprehensive documentary about the history and significance of ancient temples.",
    type: "video",
    category: "History",
    language: "English",
    status: "Available",
    tags: ["history", "temple", "documentary", "ancient"],
    thumbnail: "/sai-baba-teaching-and-speaking-to-gathered-devotee.png",
    fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "1:45:20",
    fileSize: "4.2 GB",
    addedDate: "2023-04-15",
    lastModified: "2023-04-15",
    rating: 4.6,
    downloadCount: 290,
    viewCount: 750,
    isPublic: true,
    isFeatured: false,
    metadata: {
      format: "MP4",
      quality: "HD",
      resolution: "1080p",
    },
  },
  {
    id: "15",
    title: "Sanskrit Learning Workbook",
    description: "Interactive workbook for learning Sanskrit with exercises and practice materials.",
    type: "document",
    category: "Language Learning",
    author: "Prof. Sanskrit Kumar",
    language: "Sanskrit",
    status: "Available",
    tags: ["sanskrit", "learning", "workbook", "exercises"],
    // thumbnail: "/placeholder.jpg", // No thumbnail to test placeholder images
    fileUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    fileSize: "6.8 MB",
    publishDate: "2023-03-01",
    addedDate: "2023-04-20",
    lastModified: "2023-04-20",
    rating: 4.5,
    downloadCount: 180,
    viewCount: 420,
    isPublic: false,
    isFeatured: false,
    metadata: {
      pages: 220,
      format: "PDF",
    },
  },
]

const defaultAdvancedFilters: AdvancedFilters = {
  selectedTypes: [],
  selectedCategories: [],
  selectedStatuses: [],
  selectedLanguages: [],
  selectedAuthors: [],
  selectedTags: [],
  publishDateFrom: "",
  publishDateTo: "",
  addedDateFrom: "",
  addedDateTo: "",
  hasThumbnail: null,
  isPublic: null,
  isFeatured: null,
  minRating: 0,
  maxRating: 5,
  minDownloadCount: 0,
  maxDownloadCount: 10000,
  titleContains: "",
  descriptionContains: "",
  authorContains: "",
  tagContains: "",
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  items: mockLibraryItems,
  searchTerm: "",
  typeFilter: "All Types",
  categoryFilter: "All Categories",
  statusFilter: "All Status",
  viewMode: "grid",
  isLoading: false,

  sortField: "title",
  sortDirection: "asc",

  // Pagination state
  currentPage: 1,
  itemsPerPage: 5,

  isDrawerOpen: false,
  drawerMode: null,
  selectedItem: null,

  isAdvancedFilterOpen: false,
  advancedFilters: defaultAdvancedFilters,

  isActionModalOpen: false,
  actionModalItem: null,
  actionModalAction: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ isLoading: loading }),
  simulateLoading: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ isLoading: false })
    }, 1500)
  },

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  duplicateItem: (id) =>
    set((state) => {
      const itemToDuplicate = state.items.find((item) => item.id === id)
      if (itemToDuplicate) {
        const duplicatedItem = {
          ...itemToDuplicate,
          id: Date.now().toString(),
          title: `${itemToDuplicate.title} (Copy)`,
          addedDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          downloadCount: 0,
          viewCount: 0,
          status: "Available",
          borrowedBy: undefined,
          borrowedDate: undefined,
          dueDate: undefined,
        }
        return { items: [...state.items, duplicatedItem] }
      }
      return state
    }),

  borrowItem: (id, borrowerId, dueDate) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Borrowed" as const,
              borrowedBy: borrowerId,
              borrowedDate: new Date().toISOString().split("T")[0],
              dueDate,
            }
          : item,
      ),
    })),

  returnItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Available" as const,
              borrowedBy: undefined,
              borrowedDate: undefined,
              dueDate: undefined,
            }
          : item,
      ),
    })),

  openDrawer: (mode, item) =>
    set({
      isDrawerOpen: true,
      drawerMode: mode,
      selectedItem: item || null,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      drawerMode: null,
      selectedItem: null,
    }),

  openAdvancedFilter: () => set({ isAdvancedFilterOpen: true }),
  closeAdvancedFilter: () => set({ isAdvancedFilterOpen: false }),
  setAdvancedFilters: (filters) => set({ advancedFilters: filters }),
  clearAdvancedFilters: () => set({ advancedFilters: defaultAdvancedFilters }),

  openActionModal: (item, action) => set({ 
    isActionModalOpen: true, 
    actionModalItem: item, 
    actionModalAction: action 
  }),
  closeActionModal: () => set({ 
    isActionModalOpen: false, 
    actionModalItem: null, 
    actionModalAction: null 
  }),

  setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),
  toggleSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    })),

  // Pagination methods
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
  resetPagination: () => set({ currentPage: 1 }),

  // Get paginated items and pagination info
  getPaginatedItems: () => {
    const { currentPage, itemsPerPage } = get()
    const filtered = get().filteredItems()
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedItems = filtered.slice(startIndex, endIndex)
    
    return {
      items: paginatedItems,
      currentPage,
      totalPages,
      totalItems: filtered.length,
      itemsPerPage,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, filtered.length)
    }
  },

  filteredItems: () => {
    const { items, searchTerm, typeFilter, categoryFilter, statusFilter, advancedFilters, sortField, sortDirection } = get()

    const filtered = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = typeFilter === "All Types" || item.type === typeFilter
      const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter

      const matchesAdvancedTypes =
        advancedFilters.selectedTypes.length === 0 || advancedFilters.selectedTypes.includes(item.type)

      const matchesAdvancedCategories =
        advancedFilters.selectedCategories.length === 0 || advancedFilters.selectedCategories.includes(item.category)

      const matchesAdvancedStatuses =
        advancedFilters.selectedStatuses.length === 0 || advancedFilters.selectedStatuses.includes(item.status)

      const matchesAdvancedLanguages =
        advancedFilters.selectedLanguages.length === 0 || advancedFilters.selectedLanguages.includes(item.language)

      const matchesAdvancedAuthors =
        advancedFilters.selectedAuthors.length === 0 ||
        (item.author && advancedFilters.selectedAuthors.includes(item.author))

      const matchesAdvancedTags =
        advancedFilters.selectedTags.length === 0 ||
        advancedFilters.selectedTags.some((tag) => item.tags.includes(tag))

      const matchesPublishDateFrom =
        !advancedFilters.publishDateFrom || (item.publishDate && item.publishDate >= advancedFilters.publishDateFrom)

      const matchesPublishDateTo =
        !advancedFilters.publishDateTo || (item.publishDate && item.publishDate <= advancedFilters.publishDateTo)

      const matchesAddedDateFrom =
        !advancedFilters.addedDateFrom || (item.addedDate && item.addedDate >= advancedFilters.addedDateFrom)

      const matchesAddedDateTo =
        !advancedFilters.addedDateTo || (item.addedDate && item.addedDate <= advancedFilters.addedDateTo)

      const matchesHasThumbnail =
        advancedFilters.hasThumbnail === null || (advancedFilters.hasThumbnail ? !!item.thumbnail : !item.thumbnail)

      const matchesIsPublic = advancedFilters.isPublic === null || item.isPublic === advancedFilters.isPublic

      const matchesIsFeatured = advancedFilters.isFeatured === null || item.isFeatured === advancedFilters.isFeatured

      const matchesRating =
        (item.rating || 0) >= advancedFilters.minRating && (item.rating || 0) <= advancedFilters.maxRating

      const matchesDownloadCount =
        item.downloadCount >= advancedFilters.minDownloadCount && item.downloadCount <= advancedFilters.maxDownloadCount

      const matchesTitleContains =
        !advancedFilters.titleContains ||
        item.title.toLowerCase().includes(advancedFilters.titleContains.toLowerCase())

      const matchesDescriptionContains =
        !advancedFilters.descriptionContains ||
        item.description.toLowerCase().includes(advancedFilters.descriptionContains.toLowerCase())

      const matchesAuthorContains =
        !advancedFilters.authorContains ||
        (item.author && item.author.toLowerCase().includes(advancedFilters.authorContains.toLowerCase()))

      const matchesTagContains =
        !advancedFilters.tagContains ||
        item.tags.some((tag) => tag.toLowerCase().includes(advancedFilters.tagContains.toLowerCase()))

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStatus &&
        matchesAdvancedTypes &&
        matchesAdvancedCategories &&
        matchesAdvancedStatuses &&
        matchesAdvancedLanguages &&
        matchesAdvancedAuthors &&
        matchesAdvancedTags &&
        matchesPublishDateFrom &&
        matchesPublishDateTo &&
        matchesAddedDateFrom &&
        matchesAddedDateTo &&
        matchesHasThumbnail &&
        matchesIsPublic &&
        matchesIsFeatured &&
        matchesRating &&
        matchesDownloadCount &&
        matchesTitleContains &&
        matchesDescriptionContains &&
        matchesAuthorContains &&
        matchesTagContains
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
        case "type":
          aValue = a.type.toLowerCase()
          bValue = b.type.toLowerCase()
          break
        case "category":
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case "addedDate":
          aValue = new Date(a.addedDate).getTime()
          bValue = new Date(b.addedDate).getTime()
          break
        case "downloadCount":
          aValue = a.downloadCount
          bValue = b.downloadCount
          break
        case "rating":
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        default:
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  },
}))
