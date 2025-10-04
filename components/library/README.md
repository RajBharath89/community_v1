# Library Module

A comprehensive digital library management system for the ABC temple application, providing full CRUD functionality for managing spiritual texts, audiobooks, images, videos, and documents.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, Read, Update, Delete library items
- **Multiple Media Types**: Support for ebooks, audiobooks, images, videos, and documents
- **Advanced Filtering**: Comprehensive filtering system with multiple criteria
- **Search & Sort**: Powerful search and sorting capabilities
- **Import/Export**: Excel-based import and export functionality
- **Borrowing System**: Track item borrowing and returns
- **Statistics**: Download and view tracking

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Grid & List Views**: Toggle between grid and list view modes
- **Advanced Filters**: Detailed filtering with multiple criteria
- **Drawer Interface**: Clean drawer-based editing and viewing
- **Consistent Styling**: Matches the application's design system

### Data Management
- **State Management**: Zustand-based state management
- **Type Safety**: Full TypeScript support
- **Validation**: Form validation and error handling
- **Mock Data**: Pre-populated with sample data for testing

## Components

### Core Components
- `LibraryManagement`: Main management component
- `LibraryTable`: Table/grid view container
- `LibraryDrawer`: Drawer for viewing/editing items
- `ActionButtons`: Import/export and add item buttons
- `StatsCards`: Statistics overview cards

### View Components
- `LibraryGridView`: Grid view for library items
- `LibraryListView`: List view for library items
- `LibraryTableContent`: Content wrapper with pagination

### Filter Components
- `SearchFilters`: Basic search and filter controls
- `AdvancedFilterDrawer`: Advanced filtering interface
- `AdvancedFilterDrawerContent`: Advanced filter form

### Utility Components
- `TablePagination`: Pagination controls
- `SkeletonLoaders`: Loading state components

## Data Structure

### LibraryItem Interface
```typescript
interface LibraryItem {
  id: string
  title: string
  description: string
  type: "ebook" | "audiobook" | "image" | "video" | "document"
  category: string
  author?: string
  narrator?: string
  duration?: string
  fileSize?: string
  language: string
  status: "Available" | "Borrowed" | "Maintenance" | "Archived"
  tags: string[]
  thumbnail?: string
  fileUrl?: string
  isbn?: string
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
    pages?: number
    format?: string
    quality?: string
    resolution?: string
    bitrate?: string
  }
}
```

## Usage

### Basic Usage
```tsx
import LibraryManagement from "@/components/library/library-management"

export default function LibraryPage() {
  return <LibraryManagement />
}
```

### Store Usage
```tsx
import { useLibraryStore } from "@/stores/library-store"

function MyComponent() {
  const { 
    items, 
    addItem, 
    updateItem, 
    deleteItem,
    filteredItems 
  } = useLibraryStore()

  // Use store methods and data
}
```

## Features in Detail

### 1. CRUD Operations
- **Create**: Add new library items with comprehensive form
- **Read**: View items in grid or list format
- **Update**: Edit existing items with full form validation
- **Delete**: Remove items with confirmation

### 2. Advanced Filtering
- Filter by type, category, status, language
- Date range filtering (publish date, added date)
- Rating and download count ranges
- Boolean filters (public, featured, has thumbnail)
- Text search in titles, descriptions, authors, tags

### 3. Import/Export
- Import items from Excel files (.xlsx, .xls)
- Export filtered items to Excel
- Comprehensive field mapping
- Error handling and validation

### 4. Borrowing System
- Track item borrowing status
- Set due dates
- Manage borrower information
- Return item functionality

### 5. Statistics
- Download count tracking
- View count tracking
- Rating system
- Featured items highlighting

## Styling

The Library module follows the application's design system:
- Consistent color scheme (red/orange theme)
- Responsive grid layouts
- Hover effects and transitions
- Loading states and skeletons
- Accessible form controls

## Navigation

The Library module is integrated into the main navigation:
- Main Library page: `/library`
- Ebooks: `/library/ebooks`
- Audiobooks: `/library/audiobooks`
- Gallery: `/library/gallery`

## Dependencies

- **Zustand**: State management
- **Radix UI**: UI components
- **Lucide React**: Icons
- **XLSX**: Excel import/export
- **Sonner**: Toast notifications
- **Tailwind CSS**: Styling

## Future Enhancements

- File upload functionality
- Advanced search with full-text search
- User favorites and bookmarks
- Reading progress tracking
- Comments and reviews system
- Batch operations
- API integration
- Caching and performance optimization
