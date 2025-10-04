import { SearchFilters } from "./search-filters"
import { FormTableContent } from "./form-table-content"
import { FormPagination } from "./form-pagination"

export function FormTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      <SearchFilters />
      <FormTableContent />
      <FormPagination />
    </div>
  )
}
