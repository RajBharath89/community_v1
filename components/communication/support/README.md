# Support Tickets Module

A comprehensive support ticket management system for the ABC temple management application.

## Features

### Core Functionality
- **Create Tickets**: Users can create new support tickets with detailed information
- **View Tickets**: View ticket details, comments, and history
- **Edit Tickets**: Update ticket information, status, and assignments
- **Delete Tickets**: Remove tickets with confirmation
- **Duplicate Tickets**: Create copies of existing tickets

### Ticket Management
- **Categories**: Technical, General, Account, Billing, Feature Request, Bug Report
- **Priorities**: Low, Medium, High, Critical
- **Status Tracking**: Open, In Progress, Resolved, Closed, Pending
- **Assignment**: Assign tickets to team members
- **Tags**: Add custom tags for better organization
- **Comments**: Add internal and external comments
- **Attachments**: Support for file attachments

### Search & Filtering
- **Basic Search**: Search by title, description, or ticket ID
- **Quick Filters**: Filter by status, priority, and category
- **Advanced Filters**: Comprehensive filtering options including:
  - Date ranges (created/updated)
  - Assignee selection
  - Content-based searches
  - Boolean filters (has attachments, has comments)

### Data Management
- **Import/Export**: Excel file support for bulk operations
- **Sorting**: Sort by any column with ascending/descending order
- **Pagination**: Efficient handling of large ticket volumes
- **View Modes**: Table and card view options

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Consistent Styling**: Matches the application's design system
- **Real-time Updates**: Immediate feedback on actions
- **Accessibility**: ARIA labels and keyboard navigation support

## Components

### Main Components
- `SupportTicketManagement`: Main container component
- `SupportTicketTable`: Table view with search and filters
- `SupportTicketDrawer`: Detailed view/edit interface
- `ActionButtons`: Create, import, export, and filter actions
- `StatsCards`: Dashboard metrics display
- `AdvancedFilterDrawer`: Comprehensive filtering interface

### Supporting Components
- `SearchFilters`: Basic search and quick filters
- `TablePagination`: Pagination controls
- `SkeletonLoaders`: Loading state components

## Data Structure

### SupportTicket Interface
```typescript
interface SupportTicket {
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
```

### TicketComment Interface
```typescript
interface TicketComment {
  id: string
  content: string
  author: string
  authorRole: string
  timestamp: string
  isInternal: boolean
}
```

## State Management

The module uses Zustand for state management with the `useSupportTicketStore` hook, providing:
- Ticket CRUD operations
- Search and filtering state
- UI state management (drawers, modals)
- Advanced filtering capabilities

## Usage

1. Navigate to the Support Tickets section from the Hub module
2. Use the "Create Ticket" button to add new tickets
3. Search and filter tickets using the available options
4. Click on tickets to view details and add comments
5. Use the action buttons for bulk operations

## Integration

The module integrates with:
- Application header navigation
- Consistent UI components
- Toast notifications for user feedback
- Excel import/export functionality
- Responsive design system

## Future Enhancements

Potential improvements could include:
- Email notifications for ticket updates
- SLA tracking and alerts
- Knowledge base integration
- Advanced reporting and analytics
- API integration for external systems
- Mobile app support
