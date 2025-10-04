export interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
}
